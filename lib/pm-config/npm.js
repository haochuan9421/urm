const os = require("os");
const path = require("path");
const npm = require("npm");
const { eachSeries } = require("async");
const { Table } = require("console-table-printer");

class npmConfig {
  constructor() {
    this.configFileTypes = ["project", "user", "global"];
  }

  // 获取当前生效的全部 registry 配置
  async getCurRegistries() {
    return npm.load().then(() => {
      const { data: npmCliConfig } = npm.config.data.get("cli");
      const registryKeys = ["registry"];
      // 沿着原型链查找，https://github.com/npm/config/blob/v2.3.0/lib/index.js#L134
      for (const key in npmCliConfig) {
        // 筛选出 “scope registry”（如：@myscope:registry）
        if (/(?<=@[\s\S]+:)registry/.test(key)) {
          registryKeys.push(key);
        }
      }

      const curRegistries = registryKeys.map((key) => ({
        registry: npmCliConfig[key],
        // registry 的作用范围
        scope: key === "registry" ? "" : key.substr(0, key.lastIndexOf(":")),
        // 配置项来源，同一个配置在多个地方存在时，cli > env > project > user > global > builtin > default
        where: npm.config.find(key),
      }));

      return curRegistries;
    });
  }

  // 以表格的形式展示当前的 registry 配置
  async printCurRegistriesTable() {
    return this.getCurRegistries().then((curRegistries) => {
      const currentRegistriesTable = new Table({
        title: `Current Registry Config Of Npm`,
        columns: [
          { name: "registry", alignment: "left" },
          { name: "scope", alignment: "left" },
          { name: "where", alignment: "left" },
        ],
      });
      currentRegistriesTable.addRows(curRegistries, { color: "crimson" });
      currentRegistriesTable.printTable();
      return curRegistries;
    });
  }

  // 设置 registry
  async setRegistry(scope, value, where) {
    const key = scope ? `${scope}:registry` : "registry";
    if (process.cwd() === os.homedir() && where === "project") {
      where = "user";
    }
    npm.config.set(key, value, where);
    return npm.config.save(where);
  }

  // 删除 registry
  async delRegistry(scope, where) {
    const key = scope ? `${scope}:registry` : "registry";
    npm.config.delete(key, where);
    return npm.config.save(where);
  }

  // 获取全部可以删除的 registry
  async getRemovableRegistries() {
    return this.getCurRegistries().then((curRegistries) => curRegistries.filter(({ where }) => this.configFileTypes.indexOf(where) !== -1));
  }

  // 清空全部 registry
  async clearRegistry() {
    let removeMaxNeedCount = this.configFileTypes.length;
    const remove = (registries) => {
      if (!registries.length) {
        return;
      }
      if (removeMaxNeedCount <= 0) {
        // 即使有高优先级配置文件覆盖了低优先级的的情况，每次至少也可以移除一种配置文件的全部配置，执行次数超出文件总数，既为异常
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
  async getConfigFilePaths() {
    return npm.load().then(() => ({
      project: path.join(npm.config.localPrefix, ".npmrc"),
      user: npm.config.get("userconfig"),
      global: path.join(npm.config.globalPrefix, "etc/npmrc"),
    }));
  }
}

module.exports = npmConfig;
