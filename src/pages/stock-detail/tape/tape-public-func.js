import {
    LOCAL_TAPE_SET_DFT,
    LOCAL_TAPE_SET_FUNC,
} from '../storage.js'

export const initTapeDefault = (callback) => {
    let store = localStorage.getItem(LOCAL_TAPE_SET_DFT)
    if (store) {
        for (let [key, val] of Object.entries(JSON.parse(store))) {
             callback(key, val)
        }
    }
}

export const initTapeFunc = (callback) => {
    let store = localStorage.getItem(LOCAL_TAPE_SET_FUNC)
    if (store) {
        JSON.parse(store).forEach((val) => {
            callback(val)
        })
    }
}
