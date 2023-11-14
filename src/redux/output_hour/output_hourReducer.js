import { OUTPUT_HOURS } from "./output_hourTypes";

const initialState = {
  7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0, 17:0, 18:0
};
//shifts: {7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0, 17:0, 18:0, 19:0}
//shifts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
const output_hourReducer = (state = initialState, action) => {
  //console.log('Payload', action.payload);
  //console.log('Estado actual', state)
  if(state){
    switch (action.type) {
      case OUTPUT_HOURS:
        return {...state, ...action.payload};
        //{...state.shift, ...action.payload};
      default:
        return state;
    }
  }
  return state;
  
};

export default output_hourReducer;
