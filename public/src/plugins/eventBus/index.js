const eventBus = {}

eventBus.install = (Vue) => {
    Vue.prototype.$eventBus = new Vue()
}

export default eventBus
