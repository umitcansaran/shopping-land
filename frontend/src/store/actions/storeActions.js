import { baseUrl } from "../constants";
import axios from 'axios'
import {
    STORE_LIST_REQUEST,
    STORE_LIST_SUCCESS,
    STORE_LIST_FAIL,

    STORE_MY_LIST_REQUEST,
    STORE_MY_LIST_SUCCESS,
    STORE_MY_LIST_FAIL,

    STORE_CREATE_REQUEST,
    STORE_CREATE_SUCCESS,
    STORE_CREATE_FAIL,

    STORE_DELETE_REQUEST,
    STORE_DELETE_SUCCESS,
    STORE_DELETE_FAIL,

    STORE_DETAILS_REQUEST,
    STORE_DETAILS_SUCCESS,
    STORE_DETAILS_FAIL,

    STORES_BY_USER_REQUEST,
    STORES_BY_USER_SUCCESS,
    STORES_BY_USER_FAIL,

} from '../constants/storeConstants'

export const listStores = () => async (dispatch) => {
    try {
        dispatch({ type: STORE_LIST_REQUEST })

        const { data } = await axios.get(`${baseUrl}/api/stores/`)

        dispatch({
            type: STORE_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: STORE_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listMyStores = () => async (dispatch, getState) => {
    try {
        dispatch({ type: STORE_MY_LIST_REQUEST })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.access}`
            }
        }

        const { data } = await axios.get(
            `${baseUrl}/api/mystores/`,
            config
        )

        dispatch({
            type: STORE_MY_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: STORE_MY_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createStore = (form_data) => async (dispatch, getState) => {

    try {
        dispatch({
            type: STORE_CREATE_REQUEST
        })

        // const config = {
        //     headers: {
        //         'Content-type': 'application/json',
        //         Authorization: `Bearer ${userInfo.token}`
        //     }
        // }

        const { data } = await axios.post(
            `${baseUrl}/api/store/new/`,
            form_data
        )

        dispatch({
            type: STORE_CREATE_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: STORE_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const deleteStore = (id) => async (dispatch, getState) => {
    console.log('in da delete ', id)
    try {
        dispatch({
            type: STORE_DELETE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.delete(
            `${baseUrl}/api/store/${id}/`
        )

        dispatch({
            type: STORE_DELETE_SUCCESS,
        })


    } catch (error) {
        dispatch({
            type: STORE_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listStoreDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: STORE_DETAILS_REQUEST })

        const { data } = await axios.get(`${baseUrl}/api/store/${id}`)

        dispatch({
            type: STORE_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: STORE_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listStoresByUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: STORES_BY_USER_REQUEST })

        const { data } = await axios.get(`${baseUrl}/api/stores/user/${id}`)

        dispatch({
            type: STORES_BY_USER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: STORES_BY_USER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}