import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '../pages/stock-detail/index.vue'

// let rightSrc = '../pages/stock-detail/right/'
import stock_a from '../pages/stock-detail/right/stock_a.vue'
import stock_b from '../pages/stock-detail/right/stock_b.vue'
// import simple_financial from '../pages/stock-detail/right/simple_financial.vue'
// import stock_transaction from '../pages/stock-detail/right/transaction.vue'

Vue.use(VueRouter)

// const stock_a = r => require.ensure(
//     [],
//     () => r(require(`${rightSrc}stock_a`)),
//     'stock_a',
// )
// const stock_b = r => require.ensure(
//     [],
//     () => r(require(`${rightSrc}stock_b`)),
//     'stock_b',
// )

// const simple_financial = r => require.ensure(
//     [],
//     () => r(require(`${rightSrc}simple_financial`)),
//     'simple_financial',
// )

const routes = [{
    path: '/',
    component: App, // 顶层路由
    name: 'App',
    children: [ // 二级路由
        {
            path: '/stock_a/',
            name: 'stock_a',
            component: stock_a,
            // children: [
            //     {
            //         path: 'stock_transaction',
            //         name: 'stock_transaction',
            //         component: stock_transaction,
            //     },
            //     {
            //         path: 'simple_financial',
            //         name: 'simple_financial',
            //         component: simple_financial,
            //     },
            // ],
        },
        {
            path: '/stock_b',
            name: 'stock_b',
            component: stock_b,
        }
    ]
}]

export default new VueRouter({
    routes,
    mode: 'hash',
    // strict: process.env.NODE_ENV !== 'production',
})
