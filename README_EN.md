# urm (Universal Registry Manager)

> Manager [registry](https://docs.npmjs.com/misc/registry/) config easily, support multiple package managers ([npm](https://www.npmjs.com/)、[yarn](https://classic.yarnpkg.com/)、[berry](https://yarnpkg.com/)), design for multi projects and multi [scopes](https://docs.npmjs.com/misc/scope/).

<p align="center">
    <a href="https://www.npmjs.com/package/@haochuan9421/urm" target="_blank"><img src="https://img.shields.io/npm/v/@haochuan9421/urm.svg?style=flat-square" alt="Version"></a>
    <a href="https://npmcharts.com/compare/@haochuan9421/urm?minimal=true" target="_blank"><img src="https://img.shields.io/npm/dm/@haochuan9421/urm.svg?style=flat-square" alt="Downloads"></a>
    <a href="https://github.com/HaoChuan9421/urm" target="_blank"><img src="https://visitor-badge.glitch.me/badge?page_id=haochuan9421.urm"></a>
    <a href="https://github.com/HaoChuan9421/urm/commits/master" target="_blank"><img src="https://img.shields.io/github/last-commit/haochuan9421/urm.svg?style=flat-square" alt="Commit"></a>
    <a href="https://github.com/HaoChuan9421/urm/issues" target="_blank"><img src="https://img.shields.io/github/issues-closed/haochuan9421/urm.svg?style=flat-square" alt="Issues"></a>
    <a href="https://github.com/HaoChuan9421/urm/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/@haochuan9421/urm.svg?style=flat-square" alt="License"></a>
</p>

[简体中文](https://github.com/HaoChuan9421/urm/blob/master/README.md)&emsp;
[English](https://github.com/HaoChuan9421/urm/blob/master/README_EN.md)&emsp;

## Requirement

Node.js v12 or higher.

## Installation

```bash
npm i -g @haochuan9421/urm
# or
yarn global add @haochuan9421/urm
```

## Quick Start

```bash
# show current registry config
$ urm
# follow the prompts to set registry
$ urm set
# use taobao registry in "@vant" scope and save the config file to current project
$ urm set taobao --scope @vant --where project
# follow the prompts to unset registry
$ urm unset
```

## Usage

> <a href="https://user-images.githubusercontent.com/5093611/135977909-e23b3085-1031-4ad9-9571-086fda6d7376.png" target="_blank">One picture takes you to understand the use of URM</a>

> <a href="" target="_blank">One video takes you to understand the use of URM</a>

### The registry config of the package manager（npm、yarn...）

#### Show current config

```bash
# Show current registry config of the package manager
urm current
# Alias
urm cur
# "current" is the default command, can be omitted
urm
```

<img width="350" alt="current" src="https://user-images.githubusercontent.com/5093611/135977657-85db8479-18d4-4e10-a35c-32759186ed0a.png">

#### Add config

```bash
#  Follow the prompts to set registry
urm use
# Alias
urm set
# Skip prompt, use "taobao" registry in "@vant" scope and save the config file to current project
urm use taobao --scope @vant --where project
# Short form
urm use taobao -s @vant -w project
```

<img width="550" alt="use" src="https://user-images.githubusercontent.com/5093611/135978248-9aa43eb2-8a1d-4240-beea-361f72b42eb1.png">

#### Delete config

- Single delete

```bash
# Follow the prompts to unset registry
urm unuse
# Alias
urm unset
```

<img width="550" alt="unuse" src="https://user-images.githubusercontent.com/5093611/135978470-df10604e-7f78-42a1-b58f-c6f816e044a5.png">

- One-time empty

```bash
# Clear all registry config of the package manager
urm clear
# Skip prompt
urm clear -yes
# Short Form
urm clear -y
```

#### Toogle work mode

- Temporary switch

```bash
# Show the registry config of yarn
urm --mode yarn
# Short Form
urm -m yarn
# Add new registry config to yarn v2 (berry)
urm use -m yarn2
# Delete the registry config of npm
urm unuse -m npm
```

- Permanent switch

```bash
# Follow the prompts and select the default work mode of URM.
# when not specify the work mode by "--mode" argument, URM will work on the the default mode
urm mode
# Skip prompt, set the default work mode to yarn，choices: npm、yarn、yarn2
urm mode yarn
```

### Available Registry List

#### Show registry list

```bash
# Show available registry list，the registry in the list can be selected when you run "urm use" command，
# with this list, you don't need to remember a lot of registry urls
urm list
# Alias
urm ls
```

#### Add registry

```bash
# Follow the prompts and input the name and url of your custom registry
urm list add
# Skip prompt and specify the name and url of your custom registry
urm list add youzan https://npm.youzan.com/
```

<img width="400" alt="unuse" src="https://user-images.githubusercontent.com/5093611/135979280-d3ca066b-2830-4b94-8bd0-4e5c63a6a425.png">

#### Delete registry

```bash
# Follow the prompts and select the registry you want to delete
urm list del
# Skip prompt and delete the registry which name is youzan
urm list del youzan
```

#### Registry speed test

```bash
# Test the speed of taobao registry, the speed is the time used when access `${registry}/-/ping`
urm list ping taobao
# Test the speed of all registies
urm list ping
```

![image](https://user-images.githubusercontent.com/5093611/135975787-82b7e769-ea8b-4dfe-ad40-0b8189c8c73e.png)

#### Restore

```bash
# Restore the list to default, the preset list contains some fast and stable registries
urm list restore
```

## Programmatic

#### Local installation

```bash
npm i @haochuan9421/urm
# or
yarn add @haochuan9421/urm
```

#### Usage

```js
const urm = require("@haochuan9421/urm");

(async () => {
  // 获取 URM 封装的包管理器 (package manager) 实例
  const npmConfig = urm.pmConfig.getPmConfig("npm"); // choices "npm", "yarn", "yarn2"
  // 查看包管理器当前的 registry 配置，以数组的格式返回
  const curRegistries = await npmConfig.getCurRegistries();
  // 设置包管理器的 registry 配置
  await npmConfig.setRegistry("@vant", "https://registry.nlark.com/", { whereType: "project" });
  // 删除包管理器的 registry 配置
  await npmConfig.delRegistry("@vant", { whereType: "project" });
  // 清除包管理器的全部 registry 配置
  await npmConfig.clearRegistry();
})();
```

具体可以参考 `lib/pm-config` 文件夹，不同的包管理器在方法的实现上不尽相同，但是实现的接口都是一样的，这有利于后续支持其他的包管理器。

## Star History

[![Stargazers over time](https://starchart.cc/haochuan9421/urm.svg)](https://starchart.cc/haochuan9421/urm)
