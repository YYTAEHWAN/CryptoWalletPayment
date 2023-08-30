// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'ethers') {
    return context.resolveRequest(context, 'ethers/lib.esm/index.js', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};


module.exports = config;