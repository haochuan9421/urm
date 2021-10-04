const { printAvailableRegistriesTable } = require("../../../../lib/utils");

// 以表格的形式列出所有可选的 registry
module.exports = (program) => {
  program
    .command("list", {
      isDefault: true,
      hidden: true,
    })
    .action(async () => {
      try {
        printAvailableRegistriesTable();
      } catch (error) {
        console.log(i18n.A052, error);
      }
    });
};
