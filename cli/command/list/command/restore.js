const chalk = require("chalk");
const { printAvailableRegistriesTable, restoreAvailableRegistries } = require("../../../../lib/utils");

// 恢复可选列表到默认状态
module.exports = (program) =>
  program
    .command("restore")
    .description("restore registry list to default")
    .action(async () => {
      try {
        restoreAvailableRegistries();
        console.log(chalk.green(`\n🎉 restore successfully 🎉\n`));
        printAvailableRegistriesTable();
      } catch (error) {
        console.log(chalk.red("failed to restore registry list"), error);
      }
    });
