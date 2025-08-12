const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = require.resolve('metro-minify-terser');
config.transformer.minifierConfig = {
  compress: {
    drop_console: true,
    drop_debugger: true,
  },
};

module.exports = config;