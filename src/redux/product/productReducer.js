import { LOAD_PRODUCT} from "./productTypes"

const initialState = {
    id: 1,
    pr_name: 'J&J',
    pr_line: 'elevenSet',
    pr_station: 'Torque',
    pr_baan: 'B987654',
    created_at: '2024-06-18T22:34:09.000Z',
    updated_at: '2024-06-18T22:34:09.000Z',
    cycle_time: 1,

}

const productReducer = (state=initialState, action)=>{
    switch(action.type){
        case LOAD_PRODUCT: return {
            id:action.payload.id,
            pr_name: action.payload.pr_name,
            pr_line: action.payload.pr_line,
            pr_station: action.payload.pr_station,
            pr_baan: action.payload.pr_baan,
            created_at: action.payload.created_at,
            updated_at: action.payload.updated_at,
            cycle_time: action.payload.cycle_time,
        }
        default: return state
    }
}

export default productReducer;