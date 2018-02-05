const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 有问题，需要参考http://blog.csdn.net/zhangchao19890805/article/details/53150882
const merge = require('deep-assign');
const options = require('./options')
const webpack = require('webpack')

const base = require('./webpack.base.js');




const config =  merge(base, {
    context: options.paths.root,
    entry: [
        options.paths.resolve('src/index.js')
    ],
    output: {
        filename: 'bundle.js',
        path: options.paths.output.publish
    },
        
    devServer: {
        // This is required for older versions of webpack-dev-server
        // if you use absolute 'to' paths. The path should be an
        // absolute path to your build destination.
        outputPath: options.paths.resolve('dist_public')
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'bundle.css'
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),

        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin(),

        new CopyWebpackPlugin([
            {
                context: 'dist',
                from: '**/*',
                force: true
            },
            {
               context: 'build/data',
               from: '*.json',
               force: true
            }
        ], {
            ignore: [
                // Doesn't copy any files with a spec extension
                'bundle.js',
                '*.js.map',
                '*.css.map'
            ],

            // By default, we only copy modified files during
            // a watch or webpack-dev-server build. Setting this
            // to `true` copies all files.
            copyUnmodified: true
        }),
    ]
});

// Fix /// <reference path="" />
// config.resolve.modules.push(options.paths.resolve('node_modules'))
config.module.rules[0].options.loaders = {
    scss: ExtractTextPlugin.extract({
        use: 'css-loader!sass-loader',
        fallback: 'vue-style-loader'
    }),
    css: ExtractTextPlugin.extract({
        use: 'css-loader!sass-loader!postcss-loader',
        fallback: 'vue-style-loader'
    })
}

config.module.rules.push({
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
        use: 'css-loader!sass-loader!postcss-loader',
        fallback: 'style-loader'
    })
});


module.exports = config;
