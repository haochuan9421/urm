const chalk = require("chalk");
const inquirer = require("inquirer");
const { getUrmConfig, setUrmConfig, isValidHttpUrl, getAvailableRegistries, printAvailableRegistriesTable } = require("../../../../lib/utils");

// 添加新的 registry 到可选列表
module.exports = (program) =>
  program
    .command("add")
    .argument("[name]", "name of the registry")
    .argument("[registry]", "registry url")
    .description("add new registry")
    .action(async (name, registry) => {
      try {
        const availableRegistries = getAvailableRegistries();
        const answers = await inquirer.prompt([
          {
            name: "name",
            type: "input",
            message: "input the name of the registry",
            when: !name,
            validate: (value) => (value ? true : "registry name is required"),
          },
          {
            name: "registry",
            type: "input",
            message: "input the url of the registry",
            when: !registry,
            validate: (value) => (value ? true : "registry url is required"),
          },
          {
            type: "confirm",
            message: (answers) => `${name || answers.name} already exists, Do you want to continue?`,
            name: "continueWhenSameName",
            default: false,
            when: (answers) => availableRegistries.some((availableRegistry) => availableRegistry.name === (name || answers.name)),
          },
          {
            type: "confirm",
            message: "your registry url looks like not a valid http url, Do you want to continue?",
            name: "continueWhenInvalidUrl",
            default: false,
            when: (answers) => answers.continueWhenSameName !== false && !isValidHttpUrl(registry || answers.registry),
          },
        ]);

        if (answers.continueWhenSameName !== false && answers.continueWhenInvalidUrl !== false) {
          name = answers.name || name;
          registry = answers.registry || registry;
          registry = new URL(registry).href;

          const urmConfig = getUrmConfig();
          urmConfig.customRegistries = {
            ...urmConfig.customRegistries,
            [name]: {
              registry: registry,
            },
          };
          setUrmConfig(urmConfig);
          console.log(chalk.green(`\n🎉 add successfully 🎉\n`));
          printAvailableRegistriesTable();
        }
      } catch (error) {
        console.log(chalk.red("failed to add registry"), error);
      }
    });
