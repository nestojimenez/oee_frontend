import { LOAD_PERFORMANCE_HOUR, CLEAR_PERFORMANCE_HOUR } from "./performanceTypes"

export const loadPerformance = (performance, hour) => {
    return {
        type: LOAD_PERFORMANCE_HOUR,
        payload: {performance, hour}
    }
}

export const clearPerformance = () => {
    return {
        type: CLEAR_PERFORMANCE_HOUR
    }
}