# `{cmd} [name] [description] [options]`

Creates a new project. Will write the project to a folder called
  `name` in the current working directory.

Example:

`{cmd} new-project 'new description of project'`

Options:
    --template=[str]        Which template to use
    --directory=[str]       Which directory templates live in.
    --name=[str]            Set name of project
    --description=[str]     Set description of project
    --update-json           extend files in target folder
    --json                  Pass in service attributes in json format instead of getting prompted.
{options}

 - `--template` defaults to `{template}`
 - `--directory` defaults to `{directoryName}` folder
{defaults}

## `{cmd} --help`

Prints this message
