const chalk = require("chalk");
const inquirer = require("inquirer");
const { Argument, Option } = require("commander");

const { getPmConfig } = require("../../lib/pm-config/index");
const { getAvailableRegistries } = require("../../lib/utils");

// 设置 registry
module.exports = (program) => {
  program
    .command("set")
    .alias("use")
    .addArgument(new Argument("[name]", "specify a named registry to use"))
    .addOption(new Option("-s --scope <scope>", "specify the scope of the registry"))
    .addOption(new Option("-w --where <where>", "where to save the registry config"))
    .description(`set registry of the package manager`)
    .action(async (name, { scope, where }) => {
      try {
        const pmConfig = getPmConfig(program.opts().mode);
        const availableRegistries = getAvailableRegistries();
        if (!availableRegistries.length) {
          console.log(chalk.yellow(`no registry available, use ${chalk.green("'urm list restore'")} to restore registry list to default`));
          return;
        }

        const configFiles = await pmConfig.getConfigFiles();
        const answers = await inquirer.prompt([
          {
            type: "list",
            message: "which registry do you want to use",
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
            message: "input a scope to use the registry (eg: @myscope), or keep empty to use as default registry:",
            name: "scope",
            when: scope === undefined,
          },
          {
            type: "list",
            message: "where do you prefer to save the npm registry config",
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
        console.log(chalk.green(`\n🎉 set successfully 🎉\n`));
        await pmConfig.printCurRegistriesTable();
      } catch (error) {
        console.log(chalk.red("failed to set registry"), error);
      }
    });
};
