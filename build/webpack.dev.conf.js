const path = require ('path');
const webpack = require ('webpack');

const merge = require ('webpack-merge');
const webpackBase = require ('./webpack.base.conf.js');

module.exports = merge (webpackBase, {
  mode: 'development',
  devtool: 'inline-source-map',
  // 本地服务
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    inline: true,
    progress: true,
    hot: true,
    open: true,
    port: 8088,
  },
  module: {
    rules: [
      {
        test: /\.(le|c|)ss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },

          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     sourceMap: true,
          //     plugins: [
          //       require ('autoprefixer') ({
          //         overrideBrowserslist: [
          //           'Android 4.1',
          //           'iOS 7.1',
          //           'Chrome > 31',
          //           'ff > 31',
          //           'ie >= 8',
          //         ],
          //       }),
          //     ],
          //   },
          // },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin ()],
});
