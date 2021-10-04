const osLocale = require("os-locale");

const locale = osLocale
  .sync()
  .replace(/(_|-).*/, "")
  .toLowerCase(); // 用户的语言环境

switch (locale) {
  case "zh":
    global.i18n = require("./zh.js"); // 中文
    break;
  case "en":
    global.i18n = require("./en.js"); // English
    break;
  default:
    global.i18n = require("./en.js"); // 默认 English
    break;
}
