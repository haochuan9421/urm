module.exports = {
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    // 运行环境 Node.js v12+，与 ES2019 几乎完全兼容 https://node.green/#ES2019
    ecmaVersion: 2019,
  },
  globals: {
    i18n: "writable",
  },
  extends: ["plugin:prettier/recommended"],
  rules: {
    "no-unused-vars": "error",
    "no-undef": "error",
    "no-else-return": "error",
    "prefer-template": "error",
    "no-useless-concat": "error",
  },
};
