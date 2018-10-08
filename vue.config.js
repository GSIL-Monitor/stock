/**
 * docs
 * vue-cli@3: https://cli.vuejs.org/
 * webpack: https://webpack.js.org/
 * webpack-chain: https://github.com/mozilla-neutrino/webpack-chain
 */
const { resolve } = require('path')

module.exports = {
    outputDir: 'cdn',

    productionSourceMap: false,

    runtimeCompiler: true,

    pages: {
        index: {
            title: '首页',
            entry: 'src/login-main.js',
        },
        stockDetail: {
            title: '个股',
            entry: 'src/stock-detail.js',
        },
    },

    devServer: {
        proxy: {
            '/api': {
                // target: 'http://investtest.gofund.cn:8093',
                // target: 'http://investpre.gofund.cn:8093',
                target: 'http://zyzt.66966.cn',
                // ws: true, // proxy websockets
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api',
                },
            },
        },
    },

    configureWebpack: {
        devtool: 'cheap-module-eval-source-map',
        optimization: {
            // just split js
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        name: 'chunk-vendors',
                        test: /[\\\/]node_modules[\\\/].*js/,
                        minChunks: 2,
                        priority: -10,
                        chunks: 'initial',
                    },
                    common: {
                        name: 'chunk-common',
                        test: /\.js$/,
                        minChunks: 2,
                        priority: -20,
                        chunks: 'initial',
                        reuseExistingChunk: true,
                    },
                    css: {
                        name: 'chunk-common',
                        test: /\.less$/,
                        minChunks: 10,
                        priority: -20,
                        chunks: 'initial',
                        reuseExistingChunk: true,
                    },
                },
            },
        },
    },

    chainWebpack: config => {
        // 临时解决方案, 等项目更新 https://github.com/vuejs/vue-cli/issues/1996
        config.plugins.delete('named-chunks')

        config.resolve.alias
            .set('@c', resolve('src/components')) // conponents alias
            .set('@less', resolve('src/less')) // less alias
            .set('@assets', resolve('src/assets')) // assets alias
            .set('@service', resolve('src/dataService')) // assets alias
            .set('@pages', resolve('src/pages')) // assets alias
            .set('@formatter', resolve('src/formatter')) // assets alias
            .set('@store', resolve('src/store')) // assets alias
            .set('lodash-es', 'lodash') // reduce lodash size
        // 图片压缩
        config.module
            .rule('imgCompression')
            .test(/\.(jpe?g|png|gif|svg)$/)
            .pre()
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
        // 修改图片是否 inline 大小阈值
        config.module
            .rule('images')
            .use('url-loader')
            .tap(options => {
                // Inline files smaller than 10 kB (10240 bytes)
                options.limit = 10 * 1024
                return options
            })
        // 清除默认的 file-loader 设置, 并使用 svg-url-loader 来处理 svg
        config.module
            .rule('svg')
            .uses.clear()
            .end()
            .use('svg-url-loader')
            .loader('svg-url-loader')
            // Inline files smaller than 10 kB (10240 bytes)
            .tap(() => ({
                limit: 10 * 1024,
                noquotes: true,
                name: 'img/[name].[hash:8].[ext]',
            }))
    },
}
