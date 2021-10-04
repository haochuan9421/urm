const inquirer = require("inquirer");
const { getUrmConfig, setUrmConfig, isValidHttpUrl, getAvailableRegistries, printAvailableRegistriesTable } = require("../../../../lib/utils");

// 添加新的 registry 到可选列表
module.exports = (program) =>
  program
    .command("add")
    .argument("[name]", i18n.A036)
    .argument("[registry]", i18n.A037)
    .description(i18n.A038)
    .action(async (name, registry) => {
      try {
        const availableRegistries = getAvailableRegistries();
        const answers = await inquirer.prompt([
          {
            name: "name",
            type: "input",
            message: i18n.A039,
            when: !name,
            validate: (value) => (value ? true : i18n.A040),
          },
          {
            name: "registry",
            type: "input",
            message: i18n.A041,
            when: !registry,
            validate: (value) => (value ? true : i18n.A042),
          },
          {
            type: "confirm",
            message: (answers) => i18n.A043(name || answers.name),
            name: "continueWhenSameName",
            default: false,
            when: (answers) => availableRegistries.some((availableRegistry) => availableRegistry.name === (name || answers.name)),
          },
          {
            type: "confirm",
            message: i18n.A044,
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
          console.log(i18n.A045);
          printAvailableRegistriesTable();
        }
      } catch (error) {
        console.log(i18n.A046, error);
      }
    });
