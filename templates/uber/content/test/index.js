var test = global.it;
var assert = require('assert');

var {{projectName}} = require('../index.js');

test('{{projectName}} is a function', function (end) {
    assert.strictEqual(typeof {{projectName}}, 'function');
    end();
});
