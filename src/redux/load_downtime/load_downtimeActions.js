import { OPEN_LOAD_DT } from "./load_downtimeTypes"

export const load_downTime = (activate) => {
    return {
        type: OPEN_LOAD_DT,
        payload: activate
    }
}