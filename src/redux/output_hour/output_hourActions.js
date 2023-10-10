import { OUTPUT_HOURS } from "./output_hourTypes"

export const outputHour = (shift) => {
    return {
        type: OUTPUT_HOURS,
        payload: shift
    }
}