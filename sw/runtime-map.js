const APIConfig = require('./api-map.js')

/**
 * config item params
 * @param {string} domain 域名
 * @param {string} [cacheID] sw cache ID
 * @param {[]string} nameList 需要缓存的字段名
 * @param {'networkFirst' | 'cacheFirst' | 'fastest' | 'cacheOnly' | 'networkOnly'} handler 缓存的方案
 * @param {Number} [maxEntries] 最多缓存的个数
 * @param {Number} [maxAgeSeconds] 缓存的时间
 */

function generateRuntimeCache(config) {
    return config.map(
        ({
            domain,
            cacheID,
            nameList,
            handler,
            maxEntries,
            maxAgeSeconds,
        }) => ({
            urlPattern: new RegExp(
                `${escape(domain)}.*(${nameList
                    .map(str => escape(str))
                    .join('|')})`
            ),
            handler,
            options: {
                cache: {
                    name: cacheID,
                    maxEntries,
                    maxAgeSeconds,
                },
            },
        })
    )
}

function escape(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

const runtimeCacheConfig = generateRuntimeCache([
    {
        domain: process.env.DOMAIN_CDN,
        cacheID: 'img-cache',
        handler: 'cacheFirst',
        nameList: ['.png', '.gif', '.jpg', '.jpeg', '.svg'],
        maxEntries: 100,
    },
    ...APIConfig,
])

module.exports = runtimeCacheConfig
