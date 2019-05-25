module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
      "plugin:vue/recommended",
      // https://github.com/standard/standard/blob/master/docs/RULES-en.md
      "standard"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "parser": "babel-eslint",
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue",
    ],
    "rules": {
      // allow async-await
      "generator-star-spacing": "off",
      // allow debugger during development
      "no-debugger": process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-console': 'off',
      'no-unused-vars' :'off',
      'no-alert': 'off'
    }
};
