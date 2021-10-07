# urm (Universal Registry Manager)

> 通用的 [registry](https://docs.npmjs.com/misc/registry/) 配置管理工具, 支持多种包管理器（[npm](https://www.npmjs.com/)、[yarn](https://classic.yarnpkg.com/)、[berry](https://yarnpkg.com/)），为多项目和多 [scope](https://docs.npmjs.com/misc/scope/) 而设计。

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

## 环境要求

Node.js v12 及以上版本。

## 安装

```bash
npm i -g @haochuan9421/urm
# 或
yarn global add @haochuan9421/urm
```

## 快速入手

```bash
# 显示当前的 registry 配置
$ urm
# 根据提示设置 registry 配置
$ urm set
# 在安装 scope 为 "@vant" 的包时使用 taobao registry，并把配置文件保存到当前项目
$ urm set taobao --scope @vant --where project
# 根据提示删除 registry
$ urm unset
```

## 使用介绍

> <a href="https://user-images.githubusercontent.com/5093611/135905978-1526cec6-a11c-4ce7-9823-910bf09874a2.png" target="_blank">一张图带你了解 URM 的使用</a>

> <a href="https://www.bilibili.com/video/BV1x44y1t7qv" target="_blank">一个视频带你了解 URM 的使用</a>

### 包管理器（npm、yarn...）的 registry 配置

#### 查看当前配置

```bash
# 查看包管理器的 registry 配置
urm current
# 别名
urm cur
# current 是默认命令，可省略
urm
```

<img width="350" alt="current" src="https://user-images.githubusercontent.com/5093611/135975027-d36a0fb7-91fd-4ba1-b8bb-40b203056e6d.png">

#### 新增配置

```bash
# 按照提示新增一条 registry 配置
urm use
# 别名
urm set
# 跳过提示，直接手动设置，该命令表示在安装 scope 为 "@vant" 的包时使用 taobao registry，并把配置文件保存到当前项目
urm use taobao --scope @vant --where project
# 简写
urm use taobao -s @vant -w project
```

<img width="550" alt="use" src="https://user-images.githubusercontent.com/5093611/135975218-125a9ee9-a49b-4a07-b79b-54cd0ab88011.png">

#### 删除配置

- 单个删除

```bash
# 按照提示选择一条 registry 配置删除
urm unuse
# 别名
urm unset
```

<img width="550" alt="unuse" src="https://user-images.githubusercontent.com/5093611/135975327-84e70dbe-8b3b-4553-976f-9ffe204ec614.png">

- 一次性清空

```bash
# 一次性清除所有可删除的 registry 配置
urm clear
# 跳过确认提示
urm clear -yes
# 简写
urm clear -y
```

#### 工作模式切换

- 临时切换

```bash
# 查看 yarn 的 registry 配置
urm --mode yarn
# 简写
urm -m yarn
# 给 yarn v2 (berry) 新增一条 registry 配置
urm use -m yarn2
# 删除 npm 的 registry 配置
urm unuse -m npm
```

- 永久切换

```bash
# 按照提示选择一个包管理器作为 URM 的默认工作模式。
# 在不通过 --mode 指定其他包管理器的情况下，默认所有的操作都是工作在默认模式下的
urm mode
# 跳过提示，直接设置默认的工作模式为 yarn，目前可选的值有 npm、yarn、yarn2
urm mode yarn
```

### 备选的 registry 列表

#### 查看当前列表

```bash
# 查看所有可选的 registry，列表中的 registry 可以在你执行 urm use 时选择，
# 有了这个列表，可以极大的方便 registry 的设置，无需记住一大串的 URL
urm list
# 别名
urm ls
```

#### 添加 registry

```bash
# 按照提示输入 registry 的名称和 URL
urm list add
# 跳过提示，直接指定 registry 的名称和 URL
urm list add youzan https://npm.youzan.com/
```

<img width="400" alt="unuse" src="https://user-images.githubusercontent.com/5093611/135975550-3110def9-d7ec-494a-9ed8-5ede161313ab.png">

#### 删除 registry

```bash
# 按照提示从列表中选择一条删除
urm list del
# 跳过提示，直接从列表中删除名称是 youzan 的 registry
urm list del youzan
```

#### registry 测速

```bash
# 测试名称是 taobao 的 registry 的访问速度，检测的方式是计算访问 `${registry}/-/ping` 地址的耗时
urm list ping taobao
# 所有 registry 全部测速
urm list ping
```

![image](https://user-images.githubusercontent.com/5093611/135975787-82b7e769-ea8b-4dfe-ad40-0b8189c8c73e.png)

#### 重置列表

```bash
# 恢复列表到默认状态，预设的列表提供了几个国内访问比较稳定、快速的 registry
urm list restore
```

## 编程方式使用

#### 本地安装

```bash
npm i @haochuan9421/urm
# 或
yarn add @haochuan9421/urm
```

#### 使用 urm

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

## Star 趋势

[![Stargazers over time](https://starchart.cc/haochuan9421/urm.svg)](https://starchart.cc/haochuan9421/urm)
