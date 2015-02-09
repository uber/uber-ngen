var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var prompt = require('promptly').prompt;
var camelize = require('camelize');
var format = require('util').format;

var version = require('../../package.json').version;

function fetchFromGitConfig(key) {
    function readValue(values, callback) {
        var called = false;
        var proc = spawn('git', [
            '--bare',
            'config',
            '--global',
            key
        ]);

        proc.stdout.once('data', function (chunk) {
            called = true;
            callback(null, String(chunk));
        });
        proc.stdout.once('error', callback);
        proc.stdout.once('end', function () {
            if (called) {
                return;
            }

            var message = format('please configure %s in git', key);
            callback(new Error(message));
        });
    }

    return readValue;
}

module.exports = {
    project: 'Project name: ',
    version: function (values, callback) {
        callback(null, version);
    },
    description: function (values, callback) {
        var pkg = path.join(values.project, 'package.json');

        fs.readFile(pkg, function (err, buf) {
            if (err) return promptFor();

            var json = JSON.parse(String(buf));
            if (!json.description) {
                return promptFor();
            }

            callback(null, json.description);
        });

        function promptFor() {
            prompt('  Project description: ', callback);
        }
    },
    gitName: fetchFromGitConfig('user.name'),
    email: fetchFromGitConfig('user.email'),
    projectNoDash: function readProjectNoDash(values, cb) {
        cb(null, values.project
            .replace(/\-/g, '')
            .toLowerCase());
    },
    projectName: function readProjectName(values, callback) {
        callback(null, camelize(values.project));
    }
};
