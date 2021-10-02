const fs = require("fs");
const path = require("path");
const { getUrmConfig, setUrmConfig } = require("./lib/utils");
const { presetRegistries } = require("./lib/const");

// npm scripts 中的 postinstall 既会在我们安装项目依赖时执行，也会在用户安装 urm 时执行，但我们预期的行为是：
// 1. 本地开发时，为了做 eslint，安装项目依赖后需要执行 “husky install” 以激活 git hooks，但用户安装 urm 时不需要这个功能。
// 2. 用户安装完成 urm 后，需要创建（或更新）.urmrc 配置文件，但本地开发时，不需要这个功能
const toogle = process.argv[2];
if (toogle) {
  // 读取 package.json 的内容
  const pkgFile = path.join(path.dirname(process.argv[1]), "package.json");
  const pkgBuffer = fs.readFileSync(pkgFile);
  const pkgContent = pkgBuffer.toString("utf8");
  const pkg = JSON.parse(pkgContent);
  // 获取 package.json 的缩进大小
  const match = /^[ ]+|\t+/m.exec(pkgContent);
  const indent = match ? match[0] : null;
  if (toogle === "--enable") {
    pkg.scripts._postinstall = pkg.scripts._postinstall || pkg.scripts.postinstall;
    pkg.scripts.postinstall = "node postinstall.js";
  } else if (toogle === "--disable") {
    pkg.scripts.postinstall = pkg.scripts._postinstall || pkg.scripts.postinstall;
    delete pkg.scripts._postinstall;
  }
  // 获取 package.json 的 EOL
  const POSIX_EOL = "\n";
  const WINDOWS_EOL = "\r\n";
  const lf = POSIX_EOL.charCodeAt(0);
  const cr = WINDOWS_EOL.charCodeAt(0);
  let eol;
  for (let i = 0; i < pkgBuffer.length; ++i) {
    if (pkgBuffer[i] === lf) {
      eol = POSIX_EOL;
      break;
    }
    if (pkgBuffer[i] === cr) {
      eol = WINDOWS_EOL;
      break;
    }
  }
  // 更新 package.json 文件
  const newPkgContent = JSON.stringify(pkg, null, indent).replace(/\n/g, eol);
  fs.writeFileSync(pkgFile, newPkgContent);
} else {
  const urmConfig = getUrmConfig();
  urmConfig.presetRegistries = presetRegistries;
  setUrmConfig(urmConfig);
}
