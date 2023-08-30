module.exports = {
  presets: [
    ['@babel/preset-env', { loose: true }],
    ['module:metro-react-native-babel-preset', { loose: true }]
  ],
  plugins: [
    ["@babel/plugin-transform-flow-strip-types", { "loose": true }],
    ["@babel/plugin-transform-private-methods", { "loose": true }],
    ["@babel/plugin-syntax-jsx", { "loose": true }],
  ]
};