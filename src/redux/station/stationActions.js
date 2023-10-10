import { LOAD_STATION } from "./stationTypes"

export const loadStation = (station) => {
    return {
        type: LOAD_STATION,
        payload: station
    }
}