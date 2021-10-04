const inquirer = require("inquirer");

const { getPmConfig } = require("../../lib/pm-config");

// 删除 registry 配置
module.exports = (program) => {
  return program
    .command("unset")
    .alias("unuse")
    .description(i18n.A031)
    .action(async () => {
      try {
        const pmConfig = getPmConfig(program.opts().mode);
        const registries = await pmConfig.getRemovableRegistries();
        if (!registries.length) {
          console.log(i18n.A011);
          await pmConfig.printCurRegistriesTable();
          return;
        }

        const {
          unset: { scope, where },
        } = await inquirer.prompt([
          {
            type: "list",
            message: i18n.A032,
            choices: () => {
              const maxRegistryLen = Math.max(...registries.map(({ registry }) => registry.length));
              const maxScopeLen = Math.max(...registries.map(({ scope }) => scope.length));

              return registries.map(({ scope, registry, where }) => {
                return {
                  name: `${registry.padEnd(maxRegistryLen)} | scope: ${scope.padEnd(maxScopeLen)} | where: ${where.wherePath}`,
                  value: { scope, registry, where },
                };
              });
            },
            name: "unset",
          },
        ]);

        await pmConfig.delRegistry(scope, where);
        console.log(i18n.A033);
        await pmConfig.printCurRegistriesTable();
      } catch (error) {
        console.log(i18n.A034, error);
      }
    });
};
