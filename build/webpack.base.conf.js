var path = require('path')
var utils = require('./utils')
var config = require('./config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        login: './public/src/login-main.js',
        stockDetail: './public/src/stock-detail.js',
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            // 'vue$': 'vue/dist/vue.common.javascripts',
            vue$: 'vue/dist/vue.esm.js',
            '@': resolve('public/src'),
            src: resolve('public/src'),
            '@a': resolve('public/src/assets'),
            '@c': resolve('public/src/components'),
            '@store': resolve('public/src/store'),
            '@service': resolve('public/src/service'),
            '@plugins': resolve('public/src/plugins'),
            '@formatter':  resolve('public/src/formatter'),
            vars$: resolve('public/src/less/variables.less'),
            'lodash-es': 'lodash', // reduce lodash size
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('public/src'), resolve('test'), resolve('node_modules/vue-echarts')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    name: utils.assetsPath('img/', '[name]', '[hash:7]', '[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/', '[name]', '[hash:7]', '[ext]')
                }
            }
        ]
    }
}