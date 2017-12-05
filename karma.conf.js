// Karma configuration
// Generated on Wed Nov 15 2017 13:10:51 GMT+0800 (中国标准时间)
const ExtractTextPlugin = require('extract-text-webpack-plugin') // 有问题，需要参考http://blog.csdn.net/zhangchao19890805/article/details/53150882
const webpack = require('webpack')

const path = require('path')
const postcss_autoprefixer = require('autoprefixer')
const postcss_cssnext = require('postcss-cssnext')
const postcss_viewport_units = require('postcss-viewport-units')
const postcss_vmin = require('postcss-vmin')
const options = require('./build/options')
const dir_node_modules = options.paths.resolve('node_modules')

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: ['./test/unit/index.js'],


    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './test/unit/index.js': ['webpack', 'sourcemap']
    },

    // webpack 打包信息是否显示
    webpackMiddleware: {
      noInfo: true
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage-istanbul'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // webpack配置
    webpack: {
      devtool: '#inline-source-map',
      resolve: {
        modules: [
          options.paths.root,
          options.paths.resolve('node_modules')
        ],
        alias: {
          'dove.max.sdk$': options.paths.resolveEx(dir_node_modules, '/dove.max.sdk/dist/dovemax-sdk.js'),
          'keen-ui$': options.paths.resolveEx(dir_node_modules, '/Keen-UI/dist/keen-ui.js'),
          'keen-ui-css$': options.paths.resolveEx(dir_node_modules, '/Keen-UI/dist/keen-ui.css')
        },
        extensions: ['.js', '.json', '.vue', '.scss']
      },
      output: {
        path: path.join(__dirname, '..', 'lib'),
        filename: '[name].js',
        libraryTarget: 'umd'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
              presets: ['es2015'],
              plugins: ['transform-runtime']
            }
          },
          // 为了统计代码覆盖率，对 js 文件加入 istanbul-instrumenter-loader
          {
            test: /\.js$/,
            loader: 'istanbul-instrumenter-loader',
            exclude: /node_modules/,
            include: /src/,
            enforce: 'post',
            options: {
              debug: true,
              preserveComments: true,
              esModules: true
            }
          },
          {
            test: /\.js$/,
            loader: 'eslint-loader',
            exclude: /node_modules/,
            include: /src/,
            enforce: 'pre',
            options: {
              eslint: {
                configFile: '../.eslintrc.json'
              }
            }
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
              loaders: {
                scss: ExtractTextPlugin.extract({
                  use: 'css-loader!sass-loader',
                  fallback: 'vue-style-loader'
                }),
                css: ExtractTextPlugin.extract({
                  use: 'css-loader!sass-loader',
                  fallback: 'vue-style-loader'
                })
              },
              postcss: [
                postcss_cssnext,
                postcss_viewport_units,
                postcss_vmin,
                postcss_autoprefixer({
                  browsers: [
                    'last 5 version',
                    'last 5 Chrome versions',
                    'ios >= 4',
                    'ie > 9',
                    'Firefox ESR',
                    'Firefox >= 3',
                    'Safari >= 2'
                  ]
                })
              ]
            }
          },
          {
            test: /\.vue$/,
            loader: 'istanbul-instrumenter-loader',
            exclude: /node_modules|Down|Search|Find/,
            enforce: 'post',
            options: {
              debug: true,
              preserveComments: true,
              esModules: true
            }
          },
          {
            test: /\.(scss|sass)$/,
            loaders: ['style-loader', 'css-loader', 'sass-loader']
          },
          {
            test: /\.html$/,
            loaders: ['html-loader']
          },
          {
            test: /\.(png|jpg|gif)$/,
            loaders: 'url-loader?limit=8192'
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
              use: 'css-loader',
              fallback: 'style-loader'
            })
          }
        ]
      },
      resolveLoader: {
        // 下面是配置如何解析Loader的，就是说使用scss-loader实际用sass-loader
        alias: {
          // necessary to to make lang="scss" work in test when using vue-loader's ?inject option
          // see discussion at https://github.com/vuejs/vue-loader/issues/724
          'scss-loader': 'sass-loader'
        }
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"testing"'
          }
        }),
        // minify with dead-code elimination
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        }),
        new ExtractTextPlugin('style.css')
      ]
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-webpack',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
      'karma-coverage-istanbul-reporter',
      'jquery'
    ],

    // 使用 istanbul 方式
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: './coverage',
      fixWebpackSourcePaths: true,
      'report-config': {
        html: {
          subdir: 'html'
        }
      }
    }
  })
}
