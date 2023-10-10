import { LOAD_DATE } from "./dateTypes"

export const loadDate = (date) => {
    return {
        type: LOAD_DATE,
        payload: date
    }
}