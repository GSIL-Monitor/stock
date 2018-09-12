// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        login: path.resolve(__dirname, '../../cdn/login.html'),
        stockDetail: path.resolve(__dirname, '../../cdn/stockDetail.html'),
        assetsRoot: path.resolve(__dirname, '../../cdn'),
        assetsSubDirectory: '', // --- static
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
    },
    dev: {
        env: require('./dev.env'),
        port: 8080,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api': {
                // target: 'http://investtest.gofund.cn:8093',
                // target: 'http://investpre.gofund.cn:8093',
                target: 'http://zyzt.66966.cn',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api',
                },
            },
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
    },
    variablesStyleFileName: {
        b: path.resolve(__dirname, '../../public/src/less/common/variables-d.less'),
        w: path.resolve(__dirname, '../../public/src/less/common/variables-w.less'),
        d: path.resolve(__dirname, '../../public/src/less/common/variables-d.less'),
        v: path.resolve(__dirname, '../../public/src/less/common/variables.less'),
    },
}
