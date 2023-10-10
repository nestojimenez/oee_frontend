import { LOAD_STATION } from "./stationTypes"

const initialState = {
    id: 1,
    st_name: 'Harro 1',
    st_line: 'Simplicity',
    st_unhappy_oee: '40',
    st_happy_oee: '60',
    created_at: '2024-06-18T22:34:09.000Z',
    updated_at: '2024-06-18T22:34:09.000Z'

}

const stationReducer = (state=initialState, action)=>{
    switch(action.type){
        case LOAD_STATION: return {
            id:action.payload.id,
            st_name: action.payload.st_name,
            st_line: action.payload.st_line,
            st_unhappy_oee: action.payload.st_unhappy_oee,
            st_happy_oee: action.payload.st_happy_oee,
            created_at: action.payload.created_at,
            updated_at: action.payload.updated_at
        }
        default: return state
    }
}

export default stationReducer;