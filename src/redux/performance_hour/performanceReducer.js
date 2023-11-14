import { LOAD_PERFORMANCE_HOUR, CLEAR_PERFORMANCE_HOUR } from "./performanceTypes"


const initialState = []

const performanceReducer = (state=initialState, action)=>{
    //console.log("performanceReducer: ", action.payload);
    switch(action.type){
        case LOAD_PERFORMANCE_HOUR: return [...state, {performance: action.payload.performance, hour: action.payload.hour}]
        case CLEAR_PERFORMANCE_HOUR: return initialState
        default: return state
    }
}

export default performanceReducer;