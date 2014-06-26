var fs = require('fs');
var path = require('path');
var prompt = require('promptly').prompt;
var extend = require('xtend');

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
    this.dirname = opts.dirname || process.cwd();
    this.logger = opts.logger || {
        log: noop
    };
    this.path = path.join(this.templates, name);
    this.contentPath = this.path + '/content';
    this.mod = require(this.path);
    this.values = extend(opts, {
        year: new Date().getFullYear()
    });
    this.updateJSON = opts['update-json'];
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
    self.dest = path.join(this.dirname, dest);
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
                prompt('  ' + desc.trim(), done);
            }
        } else if (key === undefined) {
            if (!self.dest) {
                self.dest = path.join(self.dirname,
                    self.values.project);
            }
            self.variables = Object.keys(vars)
                .reduce(function (acc, key) {
                    acc[key] = self.values[key];
                    return acc;
                }, {});
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

    var written = false;
    self.files().forEach(function(file){
        var uri = self.parse(file);
        var out = path.join(self.dest,
            uri.replace(self.contentPath, ''));

        out = out.replace("dotgitignore", ".gitignore");

        // directory
        if (self.directories[file]) {
            try {
                fs.mkdirSync(out, 0775);
                self.logger.log('  create :', out);
            } catch (err) {
                // ignore
            }
        // file
        } else {
            if (!fs.existsSync(out)) {
                var str = self.parse(fs.readFileSync(file, 'utf8'));
                fs.writeFileSync(out, str);
                if (written === false) {
                    self.logger.log();
                    written = true;
                }
                self.logger.log('  create :', out);
            } else if (self.updateJSON && (
                out.substr(-5) === '.json' ||
                path.basename(out) === '.jshintrc'
            )) {
                var srcBuf = fs.readFileSync(out, 'utf8');
                var destBuf = self.parse(fs.readFileSync(file, 'utf8'));

                if (srcBuf === destBuf) {
                    return;
                }

                var srcJSON = JSON.parse(srcBuf);
                var destJSON = JSON.parse(destBuf);

                var targetJSON = extend(srcJSON, destJSON);
                var targetBuf = JSON.stringify(targetJSON, null, '  ');
                fs.writeFileSync(out, targetBuf);
                if (written === false) {
                    self.logger.log();
                    written = true;
                }
                self.logger.log('  create :', out);
            }
        }
    });

    if (written) {
        self.logger.log();
    }
    self.logger.log('finished generating',
        self.dest, '\n', self.variables);
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
