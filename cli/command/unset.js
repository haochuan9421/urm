const chalk = require("chalk");
const inquirer = require("inquirer");

const { getPmConfig } = require("../../lib/pm-config");

// 删除 registry 配置
module.exports = (program) => {
  const pmConfig = getPmConfig(program.opts().mode);

  return program
    .command("unset")
    .alias("unuse")
    .description("unset registry of the package manager")
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

        const {
          unset: { scope, where },
        } = await inquirer.prompt([
          {
            type: "list",
            message: "which registry do you want to remove",
            choices: () => {
              const maxRegistryLen = Math.max(...registries.map(({ registry }) => registry.length));
              const maxScopeLen = Math.max(...registries.map(({ scope }) => scope.length));

              return registries.map(({ scope, registry, where }) => {
                return {
                  name: `${registry.padEnd(maxRegistryLen)} | scope: ${scope.padEnd(maxScopeLen)} | where: ${where}`,
                  value: { scope, registry, where },
                };
              });
            },
            name: "unset",
          },
        ]);

        await pmConfig.delRegistry(scope, where);
        console.log(chalk.green(`\n🎉 unset successfully 🎉\n`));
        await pmConfig.printCurRegistriesTable();
      } catch (error) {
        console.log(chalk.red("failed to remove the registry config"), error);
      }
    });
};
