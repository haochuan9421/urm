const ora = require("ora");
const { eachSeries } = require("async");
const npmFetch = require("npm-registry-fetch");

const { isValidHttpUrl, getAvailableRegistries } = require("../../../../lib/utils");

// 测速
module.exports = (program) =>
  program
    .command("ping")
    .argument("[name]", i18n.A036)
    .description(i18n.A053)
    .action(async (name) => {
      try {
        let registries = getAvailableRegistries();
        if (name) {
          const targetRegistry = registries.find((item) => item.name === name);
          registries = targetRegistry ? [targetRegistry] : registries;
        }

        const maxNameLen = Math.max(...registries.map(({ name }) => name.length));
        const maxRegistryLen = Math.max(...registries.map(({ registry }) => registry.length));

        await eachSeries(registries, (item, next) => {
          const { name, registry } = item;

          const spinnerText = `${name.padEnd(maxNameLen)} ${registry.padEnd(maxRegistryLen)}`;
          const spinner = ora({
            text: spinnerText,
            spinner: "earth",
          });
          spinner.start();

          if (isValidHttpUrl(registry)) {
            const start = Date.now();
            npmFetch("/-/ping", {
              registry,
              preferOnline: true,
              timeout: 3000,
            })
              .then((res) => res.text())
              .then(() => {
                spinner.succeed(`${spinnerText} ${Date.now() - start}ms`);
              })
              .catch((err) => {
                spinner.fail(`${spinnerText} ${err.message}`);
              })
              .finally(next);
          } else {
            spinner.fail(`${spinnerText} ${i18n.A054}`);
            next();
          }
        });
      } catch (error) {
        console.log(i18n.A055, error);
      }
    });
