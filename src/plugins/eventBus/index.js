const eventBus = {}

eventBus.install = (Vue) => {
    Vue.prototype.$_eventBus = new Vue()
}

export default eventBus
