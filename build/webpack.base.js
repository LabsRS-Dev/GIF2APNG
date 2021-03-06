const options = require('./options')

const dir_nACommonJS = 'D:/workspace/nACommonJS'
const dir_sdk = dir_nACommonJS + '/sdk'
const dir_vue =  dir_nACommonJS + '/common/vue.js'
const dir_node_modules = options.paths.resolve('node_modules')



module.exports = {
    resolve: {
        modules: [
            options.paths.root,
            options.paths.resolve('node_modules')
        ],

        alias: {
            // src: 'src',
            // directives: 'src/directives',
            // helpers: 'src/helpers',
            // mixins: 'src/mixins',
            // styles: 'src/styles',

            //'dove.max.sdk$': options.paths.resolveEx(dir_sdk, '/dist/dovemax-sdk.js'),
            //'keen-ui$': options.paths.resolveEx(dir_vue, '/plugins/Keen-UI/git_source/Keen-UI/dist/keen-ui.js'),
            //'keen-ui-css$': options.paths.resolveEx(dir_vue, '/plugins/Keen-UI/git_source/Keen-UI/dist/keen-ui.css'),

            'dove.max.sdk$': options.paths.resolveEx(dir_node_modules, '/dove.max.sdk/dist/dovemax-sdk.js'),
            'keen-ui$': options.paths.resolveEx(dir_node_modules, '/Keen-UI/dist/keen-ui.js'),
            'keen-ui-css$': options.paths.resolveEx(dir_node_modules, '/Keen-UI/dist/keen-ui.css'),

            //'vue-i18n$': options.paths.resolveEx(dir_vue, '/plugins/vue-i18n/git_source/vue-i18n/dist/vue-i18n.js'),
            //'vue$': options.paths.resolveEx(dir_vue, '/git_source/dist/vue.js'),
            //'vuex$': options.paths.resolveEx(dir_vue, '/plugins/vuex/git_source/vuex/dist/vuex.js'),
            //'vue-router$': options.paths.resolveEx(dir_vue, '/plugins/vue-router.js/git_source/vue-router/dist/vue-router.js')
        },

        extensions: ['.js', '.json', '.vue', '.scss']
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {}
                }
            },
            {
                test: /\.j(s|sx)$/,
                include: [
                    options.paths.src.main,
                    /swiper|dom7/
                ],
                loader: 'babel-loader'
            },
            {
                test: /\.html$/,
                loaders: ['html-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                loaders: 'url-loader?limit=8192'
            }

        ]
    },

    // Stats is used to customize Webpack's console output
    // https://webpack.js.org/configuration/stats/
    stats: {
        hash: false,
        colors: true,
        chunks: false,
        version: false,
        children: false,
        timings: true
    }
};
