const os = require("os");
const fs = require("fs");
const path = require("path");
const ini = require("ini");
const { set, unset } = require("lodash");
const { eachSeries } = require("async");
const mkdirp = require("mkdirp");
const { Table } = require("console-table-printer");
const { parse, stringify } = require("@yarnpkg/lockfile");

class yarnConfig {
  constructor() {
    this.filename = "yarnrc";
    this.localfile = `.${this.filename}`;
    this.configFileTypes = ["project", "user", "global"];
    this.home = os.homedir();
    this.userHome = this._isRootUser() ? path.resolve("/usr/local/share") : this.home;
  }

  // 获取当前生效的全部 registry 配置
  async getCurRegistries() {
    const curRegistries = [];

    // yarn v1 会读取 npm 的配置，且权重更高
    const npmRcFiles = this._getPossibleConfigLocations("npmrc");
    npmRcFiles.forEach((rcFile) => {
      const fileContent = fs.readFileSync(rcFile, { encoding: "utf-8" });
      const config = ini.parse(fileContent);
      for (const key in config) {
        let scope;
        if (key === "registry") {
          scope = "";
        } else if (/(?<=@[\s\S]+:)registry/.test(key)) {
          scope = key.substr(0, key.lastIndexOf(":"));
        }

        if (typeof scope !== "undefined" && curRegistries.every((v) => v.scope !== scope)) {
          curRegistries.push({
            registry: config[key],
            scope,
            where: {
              whereType: "npm",
              wherePath: rcFile,
            },
          });
        }
      }
    });

    const yarnRcFiles = this._getPossibleConfigLocations(this.filename);
    const configFiles = await this.getConfigFiles();
    yarnRcFiles.forEach((rcFile) => {
      const fileContent = fs.readFileSync(rcFile, { encoding: "utf-8" });
      const { object: config } = parse(fileContent);

      let whereType;
      const configFile = configFiles.find((v) => v.path === rcFile);
      if (configFile) {
        whereType = configFile.type;
      }

      for (const key in config) {
        let scope;
        if (key === "registry") {
          scope = "";
        } else if (/(?<=@[\s\S]+:)registry/.test(key)) {
          scope = key.substr(0, key.lastIndexOf(":"));
        }

        if (typeof scope !== "undefined" && curRegistries.every((v) => v.scope !== scope)) {
          curRegistries.push({
            registry: config[key],
            scope,
            where: {
              whereType: whereType,
              wherePath: rcFile,
            },
          });
        }
      }
    });

    if (!curRegistries.length) {
      if (process.env.NPM_CONFIG_REGISTRY) {
        curRegistries.push({
          registry: process.env.NPM_CONFIG_REGISTRY,
          scope: "",
          where: { whereType: "npm" },
        });
      } else if (process.env.YARN_REGISTRY) {
        curRegistries.push({
          registry: process.env.YARN_REGISTRY,
          scope: "",
          where: { whereType: "env" },
        });
      } else {
        curRegistries.push({
          registry: "https://registry.yarnpkg.com/",
          scope: "",
          where: { whereType: "default" },
        });
      }
    }

    return curRegistries;
  }

  // 以表格的形式展示当前的 registry 配置
  async printCurRegistriesTable() {
    return this.getCurRegistries().then((curRegistries) => {
      const currentRegistriesTable = new Table({
        title: i18n.A061,
        columns: [
          { name: "registry", alignment: "left" },
          { name: "scope", alignment: "left" },
          { name: "where", alignment: "left" },
        ],
      });
      currentRegistriesTable.addRows(
        curRegistries.map((v) => ({
          ...v,
          where: v.where.whereType || v.where.wherePath,
        })),
        { color: "crimson" }
      );
      currentRegistriesTable.printTable();
      return curRegistries;
    });
  }

  // 设置 registry
  async setRegistry(scope, value, { wherePath }) {
    let config = fs.existsSync(wherePath) ? parse(fs.readFileSync(wherePath, { encoding: "utf-8" })).object : {};
    if (scope) {
      set(config, `${scope}:registry`, value);
    } else {
      set(config, "registry", value);
    }
    mkdirp.sync(path.dirname(wherePath));
    this._writeFilePreservingEol(wherePath, `${stringify(config)}\n`);
  }

