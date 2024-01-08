import { combineReducers } from "redux";
import stationReducer from "./station/stationReducer";
import shiftReducer from "./shift/shiftReducer";
import dateReducer from "./date/dateReducer"
import output_hourReducer from "./output_hour/output_hourReducer";
import load_downtimeReducer from "./load_downtime/load_downtimeReducer";
import dtReducer from "./dt_hour/dtReducer";
import performanceReducer from "./performance_hour/performanceReducer";
import productReducer from "./product/productReducer";

//Set up combine reducers
const rootReducer = combineReducers({
    station: stationReducer,
    shift: shiftReducer,
    date: dateReducer,
    output_hour:output_hourReducer,
    load_downtime:load_downtimeReducer,
    dt: dtReducer,
    performance: performanceReducer,
    product: productReducer,
})

export default rootReducer;