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

### update JSON

You can pass an `update-json` boolean to `Template` i.e.

```js
var t = Template(name, { "update-json": true })
```

Or 

```sh
uber-ngen --update-json=true
```

Normally the scaffolder will not overwrite existing files in
  the destination folder.

If you set `--update-json` to true, the scaffolder will 
  overwrite existing JSON files in the destination folder.

The way it overwrites is by merging the new version of the JSON
  file from the scaffolder into the destination folder.

It is not recommended you commit these new JSON files, the 
  scaffolder will probably have overwritten or deleted JSON
  fields you wanted to keep. It's recommended you use
  `git add -p` to cherry pick the new changes you want from the
  scaffolder.

## MIT Licenced

  [usage]: https://github.com/uber/uber-ngen/tree/master/bin/usage.md



