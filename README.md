# uber-ngen

`uber-ngen` is a scaffolding module used to scaffold out
  any kind of project.
  
## Using `uber-ngen`

To use this tool:

 - `npm install uber-ngen --global`
 - `uber-ngen`

When running `uber-ngen` you will be prompted:

```
raynos at raynos-ThinkPad-T440p  ~/uber
$ uber-ngen

Project name: my-thingy-localizer
Project description: Localized the thingies
Is open source? [Y/n]: n
```

Fill out the questions. You can then get started:

 - `cd $projectName`
 - `git init`
 - `git add .`
 - `git commit -m 'Initial commit'`
 - `git remote add origin $remote`
 - `git push origin master`
 - `npm install`
 - `npm test`

Once you've got your tests passing your ready to 
write some new code.

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

### The top level `index.js`

Adjacent to your `content` folder you want to specify an
  `index.js`. The `index.js` will define all the variables
  available in your `content` folder.

For example:

```js
module.exports = {
    project: 'Project name: ',
    year: function (values, callback) {
        callback(null, new Date().getFullYear())
    }
};
```

Here we are saying that this template will have two variables
  available in the `content` folder, namely `{{project}}` and
  `{{year}}`.

When you specify your variables they can be either a string or
  a function.

If the variable definition is a string then we 
  will asynchronously prompt the user with the string and then
  assign the user input on the CLI into that variable.

If the variable defintion is a function then we will call your
  function with all the current variable values we have and a
  callback. You are then expected to eventually return us the
  result.

We will call your functions in property order on your
  `module.exports`. So if one variable depends on another it's
  recommended you list them in that order.


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


### JSON

You can pass in service attributes eg projectName, hasCelery in json form, instead of prompting
  the user.

## Installation

`npm install uber-ngen`

## MIT Licenced

  [usage]: https://github.com/uber/uber-ngen/tree/master/bin/usage.md



