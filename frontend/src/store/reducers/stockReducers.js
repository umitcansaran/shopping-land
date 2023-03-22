import {
    STOCK_LIST_REQUEST,
    STOCK_LIST_SUCCESS,
    STOCK_LIST_FAIL,

    STOCK_UPDATE_REQUEST,
    STOCK_UPDATE_SUCCESS,
    STOCK_UPDATE_FAIL,
    STOCK_UPDATE_RESET,

    STOCK_CREATE_REQUEST,
    STOCK_CREATE_SUCCESS,
    STOCK_CREATE_FAIL,

    STOCK_SEARCH_SUCCESS,

} from '../constants/stockConstants'

export const stockListReducer = (state = { stocks: [] }, action) => {
    switch (action.type) {
        case STOCK_LIST_REQUEST:
            return { loading: true, stocks: [] }

        case STOCK_LIST_SUCCESS:
            return {
                loading: false,
                stocks: action.payload,
            }

        case STOCK_SEARCH_SUCCESS:
            return {
                loading: false,
                stocks: action.payload,
            }

        case STOCK_LIST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const stockUpdateReducer = (state = { stock: {} }, action) => {
    switch (action.type) {
        case STOCK_UPDATE_REQUEST:
            return { loading: true }

        case STOCK_UPDATE_SUCCESS:
            return { loading: false, success: true, stock: action.payload }

        case STOCK_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case STOCK_UPDATE_RESET:
            return { stock: {} }

        default:
            return state
    }
}

export const createStockReducer = (state = {}, action) => {
    switch (action.type) {
        case STOCK_CREATE_REQUEST:
            return { loading: true }

        case STOCK_CREATE_SUCCESS:
            return { loading: false, stock: action.payload }

        case STOCK_CREATE_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}
