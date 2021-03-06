const os = require("os");
const path = require("path");

module.exports = {
  // 支持的包管理器
  urmModes: ["npm", "yarn", "yarn2"],
  // urm 运行时文件的存放位置
  urmRcFile: (() => {
    const urm_root = process.env.URM_ROOT || os.homedir();
    const urmrc = ".urmrc";
    return path.join(urm_root, urmrc);
  })(),
  // 预设的 registry 列表
  presetRegistries: {
    npm: {
      registry: "https://registry.npmjs.org/",
    },
    yarn: {
      registry: "https://registry.yarnpkg.com/",
    },
    cnpm: {
      registry: "https://r.cnpmjs.org/",
    },
    taobao: {
      registry: "https://registry.nlark.com/",
      defaultOnSelectToUse: true,
    },
    tencent: {
      registry: "https://mirrors.tencent.com/npm/",
    },
  },
};
