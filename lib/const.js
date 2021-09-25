const path = require("path");

module.exports = {
  // 支持的包管理器
  urmModes: ["npm", "yarn", "yarn2"],
  // urm 运行时文件的存放位置，原则上 urm 在哪里，这个文件就放哪里
  // 一来避免用户卸载后残留垃圾，二来可以保证全局安装和项目内独立安装时 urm 的配置独立
  urmRcFile: (() => {
    const urm_root = process.env.URM_ROOT || path.join(__dirname, "..");
    const urmrc = ".urmrc";
    return path.join(urm_root, urmrc);
  })(),
  registryKey: "registry",
  scopeRegistryKeyReg: /(?<=@[\s\S]+:)registry/,
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
