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
        template: opts.template || 'uber',
        options: opts.usageOptions || '',
        defaults: opts.usageDefaults || '',
        directoryName: opts.directoryName || 'uber-ngen/templates'
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

    opts.template = opts.t || opts.template || 'uber';
    opts.templates = opts.d || opts.directory ||
        path.join(__dirname, '..', 'templates');
    opts.name = opts.name || opts._[0];
    opts.description = opts.description || opts._[1];

    opts.logger = opts.logger || console;
    if (opts.json) {
        opts.jsonValues = require(opts.json);
    } else {
        opts.jsonValues = {};
    }


    // create template
    var tmpl = new Template(opts.template, opts);
    tmpl.init(opts.name, callback);
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
