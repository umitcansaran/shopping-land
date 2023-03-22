import {
    STORE_LIST_REQUEST,
    STORE_LIST_SUCCESS,
    STORE_LIST_FAIL,

    STORE_SEARCH_SUCCESS,

    STORE_MY_LIST_REQUEST,
    STORE_MY_LIST_SUCCESS,
    STORE_MY_LIST_FAIL,

    STORE_CREATE_REQUEST,
    STORE_CREATE_SUCCESS,
    STORE_CREATE_FAIL,
    STORE_CREATE_RESET,

    STORE_DETAILS_REQUEST,
    STORE_DETAILS_SUCCESS,
    STORE_DETAILS_FAIL,

    STORES_BY_USER_REQUEST,
    STORES_BY_USER_SUCCESS,
    STORES_BY_USER_FAIL,

} from '../constants/storeConstants'

import {
    MY_STORES_LIST_SUCCESS
} from '../constants/searchConstants'


export const createStoreReducer = (state = {}, action) => {
    switch (action.type) {
        case STORE_CREATE_REQUEST:
            return { loading: true }

        case STORE_CREATE_SUCCESS:
            return { loading: false, success: true, store: action.payload }

        case STORE_CREATE_FAIL:
            return { loading: false, error: action.payload }

        case STORE_CREATE_RESET:
            return {}

        default:
            return state
    }
}

export const storeListReducer = (state = { stores: [] }, action) => {
    switch (action.type) {
        case STORE_LIST_REQUEST:
            return { loading: true, stores: [] }

        case STORE_LIST_SUCCESS:
            return {
                loading: false,
                stores: action.payload,
            }

        case STORE_SEARCH_SUCCESS:
            return {
                loading: false,
                stores: action.payload,
            }

        case STORE_LIST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const storeMyListReducer = (state = { myStores: [] }, action) => {
    switch (action.type) {
        case STORE_MY_LIST_REQUEST:
            return { loading: true, myStores: [] }

        case STORE_MY_LIST_SUCCESS:
            return {
                loading: false,
                myStores: action.payload,
            }

            case MY_STORES_LIST_SUCCESS:
                return {
                    loading: false,
                    myStores: action.payload,
                }

            case STORE_MY_LIST_FAIL:
                return { loading: false, error: action.payload }

            default:
                return state
    }
}

export const storeDetailsReducer = (state = { store: {} }, action) => {
    switch (action.type) {
        case STORE_DETAILS_REQUEST:
            return { loading: true, ...state }

        case STORE_DETAILS_SUCCESS:
            return { loading: false, store: action.payload }

        case STORE_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const storesByUserReducer = (state = {}, action) => {
    switch (action.type) {
        case STORES_BY_USER_REQUEST:
            return { loading: true }

        case STORES_BY_USER_SUCCESS:
            return { loading: false, stores: action.payload }

        case STORES_BY_USER_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}
