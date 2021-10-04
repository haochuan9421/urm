const inquirer = require("inquirer");
const { Option } = require("commander");

const { getPmConfig } = require("../../lib/pm-config/index");

// 清空 registry 配置
module.exports = (program) => {
  return program
    .command("clear")
    .description(i18n.A009)
    .addOption(new Option("-y --yes", i18n.A010))
    .action(async ({ yes }) => {
      try {
        const pmConfig = getPmConfig(program.opts().mode);
        const registries = await pmConfig.getRemovableRegistries();
        if (!registries.length) {
          console.log(i18n.A011);
          await pmConfig.printCurRegistriesTable();
          return;
        }

        const { clear } = await inquirer.prompt([
          {
            type: "confirm",
            message: i18n.A012,
            name: "clear",
            default: true,
            when: !yes,
          },
        ]);

        if (yes || clear) {
          await pmConfig.clearRegistry();
          console.log(i18n.A013);
          await pmConfig.printCurRegistriesTable();
        }
      } catch (error) {
        console.log(i18n.A014, error);
      }
    });
};
