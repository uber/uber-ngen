#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var parseArgs = require('minimist');
var template = require('string-template');
var msee = require('msee');

var Template = require('../index.js');

module.exports = main;

function printHelp(opts) {
    opts = opts || {};

    var loc = path.join(__dirname, 'usage.md');
    var content = fs.readFileSync(loc, 'utf8');

    content = template(content, {
        cmd: opts.cmd || 'uber-ngen',
        options: opts.usageOptions || '',
        defaults: opts.usageDefaults || ''
    });

    return console.log(msee.parse(content, {
        paragraphStart: '\n'
    }));
}

function main(opts, callback) {
    callback = callback || defaultCallback;

    // parse arguments
    if (opts.h || opts.help) {
        printHelp(opts);
        return callback();
    }

    if (!opts.template) {
        var error = new Error('--template is required');
        return callback(error);
    }

    if (!opts.directory) {
        var error2 = new Error('--directory is required');
        return callback(error2);
    }

    opts.name = opts.name || opts._[0];
    opts.description = opts.description || opts._[1];
    opts.dirname = opts.dirname || process.cwd();
    opts.updateJSON = opts['update-json'] || opts.updateJSON;

    opts.logger = opts.logger || console;

    // create template
    var tmpl = new Template(opts);
    tmpl.init(callback);
}

function defaultCallback(err) {
    if (err) {
        console.error(err.message);
        return process.exit(1);
    }

    process.stdin.destroy();
}

if (require.main === module) {
    main(parseArgs(process.argv.slice(2)), defaultCallback);
}
