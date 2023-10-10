import { LOAD_SHIFT } from "./shiftTypes"

export const loadShift = (shift) => {
    return {
        type: LOAD_SHIFT,
        payload: shift
    }
}