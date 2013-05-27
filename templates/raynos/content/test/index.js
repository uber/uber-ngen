var test = require("tape")

var {{projectName}} = require("../index")

test("{{projectName}} is a function", function (assert) {
    assert.equal(typeof {{projectName}}, "function")
    assert.end()
})
