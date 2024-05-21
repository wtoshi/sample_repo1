module.exports = {
    root: true,
    parser: '@babel/eslint-parser',
    extends: ['next', 'next/core-web-vitals'],
    plugins: ['@babel'],
    rules: {
      // Kendi kurallarınızı buraya ekleyebilirsiniz
    },
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        presets: ['next/babel'],
      },
    },
  };