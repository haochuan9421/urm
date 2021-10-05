const chalk = require("chalk");

module.exports = {
  A001: `指定 "urm" 的工作模式`,
  A002: `显示版本号`,
  A003: `List 相关的子命令:`,
  A004: `示例:`,
  A005: `显示当前的 registry 配置`,
  A006: `根据提示设置 registry 配置`,
  A007: `在安装 scope 为 "@vant" 的包时使用 taobao registry，并把配置文件保存到当前项目`,
  A008: `根据提示删除 registry`,

  A009: `清除包管理器的全部 registry 配置`,
  A010: `跳过提示，直接清空`,
  A011: chalk.yellow(`当前的 registry 配置不是来自于配置文件, "urm" 无法删除它.\n执行 ${chalk.green('"urm set"')} 来增加一条新的 registry 配置可能会覆盖掉它.`),
  A012: `你确定要清空全部 registry 配置吗`,
  A013: chalk.green(`\n清除成功\n`),
  A014: chalk.red(`清除失败`),

  A015: `查看包管理器当前的 registry 配置`,
  A016: `无法查询当前的 registry 配置`,

  A017: (defaultMode) => `设置 "urm" 的默认工作模式, 当前的模式是 ${chalk.green.bold(defaultMode)}`,
  A018: `选择 "urm" 的默认工作模式`,
  A019: chalk.green(`\n切换成功\n`),
  A020: chalk.red("切换默认工作模式失败"),

  A021: `指定你要使用的 registry 名`,
  A022: `指定 registry 要作用的 scope`,
  A023: `registry 配置保存到哪里`,
  A024: `设置包管理器的 registry 配置`,
  A025: chalk.yellow(`没有可选的 registry, 使用 ${chalk.green(`"urm list restore"`)} 可以恢复 registry 列表到默认状态`),
  A026: `请选择你要使用的 registry`,
  A027: `请输入此 registry 要作用的 scope (比如: @myscope), 留空则作为默认 registry:`,
  A028: `你想把此配置保存到哪里`,
  A029: chalk.green(`\n设置成功\n`),
  A030: chalk.red("设置失败"),

  A031: `删除包管理器的 registry 配置`,
  A032: `你想删除哪一条 registry 配置`,
  A033: chalk.green(`\n删除成功\n`),
  A034: chalk.red("删除失败"),

  A035: `查看可选的 registry 列表`,
  A036: `registry 名称`,
  A037: `registry 链接`,
  A038: `添加新的 registry 到可选列表`,
  A039: `输入 registry 的名称`,
  A040: `registry 名称必填`,
  A041: `输入 registry 的链接`,
  A042: `registry 链接必填`,
  A043: (name) => `${name} 已经存在了, 你确定继续添加吗?`,
  A044: `你输入的 registry 链接好像不是合法的 HTTP URL, 你确定继续添加吗?`,
  A045: chalk.green(`\n添加成功\n`),
  A046: chalk.red("添加失败"),

  A047: `从可选列表中删除 registry`,
  A048: `无可选的 registry`,
  A049: `你想删除哪一个 registry`,
  A050: chalk.green(`\n删除成功\n`),
  A051: chalk.red("删除失败"),

  A052: chalk.red("查询可选 registry 列表失败"),

  A053: `给指定的 registry 测速, 如果不指定则全部测速`,
  A054: `格式不正确的 registry`,
  A055: chalk.red("registry 测速失败"),

  A056: `恢复可选的 registry 列表到默认状态`,
  A057: chalk.green(`\n恢复成功\n`),
  A058: chalk.red("恢复失败"),

  A059: `可选的 Registry 列表`,
  A060: `Npm 当前的 Registry 配置`,
  A061: `Yarn 当前的 Registry 配置`,
  A062: `Yarn2 当前的 Registry 配置`,
};
