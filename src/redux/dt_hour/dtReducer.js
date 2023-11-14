import { LOAD_DT_HOUR, CLEAR_DT_HOUR } from "./dtTypes"


const initialState = []

const dtReducer = (state=initialState, action)=>{
    //console.log("dtReducer: ", action.payload);
    switch(action.type){
        case LOAD_DT_HOUR: return [...state, {dt: action.payload.dt, hour: action.payload.hour}]
        case CLEAR_DT_HOUR: return initialState
        default: return state
    }
}

export default dtReducer;