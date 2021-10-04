const chalk = require("chalk");
const inquirer = require("inquirer");
const { getUrmConfig, setUrmConfig, getAvailableRegistries, printAvailableRegistriesTable } = require("../../../../lib/utils");

// 从可选列表中移除 registry
module.exports = (program) =>
  program
    .command("del")
    .argument("[name]", i18n.A036)
    .description(i18n.A047)
    .action(async (name) => {
      try {
        const availableRegistries = getAvailableRegistries();
        if (!availableRegistries.length) {
          console.log(chalk.yellow(i18n.A048));
          return;
        }

        const answers = await inquirer.prompt([
          {
            type: "list",
            message: i18n.A049,
            choices: () => {
              const maxNameLen = Math.max(...availableRegistries.map(({ name }) => name.length));

              return availableRegistries.map(({ name, registry }) => ({
                name: `${name.padEnd(maxNameLen)} ${registry}`,
                value: name,
              }));
            },
            name: "name",
            when: !name || availableRegistries.every((availableRegistry) => availableRegistry.name !== name),
          },
        ]);

        name = answers.name || name;
        const urmConfig = getUrmConfig();
        if (urmConfig.presetRegistries && urmConfig.presetRegistries[name]) {
          delete urmConfig.presetRegistries[name];
        }
        if (urmConfig.customRegistries && urmConfig.customRegistries[name]) {
          delete urmConfig.customRegistries[name];
        }
        setUrmConfig(urmConfig);
        console.log(i18n.A050);
        printAvailableRegistriesTable();
      } catch (error) {
        console.log(i18n.A051, error);
      }
    });
