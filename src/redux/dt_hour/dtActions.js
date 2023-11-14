import { LOAD_DT_HOUR, CLEAR_DT_HOUR } from "./dtTypes"

export const loadDT = (dt, hour) => {
    return {
        type: LOAD_DT_HOUR,
        payload: {dt, hour}
    }
}

export const clearDT = () => {
    return {
        type: CLEAR_DT_HOUR
    }
}