import {
    LOCAL_IS_INFO_FULL,
} from '../storage'

export const getInfoState = () =>  {
    return localStorage.getItem(LOCAL_IS_INFO_FULL)
}

export const setInfoState = (state) =>  {
    localStorage.setItem(LOCAL_IS_INFO_FULL, state)
}
