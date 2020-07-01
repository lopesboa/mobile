module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['transform-inline-environment-variables', 'jest-hoist'],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
