import { LOAD_DATE } from "./dateTypes"

const initialState = {
    day: 1,
    month: 'January',
    year: '2023',
}

const dateReducer = (state=initialState, action)=>{
    switch(action.type){
        case LOAD_DATE: return {
            day:action.payload.day,
            month: action.payload.month,
            year: action.payload.year,
        }
        default: return state
    }
}

export default dateReducer;