import { LOAD_DATE } from "./dateTypes"


const months = [
    "Empty",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

const initialState = {
    day: new Date().getDate().toString(),
    month: months[new Date().getMonth() +1].toString(),
    year: '2024',
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