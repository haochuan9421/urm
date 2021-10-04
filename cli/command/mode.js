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
    .description(i18n.A017(defaultMode))
    .action(async (name) => {
      try {
        const answers = await inquirer.prompt([
          {
            type: "list",
            message: i18n.A018,
            choices: urmModes,
            name: "name",
            default: defaultMode,
            when: !name,
          },
        ]);

        urmConfig.mode = answers.name || name;
        setUrmConfig(urmConfig);
        console.log(i18n.A019);
      } catch (error) {
        console.log(i18n.A020, error);
      }
    });
};
