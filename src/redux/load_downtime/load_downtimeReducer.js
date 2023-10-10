import { OPEN_LOAD_DT } from "./load_downtimeTypes"

const initialState = {
    activate: false,
    x:0,
    y:0,
    dtFrame_id:0
}

const load_downtimeReducer = (state=initialState, action)=>{
    switch(action.type){
        case OPEN_LOAD_DT: return {
            activate:action.payload.activate,
            x:action.payload.x,
            y:action.payload.y,
            dtFrame_id:action.payload.dtFrame_id
        }
        default: return state
    }
}

export default load_downtimeReducer;