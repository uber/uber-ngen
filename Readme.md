
# NGen

 NGen is a nodejs package generator, complete with best practices, package structure, package.json and more.

## Installation

```bash
$ npm install uber-ngen -g
```

## Example

You can use `uber-ngen` in three modes.

Run `uber-ngen` and then fill in the two fields for name & description.
Run `uber-ngen {{name}}` and then fill in the field for description
Run `uber-ngen {{name}} {{description}}` and fill in no fields.

`uber-ngen` will generate a folder that is called `{{name}}` in your CWD.

## Usage


```
Usage: uber-ngen [options] [path]

Options:

  -t, --template <name>   Use the template <name>
  -d, --directory <path>  Use the template directory <path>
  -V, --version           Output the current version
  -h, --help              Display help information
```


## Templates

### Uber

Currently the only available template, creating the following structure
 populated with content after the following questions are asked from the cli:

     Project Name: rt-uncaught-exception
     Project description: Our default uncaught exception handler

structure:
 
     ./test/index.js
     ./.jshintignore
     ./.gitignore
     ./index.js
     ./jshint.json
     ./package.json
     ./README.md

## License 

(The MIT License)

Copyright (c) 2011 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
