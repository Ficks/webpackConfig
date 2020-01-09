const path = require ('path');
const MiniCssExtractPlugin = require ('mini-css-extract-plugin'); //提取css到单独文件的插件
const {CleanWebpackPlugin} = require ('clean-webpack-plugin'); //清除dist文件的插件
const merge = require ('webpack-merge'); //合并webpack
const webpackBase = require ('./webpack.base.conf.js'); //公共配置
const CopyWebpackPlugin = require ('copy-webpack-plugin'); //复制静态文件到dist
const OptimizeCSSAssetsPlugin = require ('optimize-css-assets-webpack-plugin'); //压缩css

module.exports = merge (webpackBase, {
  mode: 'production',

  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                require ('autoprefixer') ({
                  overrideBrowserslist: [
                    'Android 4.1',
                    'iOS 7.1',
                    'Chrome > 31',
                    'ff > 31',
                    'ie >= 8',
                  ],
                }),
              ],
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      // {
      //   test: /\.(gif|jpg|jpeg|png|svg)$/, //图片各类格式
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         limit: 1024, //图片大小
      //         name: '[name].[ext]', //图片名称规则
      //         outputPath: 'static/images/',
      //       },
      //     },
      //   ],
      // },
    ],
  },
  plugins: [
    new CleanWebpackPlugin (), // 打包前，先将dist文件中的内容全部清除
    new MiniCssExtractPlugin ({
      filename: 'static/css/[name][hash].css', ////都提到build目录下的css目录中
      chunkFilename: '[id][hash].css',
    }),

    new OptimizeCSSAssetsPlugin ({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require ('cssnano'),
      // cssProcessorOptions: cssnanoOptions,
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
            normalizeUnicode: false,
          },
        ],
      },
      canPrint: true,
    }),

    // ！！！！复制assets到static，目前会导致webpack打包一份，然后这个插件在复制过去一份
    // new CopyWebpackPlugin ([
    //   {
    //     from: path.resolve (__dirname, '../src/assets'),
    //     to: path.resolve (__dirname, '../dist/static'),
    //   },
    // ]),
  ],
  //   打包公共提取部分
  optimization: {
    splitChunks: {
      minChunks: 2, //被使用多少次才打包
      cacheGroups: {
        // 注意: priority属性
        // 其次: 打包业务中公共代码
        common: {
          name: 'common',
          chunks: 'all',
          minSize: 3,
          priority: 0,
        },
        // 首先: 打包node_modules中的文件
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
});
