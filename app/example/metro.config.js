const path = require('path');
const escape = require('escape-string-regexp');
const { getDefaultConfig } = require('@expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');

const modules = Object.keys({
  ...pak.peerDependencies,
});

const defaultConfig = getDefaultConfig(__dirname);

// Merge function to combine extraNodeModules
function mergeExtraNodeModules(config1, config2) {
  return {
    ...config1,
    resolver: {
      ...config1.resolver,
      extraNodeModules: {
        ...config1.resolver.extraNodeModules,
        ...config2.resolver.extraNodeModules,
      },
    },
  };
}

const config1 = {
  ...defaultConfig,
  projectRoot: __dirname,
  watchFolders: [root],
  resolver: {
    ...defaultConfig.resolver,
    blacklistRE: exclusionList(
      modules.map(
        (m) =>
          new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
      )
    ),
    extraNodeModules: 
      modules.reduce((acc, name) => {
        acc[name] = path.join(__dirname, 'node_modules', name);
        return acc;
      }, {}),
  },
};

const config2 = {
  resolver: {
    extraNodeModules: {
      url: require.resolve('url/'),
      fs: require.resolve('expo-file-system'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      net: require.resolve('react-native-tcp'),
      os: require.resolve('os-browserify/browser.js'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('readable-stream'),
      vm: require.resolve('vm-browserify'),
    },
  },
};

module.exports = mergeExtraNodeModules(config1, config2);