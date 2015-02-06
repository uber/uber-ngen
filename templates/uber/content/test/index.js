'use strict';

var test = require('tape');

var {{projectName}} = require('../index.js');

test('{{projectName}} is a function', function t(assert) {
    assert.equal(typeof {{projectName}}, 'function');

    assert.end();
});

test('{{projectName}} is not implemented', function t(assert) {
    assert.throws(function throwIt() {
        {{projectName}}();
    }, /Not Implemented/);

    assert.end();
});
