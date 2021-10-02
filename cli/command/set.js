const chalk = require("chalk");
const inquirer = require("inquirer");
const { Argument } = require("commander");

const { getPmConfig } = require("../../lib/pm-config/index");
const { getAvailableRegistries } = require("../../lib/utils");

// 设置 registry
module.exports = (program) => {
  const pmConfig = getPmConfig(program.opts().mode);

  program
    .command("set")
    .alias("use")
    .addArgument(new Argument("[name]", "specify a named registry to use"))
    .addArgument(new Argument("[scope]", "specify the scope of the registry"))
    .addArgument(new Argument("[where]", "where to save the registry config").choices(pmConfig.configFileTypes))
    .description(`set registry of the package manager (choices of where: ${pmConfig.configFileTypes.map((v) => `"${v}"`).join(", ")})`)
    .action(async (name, scope, where) => {
      try {
        const availableRegistries = getAvailableRegistries();
        if (!availableRegistries.length) {
          console.log(chalk.yellow(`no registry available, use ${chalk.green("'urm list restore'")} to restore registry list to default`));
          return;
        }

        const configFilesPaths = await pmConfig.getConfigFilePaths();
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
            choices: pmConfig.configFileTypes.map((fileType) => ({
              name: `${fileType} (${configFilesPaths[fileType]})`,
              value: fileType,
            })),
            name: "where",
            when: !where,
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
