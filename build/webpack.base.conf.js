const path = require ('path');
const fs = require ('fs');
const VueLoader = require ('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require ('html-webpack-plugin');

const mode = process.env.NODE_ENV;
const devMode = mode === 'development'; ///是否开发环境

// 获取页面目录地址

const pagesPath = '../src/views';
const pagesDirPath = path.resolve (__dirname, pagesPath);
/**
 * 通过约定，降低编码复杂度
 * 每新增一个入口，即在src/pages目录下新增一个文件夹，以页面名称命名，内置一个index.js作为入口文件
 * 通过node的文件api扫描pages目录
 * 这样可以得到一个形如{page1: "入口文件地址", page2: "入口文件地址", ...}的对象
 */
const getEntries = () => {
  let result = fs.readdirSync (pagesDirPath);
  let entry = {};
  result.forEach (item => {
    entry[item] = path.resolve (__dirname, pagesPath + `/${item}/index.js`);
  });
  return entry;
};

/**
 * 扫描pages文件夹，为每个页面生成一个插件实例对象
 */
const generatorHtmlWebpackPlugins = () => {
  const arr = [];
  let result = fs.readdirSync (pagesDirPath);
  result.forEach (item => {
    //判断页面目录下有无自己的html
    let templatePath;
    let selfTemplatePath = pagesDirPath + `/${item}/${item}.html`;
    let publicTemplatePath = path.resolve (__dirname, '../public/index.html');
    try {
      fs.accessSync (selfTemplatePath);
      templatePath = selfTemplatePath;
    } catch (err) {
      templatePath = publicTemplatePath;
    }

    arr.push (
      new HtmlWebpackPlugin ({
        template: path.resolve (__dirname, '../public/index.html'),
        filename: `${item}.html`,
        title: `${item}`, //如果需要自己的名字的话可以在index导出一个title
        chunks: [item, 'common', 'vendor'],
        inject: 'body',
      })
    );
  });
  return arr;
};

console.log (path.resolve ('..', 'dist'));

module.exports = {
  // 入口文件
  // entry: {
  //   index: './src/views/index/index.js',
  //   login: './src/views/login/index.js',
  // },
  entry: getEntries (),
  //   输出文件
  output: {
    path: path.resolve (__dirname, '../dist'), // __dirname：是node.js中的一个全局变量，它指向当前执行脚本所在的目录
    publicPath: devMode ? '' : './',
    filename: devMode ? '[name].js' : 'static/js/[name].[chunkhash].js',
    // filename: 'static/js/[name]-[hash:8].js', //[chunkhash:5]: 数字和字母组成的8位哈希值,[name]：是根据入口文件的自动生成的，有几个入口文件，就可以打包几个出口文件。
    // publicPath: './',
  },
  //   配置模块
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          'cache-loader',
          'thread-loader',
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            // babel-loader的一些配置选项
            options: {
              presets: [
                '@babel/preset-env', // 将es6转换为 es5
              ],
              //  //下面这些是为了配置更高级语法 比如class类具体百度
              // plugins: [
              //   ['@babel/plugin-proposal-decorators', {legacy: 'true'}],
              //   ['@babel/plugin-proposal-class-properties', {loose: 'true'}][
              //     '@babel/transform-runtime'
              //   ],
              // ],
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },

      {
        // 图片有各种格式，会用到的都要列出来
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: {
          // use中，loader可以配置选项。方法：使用对象去声明
          loader: 'url-loader',
          //使用options去声明，将其中的对象传给loader
          options: {
            esModule: false,
            // 限制开始转译的大小，小的图片则不用转译，减少HTTP请求
            limit: 1024,
            // 自定义转译的文件名称
            // ext表示文件的扩展名
            name: '[name]-[hash].[ext]',
            outputPath: devMode ? '' : 'static/images/',
          },
        },
      },

      //   {
      //     test: /\.(woff|woff2|eot|ttf|otf)$/,
      //     use: ['file-loader'],
      //   },

      //   //   下面处理图片的一大推，后面再去搞懂什么意思
      //   {
      //     test: /\.(png|svg|jpg|gif)$/,
      //     use: [
      //       {
      //         loader: 'file-loader',
      //         options: {
      //           esModule: false,
      //         },
      //       },
      //     ],
      //   },
      //   {
      //     test: /\.(png|jpg|gif)$/,
      //     use: [
      //       {
      //         loader: 'image-webpack-loader',
      //         options: {
      //           mozjpeg: {
      //             progressive: true,
      //             quality: 65,
      //           },
      //           // optipng.enabled: false will disable optipng
      //           optipng: {
      //             enabled: false,
      //             esModule: false,
      //           },
      //           pngquant: {
      //             quality: [0.65, 0.9],
      //             speed: 4,
      //           },
      //           gifsicle: {
      //             interlaced: false,
      //           },
      //           // the webp option will enable WEBP
      //           webp: {
      //             quality: 75,
      //           },
      //         },
      //       },
      //     ],
      //   },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         limit: 10000,
      //       },
      //     },
      //   ],
      // },
    ],
  },
  plugins: [
    new VueLoader (),
    ...generatorHtmlWebpackPlugins (),
    // new HtmlWebpackPlugin ({
    //   //作用是打包生成对应的html文件
    //   template: 'index.html', //要处理的html模板文件(打包后，生成新的html文件)
    //   filename: 'index.html', // 打包生成的文件地址及文件名，filename配置的html文件目录是相对于webpackConfig.output.path路径而言的，不是相对于当前项目目录结构的。
    //   title: 'index', // 设置该页面的title标题标签
    //   chunks: ['index', 'common', 'vendor'],
    //   inject: 'body', // 所有js资源插入到head标签中
    // }),
    // new HtmlWebpackPlugin ({
    //   //作用是打包生成对应的html文件
    //   template: 'index.html', //要处理的html模板文件(打包后，生成新的html文件)
    //   filename: 'login.html', // 打包生成的文件地址及文件名，filename配置的html文件目录是相对于webpackConfig.output.path路径而言的，不是相对于当前项目目录结构的。
    //   title: 'login', // 设置该页面的title标题标签
    //   chunks: ['login', 'common', 'vendor'],
    //   inject: 'body', // 所有js资源插入到head标签中
    // }),
  ],
  resolve: {
    // 像vue一样配置别名
    alias: {
      '@': resolve ('../src'),
    },
    extensions: ['.js', '.vue'],
  },
};

// resolve is not defined  加上下面这段代码就可以了
function resolve (dir) {
  return path.join (__dirname, dir);
}
