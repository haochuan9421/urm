const chalk = require("chalk");
const inquirer = require("inquirer");
const { Argument } = require("commander");

const { getUrmConfig, setUrmConfig, getUrmDefaultMode } = require("../../lib/utils");
const { urmModes } = require("../../lib/const");

// 切换 urm 的默认工作模式
module.exports = (program) => {
  const urmConfig = getUrmConfig();
  const defaultMode = getUrmDefaultMode();

  return program
    .command("mode")
    .addArgument(new Argument("[name]", "mode name").choices(urmModes))
    .description(`set the default work mode of 'urm', current is ${chalk.green.bold(defaultMode)}`)
    .action(async (name) => {
      try {
        const answers = await inquirer.prompt([
          {
            type: "list",
            message: "select the default work mode of 'urm'",
            choices: urmModes,
            name: "name",
            default: defaultMode,
            when: !name,
          },
        ]);

        urmConfig.mode = answers.name || name;
        setUrmConfig(urmConfig);
        console.log(chalk.green(`\n🎉 switch successfully 🎉\n`));
      } catch (error) {
        console.log(chalk.red("failed to change the default work mode"), error);
      }
    });
};
