# uber-ngen

`uber-ngen` is a tool that will generate a new nodejs project
  for you. It includes best practices around the structure of
  your README and package.json

## Usage

`uber-ngen [name] [description] [flags]`

See [usage.md][usage] for more documentation

## Example

You can use `uber-ngen` in three modes.

Run `uber-ngen` and then fill in the two fields for name & description.
Run `uber-ngen {{name}}` and then fill in the field for description
Run `uber-ngen {{name}} {{description}}` and fill in no fields.

`uber-ngen` will generate a folder that is called `{{name}}` in your CWD.

## Templates

### Uber

Currently the only available template, creating the following 
  structure populated with content after the following questions 
  are asked from the cli:

     Project Name: rt-uncaught-exception
     Project description: Our default uncaught exception handler

structure:
 
     ./test/index.js
     ./.gitignore
     ./.jshintrc
     ./index.js
     ./package.json
     ./README.md
     ./LICENSE

## Docs

`uber-ngen` can also be called directly

```js
var Template = require('uber-ngen')

var t = Template('name-of-template', {
  templates: 'folder location of templates'
})
t.init('target location to write on disk', function (err) {
  // scaffolded the template to the location
  // calling init() will prompt on STDIN.
})
```

### Extend semantics

You can pass an `extend` boolean to `Template` i.e.

``js
var t = Template(name, { extend: true })
```

Or 

```sh
uber-ngen --extend=true
```

When you set `extend` to true the scaffolder will overwrite 
  JSON files by reading the current file on disk and extending
  it with the scaffold and writing that.

This means any keys set in the scaffolder will overwrite keys
  that are currently on disk in the folder.

The scaffolder will not touch or change any other existing
  files in the target folder and add any non-existing files to
  the target folder

## MIT Licenced

  [usage]: https://github.com/uber/uber-ngen/tree/master/bin/usage.md



