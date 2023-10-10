import { LOAD_SHIFT } from "./shiftTypes"

const initialState = {
    id: 1,
    shift_name: 'Shift 1',
    shift_start_time: '7:00',
    shift_end_time: '19:00',
    created_at: '2024-06-18T22:34:09.000Z',
    updated_at: '2024-06-18T22:34:09.000Z',
    shift_date_selected: '20230915'

}


const shiftReducer = (state=initialState, action)=>{
    switch(action.type){
        case LOAD_SHIFT: return {
            id:action.payload.id,
            shift_name: action.payload.shift_name,
            shift_start_time: action.payload.shift_start_time,
            shift_end_time: action.payload.shift_end_time,
            created_at: action.payload.created_at,
            updated_at: action.payload.updated_at,
            shift_date_selected: action.payload.shift_date_selected
        }
        default: return state
    }
}

export default shiftReducer;