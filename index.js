var fs = require('fs');
var path = require('path');
var prompt = require('promptly').prompt;
var extend = require('xtend');
var _ = require('underscore');

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
    this.path = path.join(this.templates, name);
    this.contentPath = this.path + '/content';
    this.mod = require(this.path + '/index.js');
    this.values = extend(opts, {
        year: new Date().getFullYear()
    });
    this.updateJSON = opts['update-json'];
    this.directories = {};
    this.fromJson = false;
    // Allowing overriding of values to be passed in instead of gathering them from user input.
    if (Object.keys(opts.jsonValues).length && Object.keys(opts.jsonValues).length > 0) {
        this.values = extend(
            this.values, opts.jsonValues);
        this.fromJson = true;
    }
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

    if (dest) {
        self.values.project = path.basename(dest);
    }
    self.dest = dest;
    // print new line for pretties.
    self.logger.log();

    function parseLocal() {
        var desc;
        var key = keys.shift();

        self.values.name = self.name;

        function done(err, value) {
            if (err) {
                return callback(err);
            }

            if (typeof value === 'string') {
                value = value.trim();
            }

            self.values[key] = value;
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
                self.dest = self.values.project;
            }
            self.variables = Object.keys(vars)
                .reduce(function (acc, key2) {
                    acc[key2] = self.values[key2];
                    return acc;
                }, {});
            self.create();
            if (callback) callback(null, self.values);
        } else {
            done(null, self.values[key]);
        }
    }
    if (!self.fromJson) {
        parseLocal();
    } else {
        if (!self.dest) {
            self.dest = self.values.project;
        }
        self.create();
        if (callback) callback(null, self.values);
    }
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

    //TODO make this a bit less janky
    try {
        this.exclusions = require(this.path + '/exclude.js')(this.values);
    } catch(e) {
        if (e.code !== 'MODULE_NOT_FOUND') { throw e; }
        this.exclusions = [];
    }

    (function readdirs(dir) {
        fs.readdirSync(dir).forEach(function(file){
            if(self.exclusions.indexOf(file) === -1) {
                files.push(file = dir + '/' + file);
                var stat = fs.statSync(file);
                if (stat.isDirectory()) {
                    self.directories[file] = true;
                    readdirs(file);
                }
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
        var stat;

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
                stat = fs.statSync(file);
                var buf = fs.readFileSync(file);
                var str = buf.toString();
                var parsed = self.parse(str);
                // If the parsed content is no different than the original,
                // write out the buffer to prevent encoding issues (e.g. images)
                var content = str === parsed ? buf : parsed;
                fs.writeFileSync(out, content, {
                    mode: stat.mode
                });
                if (written === false) {
                    self.logger.log();
                    written = true;
                }
                self.logger.log('  create :', out);
            } else if (self.updateJSON && (
                out.substr(-5) === '.json' ||
                path.basename(out) === '.jshintrc'
            )) {
                stat = fs.statSync(file);
                var srcBuf = fs.readFileSync(out, 'utf8');
                var destBuf = self.parse(fs.readFileSync(file, 'utf8'));

                if (srcBuf === destBuf) {
                    return;
                }

                var srcJSON = JSON.parse(srcBuf);
                var destJSON = JSON.parse(destBuf);

                var targetJSON = extend(srcJSON, destJSON);
                var targetBuf = JSON.stringify(targetJSON, null, '  ');
                fs.writeFileSync(out, targetBuf, {
                    mode: stat.mode
                });
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
    var settings = {
        interpolate: /\{\{(.+?)\}\}/g,
        evaluate: /\{\%(.+?)\%\}/g
    };
    return _.template(str, settings)(self.values);
};

module.exports = Template;
