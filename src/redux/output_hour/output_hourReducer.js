import { OUTPUT_HOURS } from "./output_hourTypes";

const initialState = {
  7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0, 17:0, 18:0
};
//shifts: {7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0, 17:0, 18:0, 19:0}
//shifts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
const output_hourReducer = (state = initialState, action) => {
  console.log('Payload', action.payload);
  //console.log('Estado actual', state)
  if(state){
    switch (action.type) {
      case OUTPUT_HOURS:
        console.log('Payload', action.payload);
        return {...state, ...action.payload};
        //{...state.shift, ...action.payload};
      case 'CHANGE_TO_NIGHT_SHIFT':
        console.log('Payload', action.payload);
        return {
          19:0, 20:0, 21:0, 22:0, 23:0, 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0
        };
        case 'CHANGE_TO_DAY_SHIFT':
        return {
          7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0, 17:0, 18:0
        };
      default:
        return state;
    }
  }
  return state;
  
};

export default output_hourReducer;
