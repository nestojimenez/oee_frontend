import { LOAD_SHIFT } from "./shiftTypes"

const initialState = {
    
    shift_selected: 'First Shift'

}


const shiftReducer = (state=initialState, action)=>{
    
    switch(action.type){
        case LOAD_SHIFT: 
        console.log('Shift Selected', action.payload.shift)
        return {
            
            shift_selected: action.payload.shift
        }
        default: return state
    }
}

export default shiftReducer;