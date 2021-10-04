const { printAvailableRegistriesTable, restoreAvailableRegistries } = require("../../../../lib/utils");

// 恢复可选列表到默认状态
module.exports = (program) =>
  program
    .command("restore")
    .description(i18n.A056)
    .action(async () => {
      try {
        restoreAvailableRegistries();
        console.log(i18n.A057);
        printAvailableRegistriesTable();
      } catch (error) {
        console.log(i18n.A058, error);
      }
    });
