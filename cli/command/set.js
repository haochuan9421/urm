const inquirer = require("inquirer");
const { Argument, Option } = require("commander");

const { getPmConfig } = require("../../lib/pm-config/index");
const { getAvailableRegistries } = require("../../lib/utils");

// 设置 registry
module.exports = (program) => {
  program
    .command("set")
    .alias("use")
    .addArgument(new Argument("[name]", i18n.A021))
    .addOption(new Option("-s --scope <scope>", i18n.A022))
    .addOption(new Option("-w --where <where>", i18n.A023))
    .description(i18n.A024)
    .action(async (name, { scope, where }) => {
      try {
        const pmConfig = getPmConfig(program.opts().mode);
        const availableRegistries = getAvailableRegistries();
        if (!availableRegistries.length) {
          console.log(i18n.A025);
          return;
        }

        const configFiles = await pmConfig.getConfigFiles();
        const answers = await inquirer.prompt([
          {
            type: "list",
            message: i18n.A026,
            choices: () => {
              const maxNameLen = Math.max(...availableRegistries.map(({ name }) => name.length));
              return availableRegistries.map(({ name, registry }) => ({
                name: `${name.padEnd(maxNameLen)} ${registry}`,
                value: name,
              }));
            },
            name: "name",
            default: () => {
              const defaultRegistry = availableRegistries.find(({ defaultOnSelectToUse }) => defaultOnSelectToUse);
              return defaultRegistry && defaultRegistry.name;
            },
            when: !name || availableRegistries.every((availableRegistry) => availableRegistry.name !== name),
          },
          {
            type: "input",
            message: i18n.A027,
            name: "scope",
            when: scope === undefined,
          },
          {
            type: "list",
            message: i18n.A028,
            choices: pmConfig.configFileTypes.map((whereType) => {
              const wherePath = configFiles.find((file) => file.type === whereType).path;
              return {
                name: `${whereType} (${wherePath})`,
                value: { whereType, wherePath },
              };
            }),
            name: "where",
            when: !where || pmConfig.configFileTypes.indexOf(where) === -1,
          },
        ]);
        name = answers.name || name;
        scope = answers.scope || scope;
        where = answers.where || where;

        const value = availableRegistries.find((availableRegistry) => availableRegistry.name === name).registry;
        await pmConfig.setRegistry(scope, value, where);
        console.log(i18n.A029);
        await pmConfig.printCurRegistriesTable();
      } catch (error) {
        console.log(i18n.A030, error);
      }
    });
};
