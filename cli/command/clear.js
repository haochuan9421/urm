const chalk = require("chalk");
const inquirer = require("inquirer");

const { getPmConfig } = require("../../lib/pm-config/index");

// 清空 registry 配置
module.exports = (program) => {
  const pmConfig = getPmConfig(program.opts().mode);

  return program
    .command("clear")
    .description("clear all registry config of the package manager")
    .action(async () => {
      try {
        const registries = await pmConfig.getRemovableRegistries();
        if (!registries.length) {
          console.log(
            chalk.yellow(
              `the current registry config is not from ${chalk.cyan("config file")}, 'urm' can't remove it.
run ${chalk.green("'urm set'")} and select a new registry may override it.`
            )
          );
          await pmConfig.printCurRegistriesTable();
          return;
        }

        const { clear } = await inquirer.prompt([
          {
            type: "confirm",
            message: "are you sure you want to clear all registry config",
            name: "clear",
            default: true,
          },
        ]);

        if (clear) {
          await pmConfig.clearRegistry();
          console.log(chalk.green(`\n🎉 clear successfully 🎉\n`));
          await pmConfig.printCurRegistriesTable();
        }
      } catch (error) {
        console.log(chalk.red("failed to clear registry"), error);
      }
    });
};
