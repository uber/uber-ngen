#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var parseArgs = require('minimist');
var template = require('string-template');
var msee = require('msee');

var Template = require('../index.js');

function printHelp(opts) {
    opts = opts || {};

    var loc = path.join(__dirname, 'usage.md');
    var content = fs.readFileSync(loc, 'utf8');

    content = template(content, {
        cmd: opts.cmd || 'uber-ngen'
    });

    return console.log(msee.parse(content, {
        paragraphState: '\n'
    }));
}

function main(opts) {
    // parse arguments
    if (opts.h || opts.help || opts._.length === 0) {
        return printHelp(opts);
    }

    var template = opts.t || opts.template || 'uber';
    var templates = opts.d || opts.directory ||
        path.join(__dirname, '..', 'templates');
    var dest = opts._[0];
    var description = opts._[1];

    // create template
    var tmpl = new Template(template, {
        templates: templates,
        description: description,
        logger: console
    });
    tmpl.init(dest, function (err) {
        if (err) {
            console.error(err.message);
            return process.exit(1);
        }

        process.stdin.destroy();
    });
}

module.exports = main;

if (require.main === module) {
    main(parseArgs(process.argv.slice(2)));
}
