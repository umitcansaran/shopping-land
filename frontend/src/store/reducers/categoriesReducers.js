import {
    PRODUCT_CATEGORIES_LIST_REQUEST,
    PRODUCT_CATEGORIES_LIST_SUCCESS,
    PRODUCT_CATEGORIES_LIST_FAIL,

    PRODUCT_SUBCATEGORIES_LIST_REQUEST,
    PRODUCT_SUBCATEGORIES_LIST_SUCCESS,
    PRODUCT_SUBCATEGORIES_LIST_FAIL,

} from '../constants/categoriesConstants'


export const productCategoriesReducer = (state = { categories: [] }, action) => {
    switch (action.type) {
        case PRODUCT_CATEGORIES_LIST_REQUEST:
            return { loading: true, categories: [] }

        case PRODUCT_CATEGORIES_LIST_SUCCESS:
            return {
                loading: false,
                categories: action.payload,
            }

        case PRODUCT_CATEGORIES_LIST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const productSubcategoriesReducer = (state = { subcategories: [] }, action) => {
    switch (action.type) {
        case PRODUCT_SUBCATEGORIES_LIST_REQUEST:
            return { loading: true, subcategories: [] }

        case PRODUCT_SUBCATEGORIES_LIST_SUCCESS:
            return {
                loading: false,
                subcategories: action.payload,
            }

        case PRODUCT_SUBCATEGORIES_LIST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}
