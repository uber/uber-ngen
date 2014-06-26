# `{cmd} [name] [description] [options]`

Creates a new project. Will write the project to a folder called
  `name` in the current working directory or in the directory
  specified with `--dirname=dir`.

Example:

`{cmd} new-project 'new description of project'`

Options:
    --template=[str]        Which template to use
    --directory=[str]       Which directory templates live in.
    --name=[str]            Set name of project
    --dirname=[str]         Parent directory of new project
    --description=[str]     Set description of project
    --update-json           extend files in target folder
{options}

 - `--dirname` defaults to `process.cwd()`

## `{cmd} --help`

Prints this message
