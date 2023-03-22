import { baseUrl } from "../constants";
import axios from 'axios'
import {
    PRODUCT_CATEGORIES_LIST_REQUEST,
    PRODUCT_CATEGORIES_LIST_SUCCESS,
    PRODUCT_CATEGORIES_LIST_FAIL,

    PRODUCT_SUBCATEGORIES_LIST_REQUEST,
    PRODUCT_SUBCATEGORIES_LIST_SUCCESS,
    PRODUCT_SUBCATEGORIES_LIST_FAIL,

} from '../constants/categoriesConstants'

export const listProductCategories = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_CATEGORIES_LIST_REQUEST })

        const { data } = await axios.get(`${baseUrl}/api/product-categories/`)

        dispatch({
            type: PRODUCT_CATEGORIES_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: PRODUCT_CATEGORIES_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listProductSubcategories = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_SUBCATEGORIES_LIST_REQUEST })

        const { data } = await axios.get(`${baseUrl}/api/product-subcategories/`)

        dispatch({
            type: PRODUCT_SUBCATEGORIES_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: PRODUCT_SUBCATEGORIES_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
