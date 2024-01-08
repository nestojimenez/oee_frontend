import { LOAD_PRODUCT } from "./productTypes"

export const loadProduct= (product) => {
    return {
        type: LOAD_PRODUCT,
        payload: product
    }
}