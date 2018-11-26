const APIConfig = {
    OneMinuteNetwork: {
        handler: 'networkFirst',
        maxAgeSeconds: 60,
        maxEntries: 100,
        nameList: ['api/v1'],
    },
}

const APIRuntimeCacheConfig = []

for (let key in APIConfig) {
    const { handler, maxAgeSeconds, maxEntries, nameList } = APIConfig[key]
    APIRuntimeCacheConfig.push({
        domain: process.env.DOMAIN,
        cacheID: 'api-cache',
        handler,
        maxAgeSeconds,
        maxEntries,
        nameList,
    })
}

module.exports = APIRuntimeCacheConfig
