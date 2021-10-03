const fs = require("fs");
const ini = require("ini");
const chalk = require("chalk");
const { Table } = require("console-table-printer");

const { urmModes, urmRcFile, presetRegistries } = require("./const");

// 获取 urm 的配置
function getUrmConfig() {
  return fs.existsSync(urmRcFile) ? ini.parse(fs.readFileSync(urmRcFile, "utf-8")) : {};
}

// 设置 urm 的配置
function setUrmConfig(urmConfig) {
  fs.writeFileSync(urmRcFile, ini.stringify(urmConfig));
}

// 获取 urm 当前的默认模式
function getUrmDefaultMode() {
  const urmConfig = getUrmConfig();
  return urmConfig.mode || urmModes[0];
}

// 判断是否是有效的 HTTP URL
function isValidHttpUrl(str) {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

// 获取全部可选的 registry
function getAvailableRegistries() {
  const urmConfig = getUrmConfig();
  const registries = {
    ...urmConfig.presetRegistries,
    ...urmConfig.customRegistries,
  };
  return Object.keys(registries).map((name) => {
    const registryItem = registries[name];
    return {
      name,
      registry: registryItem.registry,
      defaultOnSelectToUse: registryItem.defaultOnSelectToUse,
    };
  });
}

// 以表格的形式展示全部可选的 registry
function printAvailableRegistriesTable(curRegistries = []) {
  const availableRegistries = getAvailableRegistries();

  if (!availableRegistries.length) {
    console.log(chalk.yellow(`no registry available, use ${chalk.green("'urm list restore'")} to restore registry list to default`));
    return;
  }

  const availableRegistriesTable = new Table({
    title: "Available Registry List",
    columns: [
      { name: "name", alignment: "left" },
      { name: "registry", alignment: "left" },
    ],
  });

  availableRegistries.forEach((availableRegistry) => {
    // 高亮显示已被使用的 registry
    const isUsing = curRegistries.some((curRegistry) => new URL(curRegistry.registry).href === new URL(availableRegistry.registry).href);
    availableRegistriesTable.addRow(
      {
        name: `${isUsing ? "* " : ""}${availableRegistry.name}`,
        registry: availableRegistry.registry,
      },
      {
        color: isUsing ? "green" : "crimson",
      }
    );
  });

  availableRegistriesTable.printTable();
}

// 恢复可选的 registry 列表到预设状态
function restoreAvailableRegistries() {
  const urmConfig = getUrmConfig();
  urmConfig.presetRegistries = presetRegistries;
  urmConfig.customRegistries = {};
  setUrmConfig(urmConfig);
}

module.exports = {
  getUrmConfig,
  setUrmConfig,
  getUrmDefaultMode,
  isValidHttpUrl,
  getAvailableRegistries,
  printAvailableRegistriesTable,
  restoreAvailableRegistries,
};
