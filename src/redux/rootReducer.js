import { combineReducers } from "redux";
import stationReducer from "./station/stationReducer";
import shiftReducer from "./shift/shiftReducer";
import dateReducer from "./date/dateReducer"
import output_hourReducer from "./output_hour/output_hourReducer";
import load_downtimeReducer from "./load_downtime/load_downtimeReducer";

//Set up combine reducers
const rootReducer = combineReducers({
    station: stationReducer,
    shift: shiftReducer,
    date: dateReducer,
    output_hour:output_hourReducer,
    load_downtime:load_downtimeReducer
})

export default rootReducer;