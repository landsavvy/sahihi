module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    _: false,
    db: true,
    socket: true
  },
  extends: [

    "plugin:vue/essential" // /base, /essential, /strongly-recommended, /recommended

  ],
  rules: {
    "vue/max-attributes-per-line": [
      2,
      {
        singleline: 100,
        multiline: {
          max: 50,
          allowFirstLine: true
        }
      }
    ],
    "vue/no-unused-vars": 0,
    "vue/attributes-order": 0,
    "vue/valid-v-for": 0,
    "vue/no-unused-components": 0,
    "vue/require-v-for-key": 0,


    "no-console": "off",
    "no-debugger": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
}
