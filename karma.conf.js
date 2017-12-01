// Karma configuration
// Generated on Wed Nov 15 2017 13:10:51 GMT+0800 (中国标准时间)
const ExtractTextPlugin = require('extract-text-webpack-plugin') // 有问题，需要参考http://blog.csdn.net/zhangchao19890805/article/details/53150882
const webpack = require('webpack')

const path = require('path')
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
    files: [
      { pattern: 'test/unit/**/*.spec.js', watch: false }
    ],


    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/unit/**/*.spec.js': ['webpack', 'sourcemap']
    },

    // webpack 打包信息是否显示
    webpackMiddleware: {
      noInfo: true
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage-istanbul'],


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
      module: {
        rules: [{
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: ['transform-runtime']
          },
          exclude: /node_modules/
        }, {
          test: /\.js$/,
          loader: 'istanbul-instrumenter-loader',
          query: {
            debug: true,
            preserveComments: true,
            esModules: true
          },
          enforce: 'post',
          exclude: /node_modules/
        }, {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            presets: ['es2015'],
            plugins: ['transform-runtime']
          }
        }, {
          test: /\.vue$/,
          loader: 'istanbul-instrumenter-loader',
          query: {
            debug: true,
            preserveComments: true,
            esModules: true
          },
          enforce: 'post',
          exclude: /node_modules|Down|Search|Find/
        }, {
          test: /\.html$/,
          loaders: ['html-loader']
        }, {
          test: /\.(png|jpg|gif)$/,
          loaders: 'url-loader?limit=8192'
        }, {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            use: 'css-loader',
            fallback: 'style-loader'
          })
        }]
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
        // 下面设置环境变量process.env是"testing"
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
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
      'karma-sourcemap-loader',
      'karma-coverage-istanbul-reporter',
      'jquery'
    ],

    // 使用 istanbul 方式
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: path.join(__dirname, 'coverage'),
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
      'report-config': {
        html: {
          subdir: 'html'
        }
      }
    }
  })
}
