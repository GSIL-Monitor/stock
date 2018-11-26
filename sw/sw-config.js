require('dotenv').config({ path: 'sw/.env' })

const runtimeCacheConfig = require('./runtime-map.js')

module.exports = {
    cacheId: 'GoGoal',
    staticFileGlobs: ['cdn/stocks/**/*.{js,html,css,eot,ttf,woff}'],
    stripPrefix: 'cdn/stocks/',
    ignoreUrlParametersMatching: [/./],
    runtimeCaching: [...runtimeCacheConfig],
}
