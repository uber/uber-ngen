var fs = require('fs');
var join = require('path').join;

/**
 * Ask for user input.
 */

function ask(desc, callback) {
    process.stdout.write('  \033[90m' + desc + '\033[0m');
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function (chunk) {
        callback(null, chunk);
    }).resume();
}

/**
 * Initialize a new `Template` with the given `name`.
 *
 * @param {String} name
 * @api private
 */

function Template(name, opts) {
    this.templates = opts.templates;
    this.description = opts.description;
    this.name = name;
    this.path = join(this.templates, name);
    this.contentPath = this.path + '/content';
    this.mod = require(this.path);
    this.values = {
        year: new Date().getFullYear()
    };
    this.directories = {};
}

/**
 * Initialize template at `dest`.
 *
 * @param {String} dest
 * @api private
 */

Template.prototype.init = function(dest){
    var self = this;
    var vars = this.mod;
    var keys = Object.keys(vars);

    self.values.project = dest;
    self.values.description = this.description;
    self.dest = dest;
    console.log();

    function next() {
        var desc;
        var key = keys.shift();

        function done(err, value) {
            if (err) {
                console.error(err.message);
                return process.exit(1);
            }

            self.values[key] = String(value).trim();
            next();
        }

        if (key && !self.values[key]) {
            desc = vars[key];
            if ('function' === typeof desc) {
                desc(self.values, done);
            } else {
                ask(desc, done);
            }
        } else if (key === undefined) {
            process.stdin.destroy();
            if (!self.dest) {
                self.dest = self.values.project;
            }
            self.create();
        } else {
            done(null, self.values[key]);
        }
    }

    next();
};

/**
 * Return the files for this template.
 *
 * @return {Array}
 * @api private
 */

Object.defineProperty(Template.prototype, 'files', {
    get: function() {
        var self = this;
        var files = [];

        (function next(dir) {
            fs.readdirSync(dir).forEach(function(file){
                files.push(file = dir + '/' + file);
                var stat = fs.statSync(file);
                if (stat.isDirectory()) {
                    self.directories[file] = true;
                    next(file);
                }
            });
        })(this.contentPath);

        return files;
    }
});

/**
 * Create the template files.
 *
 * @api private
 */

Template.prototype.create = function(){
  // dest

    try {
        fs.mkdirSync(this.dest, 0775);
    } catch (err) {
        // ignore
    }

    var self = this;
    console.log();
    self.files.forEach(function(file){
        var uri = self.parse(file);
        var out = join(self.dest, uri.replace(self.contentPath, ''));

        out = out.replace(".Xignore", ".gitignore");

        // directory
        if (self.directories[file]) {
            try {
                fs.mkdirSync(out, 0775);
                console.log('  \033[90mcreate :\033[0m \033[36m%s\033[0m', out);
            } catch (err) {
                // ignore
            }
        // file
        } else {
            if (!fs.existsSync(out)) {
                var str = self.parse(fs.readFileSync(file, 'utf8'));
                fs.writeFileSync(out, str);
                console.log('  \033[90mcreate :\033[0m \033[36m%s\033[0m', out);
            }
        }
    });
    console.log();
};

/**
 * Parse `str`.
 *
 * @return {String}
 * @api private
 */

Template.prototype.parse = function(str){
    var self = this;
    return str
        .replace(/\{\{([^}]+)\}\}/g, function(_, key){
            return self.values[key];
        });
};

module.exports = Template;
