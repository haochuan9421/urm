#!/usr/bin/env node

const chalk = require("chalk");
const { Command, Option } = require("commander");
const updateNotifier = require("update-notifier");

const pkg = require("../package.json");
const { urmModes } = require("../lib/const");
const { getUrmDefaultMode } = require("../lib/utils");

// 检测 npm 版本，提示用户更新
updateNotifier({
  pkg,
  updateCheckInterval: 24 * 60 * 60 * 1000, // 每天
}).notify({ isGlobal: true });

const urmProgram = new Command("urm");

// 增加模式切换选项
urmProgram.addOption(
  (() => {
    const defaultMode = getUrmDefaultMode();
    const modeOpt = new Option("-m, --mode <name>", "work mode of 'urm'");
    modeOpt.choices(urmModes);
    modeOpt.default(defaultMode, chalk.green.bold(defaultMode));
    return modeOpt;
  })()
);

urmProgram.version(pkg.version, "-v, --version");

// 注册命令
require("./command/current")(urmProgram);
require("./command/set")(urmProgram);
require("./command/unset")(urmProgram);
require("./command/clear")(urmProgram);
require("./command/mode")(urmProgram);
require("./command/list")(urmProgram);

// 优化帮助信息的显示
urmProgram.configureHelp({
  subcommandDescription(cmd) {
    if (cmd.name() !== "list") {
      return cmd.description();
    }

    const urmHelper = urmProgram.createHelp();
    const padStart = " ".repeat(urmHelper.longestSubcommandTermLength(urmProgram, urmHelper) + 2);

    const { listSubCommands, maxTermLen } = cmd
      .createHelp()
      .visibleCommands(cmd)
      .reduce(
        (result, subcmd) => {
          const term = subcmd.createHelp().subcommandTerm(subcmd);
          const desc = subcmd.description();
          result.maxTermLen = Math.max(result.maxTermLen, term.length);
          result.listSubCommands.push({ term, desc });
          return result;
        },
        {
          maxTermLen: 0,
          listSubCommands: [],
        }
      );

    const { listSubCommandsHelp, maxLineLen } = listSubCommands.reduce(
      (result, { term, desc }) => {
        const line = `${term.padEnd(maxTermLen)}  ${desc}`;
        result.maxLineLen = Math.max(result.maxLineLen, line.length);
        result.listSubCommandsHelp += `${padStart}${line}\n`;
        return result;
      },
      {
        maxLineLen: 0,
        listSubCommandsHelp: "",
      }
    );

    return `${cmd.description()}
${padStart}${"-".repeat(maxLineLen)}
${padStart}${"Sub Commands Of List:"}
${listSubCommandsHelp}
${padStart}${"Examples:"}
${padStart}${chalk.gray("$")} ${"urm list add huawei https://repo.huaweicloud.com/repository/npm/"}
${padStart}${chalk.gray("$")} ${"urm list ping"}
${padStart}${"-".repeat(maxLineLen)}`;
  },
});

urmProgram.addHelpText(
  "after",
  `
${"Examples:"}
${chalk.gray("# show current registry config")}
${chalk.gray("$")} ${"urm"}
${chalk.gray("# follow the prompts to set registry")}
${chalk.gray("$")} ${"urm set"}
${chalk.gray('# use taobao registry in "@antd" scope and save the config file to current project')}
${chalk.gray("$")} ${"urm set taobao --scope @antd --where project"}
${chalk.gray("# follow the prompts to unset registry")}
${chalk.gray("$")} ${"urm unset"}

${chalk.blue(`learn more: ${chalk.underline("https://github.com/HaoChuan9421/urm")}`)}`
);

urmProgram.parseAsync(process.argv);
