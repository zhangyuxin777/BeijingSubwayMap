const path = require('path'); // 导入路径包
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/js/index.js", // 入口文件

  // 输出文件 build下的bundle.js
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: "index.js"
  },

  // 使用loader模块
// 使用loader模块
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ ,query: { presets: ['es2015']}}
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: 'src/js/index.js'
    })
  ],
};