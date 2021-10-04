const path = require("path");
const { eachSeries } = require("async");
const { Table } = require("console-table-printer");
const { set, unset } = require("lodash");
const { Configuration, folderUtils } = require("@yarnpkg/core");
const { xfs, npath } = require("@yarnpkg/fslib");
const { getPluginConfiguration } = require("@yarnpkg/cli");
const { parseSyml, stringifySyml } = require("@yarnpkg/parsers");
class yarnConfig2 {
  constructor() {
    this.cwd = npath.toPortablePath(process.cwd());
    this.configFileTypes = ["project", "user"];
  }

  // 获取当前生效的全部 registry 配置
  async getCurRegistries() {
    const curRegistries = [];
    const rcFiles = await Configuration.findRcFiles(this.cwd);
    const configFiles = await this.getConfigFiles();
    rcFiles.forEach(({ path, data: { npmRegistryServer, npmScopes } }) => {
      let whereType;
      const configFile = configFiles.find((v) => v.path === path);
      if (configFile) {
        whereType = configFile.type;
      }

      if (npmRegistryServer && curRegistries.every((v) => v.scope !== "")) {
        curRegistries.push({
          registry: npmRegistryServer,
          scope: "",
          where: {
            whereType: whereType,
            wherePath: path,
          },
        });
      }

      if (npmScopes) {
        for (const scope in npmScopes) {
          if (npmScopes[scope].npmRegistryServer && curRegistries.every((v) => v.scope !== `@${scope}`)) {
            curRegistries.push({
              registry: npmScopes[scope].npmRegistryServer,
              scope: `@${scope}`,
              where: {
                whereType: whereType,
                wherePath: path,
              },
            });
          }
        }
      }
    });

    if (!curRegistries.length) {
      const configuration = await Configuration.find(this.cwd, getPluginConfiguration());
      const registry = configuration.values.get("npmRegistryServer");
      curRegistries.push({
        registry,
        scope: "",
        where: {
          whereType: process.env.YARN_NPM_REGISTRY_SERVER === registry ? "env" : "default",
        },
      });
    }

    return curRegistries;
  }

  // 以表格的形式展示当前的 registry 配置
  async printCurRegistriesTable() {
    return this.getCurRegistries().then((curRegistries) => {
      const currentRegistriesTable = new Table({
        title: `Current Registry Config Of Yarn2`,
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
    let config = xfs.existsSync(wherePath) ? parseSyml(await xfs.readFilePromise(wherePath, `utf8`)) : {};
    if (scope) {
      set(config, `npmScopes.${scope.replace("@", "")}.npmRegistryServer`, value);
    } else {
      set(config, "npmRegistryServer", value);
    }
    await xfs.changeFilePromise(wherePath, stringifySyml(config), {
      automaticNewlines: true,
    });
  }

  // 删除 registry
  async delRegistry(scope, { wherePath }) {
    let config = xfs.existsSync(wherePath) ? parseSyml(await xfs.readFilePromise(wherePath, `utf8`)) : {};
    if (scope) {
      unset(config, `npmScopes.${scope.replace("@", "")}.npmRegistryServer`);
    } else {
      unset(config, "npmRegistryServer");
    }
    await xfs.changeFilePromise(wherePath, stringifySyml(config), {
      automaticNewlines: true,
    });
  }

  // 获取全部可以删除的 registry
  async getRemovableRegistries() {
    return this.getCurRegistries().then((curRegistries) => curRegistries.filter(({ where }) => Boolean(where.wherePath)));
  }

  // 清空全部 registry
  async clearRegistry() {
    const rcFiles = await Configuration.findRcFiles(this.cwd);
    let removeMaxNeedCount = rcFiles.length;
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
    const rcFilename = process.env.YARN_RC_FILENAME || ".yarnrc.yml";
    const configuration = await Configuration.find(this.cwd, getPluginConfiguration());

    if (!configuration.projectCwd) {
      return Promise.reject(new Error(`you are not in a project folder`));
    }

    return [
      {
        type: "project",
        path: path.join(configuration.projectCwd, rcFilename),
      },
      {
        type: "user",
        path: path.join(folderUtils.getHomeFolder(), rcFilename),
      },
    ];
  }
}

module.exports = yarnConfig2;
