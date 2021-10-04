const chalk = require("chalk");

const { printAvailableRegistriesTable } = require("../../lib/utils");
const { getPmConfig } = require("../../lib/pm-config/index");

// 以表格的形式列出当前的 npm registry 配置
module.exports = (program) => {
  program
    .command("current", { isDefault: true })
    .alias("cur")
    .description("show current registry config of the package manager")
    .action(async () => {
      try {
        const pmConfig = getPmConfig(program.opts().mode);
        const curRegistries = await pmConfig.printCurRegistriesTable();
        printAvailableRegistriesTable(curRegistries);
      } catch (error) {
        console.log(chalk.red("failed to display current registry config"), error);
      }
    });
};
