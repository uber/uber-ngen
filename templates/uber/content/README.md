# {{project}}

<!--
    [![build status][build-png]][build]
    [![Coverage Status][cover-png]][cover]
    [![Davis Dependency status][dep-png]][dep]
-->

<!-- [![NPM][npm-png]][npm] -->

{{description}}

## Example

```js
var {{projectName}} = require("{{project}}");

// TODO. Show example
```

## Concept and Motivation

// TODO. Explain what your module achieves and why.

## API Documentation

// TODO. State what the module does.

## Installation

`npm install {{project}}`

## Tests

`npm test`

## NPM scripts

 - `npm run cover` This runs the tests with code coverage
 - `npm run lint` This will run the linter on your code
 - `npm test` This will run the tests.
 - `npm run view-cover` This will show code coverage in a browser

## Contributors

 - {{gitName}}

{% if (open) { %}## MIT Licenced{% } %}

  [build-png]: https://secure.travis-ci.org/uber/{{project}}.png
  [build]: https://travis-ci.org/uber/{{project}}
  [cover-png]: https://coveralls.io/repos/uber/{{project}}/badge.png
  [cover]: https://coveralls.io/r/uber/{{project}}
  [dep-png]: https://david-dm.org/uber/{{project}}.png
  [dep]: https://david-dm.org/uber/{{project}}
  [test-png]: https://ci.testling.com/uber/{{project}}.png
  [tes]: https://ci.testling.com/uber/{{project}}
  [npm-png]: https://nodei.co/npm/{{project}}.png?stars&downloads
  [npm]: https://nodei.co/npm/{{project}}
