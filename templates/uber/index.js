var spawn = require('child_process').spawn;
var camelize = require('camelize');

module.exports = {
    project: 'Project name: ',
    description: 'Project description: ',
    name: function(values, callback) {
        var called = false;
        var proc = spawn('git', [
            '--bare',
            'config',
            '--global',
            'user.name'
        ]);

        proc.stdout.once('data', function (chunk) {
            called = true;
            callback(null, chunk);
        });
        proc.stdout.once('error', callback);
        proc.stdout.once('end', function () {
            if (called) {
                return;
            }

            callback(new Error('please configure user.name in git'));
        });
    },
    email: function(values, callback) {
        var called = false;
        var proc = spawn('git', [
            '--bare',
            'config',
            '--global',
            'user.email'
        ]);

        proc.stdout.once('data', function (chunk) {
            called = true;
            callback(null, chunk);
        });
        proc.stdout.once('error', callback);
        proc.stdout.once('end', function () {
            if (called) {
                return;
            }

            callback(new Error('please configure user.email in git'));
        });
    },
    projectName: function (values, callback) {
        callback(null, camelize(values.project));
    }
};
