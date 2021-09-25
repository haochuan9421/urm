const npmConfig = require("./npm");
const yarnConfig = require("./yarn");
const yarn2Config = require("./yarn2");

exports.getPmConfig = function (program) {
  const { mode } = program.opts();
  switch (mode) {
    case "npm":
      return new npmConfig();
    case "yarn":
      return new yarnConfig();
    case "yarn2":
      return new yarn2Config();
  }
};
