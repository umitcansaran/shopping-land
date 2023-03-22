import { baseUrl } from "../constants";
import axios from 'axios'
import {
    STOCK_LIST_REQUEST,
    STOCK_LIST_SUCCESS,
    STOCK_LIST_FAIL,

    STOCK_UPDATE_REQUEST,
    STOCK_UPDATE_SUCCESS,
    STOCK_UPDATE_FAIL,

    STOCK_CREATE_REQUEST,
    STOCK_CREATE_SUCCESS,
    STOCK_CREATE_FAIL,

} from '../constants/stockConstants'

export const listStocks = () => async (dispatch) => {
    try {
        dispatch({ type: STOCK_LIST_REQUEST })

        const { data } = await axios.get(`${baseUrl}/api/stocks/`)

        dispatch({
            type: STOCK_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: STOCK_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateStock = (number, id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: STOCK_UPDATE_REQUEST
        })

        const { data } = await axios.put(
            `${baseUrl}/api/stock/${id}/`,
            number
        )
        dispatch({
            type: STOCK_UPDATE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: STOCK_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createStock = (number, store, product) => async (dispatch, getState) => {

    try {
        dispatch({
            type: STOCK_CREATE_REQUEST
        })

        const { data } = await axios.post(
            `${baseUrl}/api/stock/new/`,
            { number, store, product }
        )

        dispatch({
            type: STOCK_CREATE_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: STOCK_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}