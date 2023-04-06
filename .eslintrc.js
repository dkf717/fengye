module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    // 禁用 console
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 禁用 debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 禁止出现未使用过的变量
    'no-unused-vars': 'off',
    // 是否检测分号，是否需要分号
    'semi': ['error', 'always'],
    // 强制使用一致的缩进
    'indent': ['error', 2],
    // 强制在function的左括号之前使用一致的空格
    'space-before-function-paren': ['error', 'always'],
    // 禁止多次声明同一变量
    'no-redeclare': 'off',
    // 禁止出现空语句块
    'no-empty': 'off',
    // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    'no-undef': 'off',
    // 强制使用一致的反勾号、双引号或单引号
    'quotes': ['error', 'single'],
    // 不允许在 case 子句中使用词法声明
    'no-case-declarations': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/no-unused-components': 'off',
    // Vue: Recommended rules to be closed or modify
    'vue/require-default-prop': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0,
    // Vue: Add extra rules
    'vue/custom-event-name-casing': [2, 'camelCase'],
    'vue/no-v-text': 1,
    'vue/padding-line-between-blocks': 1,
    'vue/require-direct-export': 1,
    'vue/multi-word-component-names': 0,
    // Allow @ts-ignore comment
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/no-explicit-any': 0,
    'no-param-reassign': 0,
    'prefer-regex-literals': 0,
    'import/no-extraneous-dependencies': 0,
  }
};
