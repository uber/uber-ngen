var fs = require('fs');
var join = require('path').join;
var prompt = require('promptly').prompt;
var chalk = require('chalk');

function noop() {}

/**
 * Initialize a new `Template` with the given `name`.
 *
 * @param {String} name
 * @api private
 */

function Template(name, opts) {
    if (!(this instanceof Template)) {
        return new Template(name, opts);
    }

    this.templates = opts.templates;
    this.description = opts.description;
    this.name = name;
    this.logger = opts.logger || {
        log: noop
    };
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

Template.prototype.init = function(dest, callback) {
    var self = this;
    var vars = self.mod;
    var keys = Object.keys(vars);

    self.values.project = dest;
    self.values.description = self.description;
    self.dest = dest;
    // print new line for pretties.
    self.logger.log();

    function parseLocal() {
        var desc;
        var key = keys.shift();

        function done(err, value) {
            if (err) {
                return callback(err);
            }

            self.values[key] = String(value).trim();
            parseLocal();
        }

        if (key && !self.values[key]) {
            desc = vars[key];
            if ('function' === typeof desc) {
                desc(self.values, done);
            } else {
                prompt(chalk.gray('  ' + desc.trim()), done);
            }
        } else if (key === undefined) {
            if (!self.dest) {
                self.dest = self.values.project;
            }
            self.create();
            if (callback) callback();
        } else {
            done(null, self.values[key]);
        }
    }

    parseLocal();
};

/**
 * Return the files for this template.
 *
 * @return {Array}
 * @api private
 */

Template.prototype.files = function() {
    var self = this;
    var files = [];

    (function readdirs(dir) {
        fs.readdirSync(dir).forEach(function(file){
            files.push(file = dir + '/' + file);
            var stat = fs.statSync(file);
            if (stat.isDirectory()) {
                self.directories[file] = true;
                readdirs(file);
            }
        });
    })(self.contentPath);

    return files;
};

/**
 * Create the template files.
 *
 * @api private
 */

Template.prototype.create = function() {
    var self = this;

    try {
        fs.mkdirSync(self.dest, 0775);
    } catch (err) {
        // ignore
    }

    self.logger.log();
    self.files().forEach(function(file){
        var uri = self.parse(file);
        var out = join(self.dest, uri.replace(self.contentPath, ''));

        out = out.replace(".Xignore", ".gitignore");

        // directory
        if (self.directories[file]) {
            try {
                fs.mkdirSync(out, 0775);
                self.logger.log(
                    chalk.gray('  create :'),
                    chalk.cyan(out));
            } catch (err) {
                // ignore
            }
        // file
        } else {
            if (!fs.existsSync(out)) {
                var str = self.parse(fs.readFileSync(file, 'utf8'));
                fs.writeFileSync(out, str);
                self.logger.log(
                    chalk.gray('  create :'),
                    chalk.cyan(out));
            }
        }
    });

    var jshintIgnorePath = join(self.dest, '.jshintignore');

    if (fs.existsSync(jshintIgnorePath)) {
        fs.unlink(jshintIgnorePath);
    }

    fs.symlinkSync('.gitignore', jshintIgnorePath);
    self.logger.log();
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
