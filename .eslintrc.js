module.exports = {
  extends: 'expo',
  plugins: ['react', 'react-native'],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    'react-native/no-raw-text': 'error',
  },
};
