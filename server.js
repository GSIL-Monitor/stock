// 用来验证 打包 文件
const liveServer = require('live-server')
const httpProxy = require('http-proxy-middleware')

// live server 文档: https://github.com/tapio/live-server
liveServer.start({
    port: 8081, // 本地打开的端口
    host: 'localhost', // 打开的网址
    root: 'cdn/stocks', // 代理的目录
    open: true, // 是否打开你的默认浏览器
    ignore: 'less,ico,images,fonts', //不监听的改动
    wait: 500, // 更改保存后多少秒自动刷新浏览器
    logLevel: 2,
    middleware: [
        // http 代理中间件
        httpProxy('/api', {
            // target: 'http://investtest.gofund.cn:8093',
            // target: 'http://investpre.gofund.cn:8093',
            target: 'http://zyzt.66966.cn',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api',
            },
        }),
    ],
})
