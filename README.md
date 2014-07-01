# uber-ngen

`uber-ngen` is a scaffolding module used to scaffold out
  any kind of project.

## Creating a template for ngen

`ngen` is a tool that creates the new files for your project.

You author an `ngen` template and you can then use `ngen` to 
  create a new folder based on the template.

An `ngen` template is a folder with an `index.js` and a `content`
  folder inside it. For example:

```
./my-template
    content/*
    index.js
```

### The `content` folder.

One of the simplest content folders might look like

```
./content
    index.js
    README.md
    package.json
    test/
        {{project}}.js
```

You basically specify what kind of files you want in a 
  new project.

Note that the content of a template can contain nested folders
  and that you can use template variables in the file names to
  have dynamic file names.

#### The `content` files

Each one of the files should just have the default text that you
  would want in it. For example a package.json might look like:

```json
{
    "name": "{{project}}",
    "version": "1.0.0",
    "scripts": {
        "test": "node test/{{project}}.js"
    },
    "devDependencies": {
        "tape": "^2.0.0"
    }
}
```

Note that we can use `{{variableName}}` as template variables
  inside the files.


## Docs

`uber-ngen` can also be called directly

```js
var ngen = require('uber-ngen/bin/ngen.js')

ngen({
    directory: '/directory/to/template',
    template: 'name-of-template',

    name: 'name of new project'
}, function (err) {
    /* finished scaffolding. */

    /* will write new project to `process.cwd()/{options.name}` */
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

## Installation

`npm install rt-logger`

## MIT Licenced

  [usage]: https://github.com/uber/uber-ngen/tree/master/bin/usage.md



