const { Command } = require("commander");

module.exports = function (program) {
  const listProgram = new Command("list");
  listProgram.alias("ls").description("show available registry list");
  require("./command/list")(listProgram);
  require("./command/add")(listProgram);
  require("./command/del")(listProgram);
  require("./command/ping")(listProgram);
  require("./command/restore")(listProgram);
  program.addCommand(listProgram);
};
