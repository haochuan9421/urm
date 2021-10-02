# urm (Universal Registry Manager)

> Manage `npm` and `yarn` [registry](https://docs.npmjs.com/misc/registry/) easily, designed for multiple projects and multiple [scopes](https://docs.npmjs.com/misc/scope/), can be used in CLI (Command-line interface) or programmatically.

### Requirements

Node.js v12 or higher

### Installation (use in CLI)

```bash
npm i -g @haochuan9421/urm
# or
yarn global add @haochuan9421/urm
```

### Example

```bash
# show current registry config
$ urm
# follow the prompts to set registry
$ urm set
# use taobao registry in "@antd" scope and save the config file to current project
$ urm set taobao --scope @antd --where project
# follow the prompts to unset registry
$ urm unset
```

### Usage

```
Usage: urm [options] [command]

Options:
  -m, --mode <name>         work mode of 'urm' (choices: "npm", "yarn", "yarn2", default: npm)
  -v, --version             output the version number
  -h, --help                display help for command

Commands:
  current|cur               show current registry config of the package manager
  set|use [options] [name]  set registry of the package manager
  unset|unuse               unset registry of the package manager
  clear                     clear all registry config of the package manager
  mode [name]               set the default work mode of 'urm', current is npm
  list|ls                   show available registry list
                            ----------------------------------------------------------------------------------------
                            Sub Commands Of List:
                            add [name] [registry]  add new registry
                            del [name]             delete registry
                            ping [name]            test speed of the named registry, or test all if no name supplied
                            restore                restore registry list to default
                            help [command]         display help for command
  
                            Examples:
                            $ urm list add huawei https://repo.huaweicloud.com/repository/npm/
                            $ urm list ping
                            ----------------------------------------------------------------------------------------
  help [command]            display help for command
```

### Programmatic

```js
const urm = require("@haochuan9421/urm");

(async () => {
  const npmConfig = urm.pmConfig.getPmConfig("npm"); // choice "npm", "yarn", "yarn2"
  const curRegistries = await npmConfig.getCurRegistries();
})();
```
