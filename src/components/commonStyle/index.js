import commonStyle from './src/cs'

commonStyle.install=function (Vue) {
    Vue.component(commonStyle.name, commonStyle)
}

export default commonStyle