const chalk = require("chalk");

module.exports = {
  A001: `specify work mode of "urm"`,
  A002: `output the version number`,
  A003: `Sub Commands Of List:`,
  A004: `Examples:`,
  A005: `show current registry config`,
  A006: `follow the prompts to set registry`,
  A007: `use taobao registry in "@antd" scope and save the config file to current project`,
  A008: `follow the prompts to unset registry`,

  A009: `clear all registry config of the package manager`,
  A010: `skip prompt and clear`,
  A011: chalk.yellow(`the current registry config is not from config file, 'urm' can't remove it.\nrun ${chalk.green("'urm set'")} and select a new registry may override it.`),
  A012: `are you sure you want to clear all registry config`,
  A013: chalk.green(`\nclear successfully\n`),
  A014: chalk.red(`failed to clear registry`),

  A015: `show current registry config of the package manager`,
  A016: `failed to display current registry config`,

  A017: (defaultMode) => `set the default work mode of 'urm', current is ${chalk.green.bold(defaultMode)}`,
  A018: `select the default work mode of "urm"`,
  A019: chalk.green(`\nswitch successfully\n`),
  A020: chalk.red("failed to change the default work mode"),

  A021: `specify a named registry to use`,
  A022: `specify the scope of the registry`,
  A023: `where to save the registry config`,
  A024: `set registry of the package manager`,
  A025: chalk.yellow(`no registry available, use ${chalk.green("'urm list restore'")} to restore registry list to default`),
  A026: `which registry do you want to use`,
  A027: `input a scope to use the registry (eg: @myscope), or keep empty to use as default registry:`,
  A028: `where do you prefer to save the npm registry config`,
  A029: chalk.green(`\nset successfully\n`),
  A030: chalk.red("failed to set registry"),

  A031: `unset registry of the package manager`,
  A032: `which registry do you want to remove`,
  A033: chalk.green(`\nunset successfully\n`),
  A034: chalk.red("failed to remove the registry config"),

  A035: `show available registry list`,
  A036: `name of the registry`,
  A037: `registry url`,
  A038: `add new registry`,
  A039: `input the name of the registry`,
  A040: `registry name is required`,
  A041: `input the url of the registry`,
  A042: `registry url is required`,
  A043: (name) => `${name} already exists, Do you want to continue?`,
  A044: `your registry url looks like not a valid http url, Do you want to continue?`,
  A045: chalk.green(`\nadd successfully\n`),
  A046: chalk.red("failed to add registry"),

  A047: `delete registry`,
  A048: `no registry available`,
  A049: `which registry do you want to delete`,
  A050: chalk.green(`\ndelete successfully\n`),
  A051: chalk.red("failed to delete registry"),

  A052: chalk.red("failed to display registry list"),

  A053: `test speed of the named registry, or test all if no name supplied`,
  A054: `invalid registry`,
  A055: chalk.red("failed to test the registry speed"),

  A056: `restore registry list to default`,
  A057: chalk.green(`\nrestore successfully\n`),
  A058: chalk.red("failed to restore registry list"),

  A059: `Available Registry List`,
  A060: `Current Registry Config Of Npm`,
  A061: `Current Registry Config Of Yarn`,
  A062: `Current Registry Config Of Yarn2`,
};