  // 删除 registry
  async delRegistry(scope, { wherePath }) {
    if (wherePath.endsWith(this.filename)) {
      let config = fs.existsSync(wherePath) ? parse(fs.readFileSync(wherePath, { encoding: "utf-8" })).object : {};
      if (scope) {
        unset(config, `${scope}:registry`);
      } else {
        unset(config, "registry");
      }
      this._writeFilePreservingEol(wherePath, `${stringify(config)}\n`);
    } else {
      let config = fs.existsSync(wherePath) ? ini.parse(fs.readFileSync(wherePath, { encoding: "utf-8" })) : {};
      if (scope) {
        unset(config, `${scope}:registry`);
      } else {
        unset(config, "registry");
      }
      this._writeFilePreservingEol(wherePath, `${ini.stringify(config)}\n`);
    }
  }

  // 获取全部可以删除的 registry
  async getRemovableRegistries() {
    return this.getCurRegistries().then((curRegistries) => curRegistries.filter(({ where }) => Boolean(where.wherePath)));
  }

  // 清空全部 registry
  async clearRegistry() {
    let removeMaxNeedCount = this._getPossibleConfigLocations(this.filename).length + this._getPossibleConfigLocations("npmrc").length;
    const remove = (registries) => {
      if (!registries.length) {
        return;
      }
      if (removeMaxNeedCount <= 0) {
        return Promise.reject(new Error("fail to clear registry"));
      }
      removeMaxNeedCount--;
      return eachSeries(registries, async ({ scope, where }) => this.delRegistry(scope, where))
        .then(() => this.getRemovableRegistries()) // 递归删除，直到获取不到可删除的 registry 为止
        .then(remove);
    };

    return this.getRemovableRegistries().then(remove);
  }

  // 获取配置文件的完整路径
  async getConfigFiles() {
    return [
      {
        type: "project",
        path: path.join(process.cwd(), this.localfile),
      },
      {
        type: "user",
        path: path.join(this.userHome, this.localfile),
      },
      {
        type: "global",
        path: path.join(this._getGlobalPrefix(), "etc", this.filename),
      },
    ];
  }

  _isRootUser() {
    if (process.platform !== "win32" && process.getuid) {
      return 0 === process.getuid();
    }
    return false;
  }

  _getGlobalPrefix() {
    if (process.env.PREFIX) {
      return process.env.PREFIX;
    } else if (process.platform === "win32") {
      // c:\node\node.exe --> prefix=c:\node\
      return path.dirname(process.execPath);
    }
    // /usr/local/bin/node --> prefix=/usr/local
    let prefix = path.dirname(path.dirname(process.execPath));

    // destdir only is respected on Unix
    if (process.env.DESTDIR) {
      prefix = path.join(process.env.DESTDIR, prefix);
    }

    return prefix;
  }

  _getPossibleConfigLocations(filename) {
    let possibles = [];
    const localfile = `.${filename}`;
    // .npmrc, ~/.npmrc, ${prefix}/etc/npmrc
    possibles = possibles.concat([path.join(process.cwd(), localfile), path.join(this.userHome, localfile), path.join(this._getGlobalPrefix(), "etc", filename)]);

    // When home directory for global install is different from where $HOME/npmrc is stored,
    // E.g. /usr/local/share vs /root on linux machines, check the additional location
    if (this.home !== this.userHome) {
      possibles.push(path.join(this.home, localfile));
    }

    // ../.npmrc, ../../.npmrc, etc.
    const foldersFromRootToCwd = process.cwd().replace(/\\/g, "/").split("/");
    while (foldersFromRootToCwd.length > 1) {
      possibles.push(path.join(foldersFromRootToCwd.join(path.sep), localfile));
      foldersFromRootToCwd.pop();
    }

    const actuals = [];

    for (const loc of possibles) {
      if (actuals.indexOf(loc) === -1 && fs.existsSync(loc)) {
        actuals.push(loc);
      }
    }

    return actuals;
  }

  _writeFilePreservingEol(path, data) {
    const eol = this._getEolFromFile(path) || os.EOL;
    if (eol !== "\n") {
      data = data.replace(/\n/g, eol);
    }
    fs.writeFileSync(path, data);
  }

  _getEolFromFile(path) {
    const cr = "\r".charCodeAt(0);
    const lf = "\n".charCodeAt(0);

    if (!fs.existsSync(path)) {
      return undefined;
    }

    const buffer = fs.readFileSync(path);

    for (let i = 0; i < buffer.length; ++i) {
      if (buffer[i] === cr) {
        return "\r\n";
      }
      if (buffer[i] === lf) {
        return "\n";
      }
    }
    return undefined;
  }
}

module.exports = yarnConfig;
