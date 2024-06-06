import { OUTPUT_HOURS } from "./output_hourTypes"

export const outputHour = (shift) => {
    return {
        type: OUTPUT_HOURS,
        payload: shift
    }
}

export const changeNightShift = (shift) => {
    console.log('Night Shift Selected', shift)
    return {
        type: 'CHANGE_TO_NIGHT_SHIFT',
        payload: shift
    }
}

export const changeDayShift = (shift) => {
    console.log('Day Shift Selected')
    return {
        type: 'CHANGE_TO_DAY_SHIFT',
        payload: shift
    }
}   