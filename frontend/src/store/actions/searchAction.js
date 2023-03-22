import { baseUrl } from "../constants";
import axios from 'axios'
import {
    STORE_SEARCH_REQUEST,
    STORE_SEARCH_SUCCESS,
    STORE_SEARCH_FAIL,

    PRODUCT_SEARCH_REQUEST,
    PRODUCT_SEARCH_SUCCESS,
    PRODUCT_SEARCH_FAIL,

    PROFILE_SEARCH_REQUEST,
    PROFILE_SEARCH_SUCCESS,
    PROFILE_SEARCH_FAIL,

    MY_PRODUCTS_SEARCH_REQUEST,
    MY_PRODUCTS_SEARCH_SUCCESS,
    MY_PRODUCTS_SEARCH_FAIL,

    STOCK_SEARCH_REQUEST,
    STOCK_SEARCH_SUCCESS,
    STOCK_SEARCH_FAIL,

} from '../constants/searchConstants'

export const search = (searchData) => async (dispatch, getState) => {

    if(searchData.type === 'stores') {
        try {
            dispatch({
                type: STORE_SEARCH_REQUEST
            })
    
            const { data } = await axios.get(`${ baseUrl }/api/search/?type=${searchData.type}&search_string=${searchData.searchString}`)
    
            dispatch({
                type: STORE_SEARCH_SUCCESS,
                payload: data
            })
    
        } catch (error) {
            dispatch({
                type: STORE_SEARCH_FAIL,
                payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
            })
        }
    }

    if(searchData.type === 'map') {
        try {
            dispatch({
                type: STORE_SEARCH_REQUEST
            })
    
            const { data } = await axios.get(`${ baseUrl }/api/search/?type=${searchData.type}&search_string=${searchData.searchString}`)
    
            dispatch({
                type: STORE_SEARCH_SUCCESS,
                payload: data
            })
    
        } catch (error) {
            dispatch({
                type: STORE_SEARCH_FAIL,
                payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
            })
        }
    }

    if(searchData.type === 'products') {
        try {
            dispatch({
                type: PRODUCT_SEARCH_REQUEST
            })
    
            const { data } = await axios.get(`${ baseUrl }/api/search/?type=${searchData.type}&search_string=${searchData.searchString}`)
    
            dispatch({
                type: PRODUCT_SEARCH_SUCCESS,
                payload: data
            })
    
        } catch (error) {
            dispatch({
                type: PRODUCT_SEARCH_FAIL,
                payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
            })
        }
    }

    if(searchData.type === 'profiles') {
        try {
            dispatch({
                type: PROFILE_SEARCH_REQUEST
            })
    
            const { data } = await axios.get(`${ baseUrl }/api/search/?type=${searchData.type}&search_string=${searchData.searchString}`)
            console.log(data)
    
            dispatch({
                type: PROFILE_SEARCH_SUCCESS,
                payload: data
            })
    
        } catch (error) {
            dispatch({
                type: PROFILE_SEARCH_FAIL,
                payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
            })
        }
    }

    if(searchData.type === 'all') {
        try {
            dispatch({
                type: PRODUCT_SEARCH_REQUEST
            })
    
            const { data } = await axios.get(`${ baseUrl }/api/search/?type=${searchData.type}&search_string=${searchData.searchString}`)

            dispatch({
                type: PRODUCT_SEARCH_SUCCESS,
                payload: data
            })
    
        } catch (error) {
            dispatch({
                type: PRODUCT_SEARCH_FAIL,
                payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
            })
        }
    }

    if(searchData.type === 'product_in_store') {
        try {
            dispatch({
                type: PRODUCT_SEARCH_REQUEST
            })
    
            const { data } = await axios.get(`${ baseUrl }/api/search/?type=${searchData.type}&store_name=${searchData.store}&search_string=${searchData.searchString}`)
            const result = data.filter((data) => data.number > 0).map(result => result.product)
            console.log('result', result)
           
            dispatch({
                type: PRODUCT_SEARCH_SUCCESS,
                payload: result
            })
    
        } catch (error) {
            dispatch({
                type: PRODUCT_SEARCH_FAIL,
                payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
            })
        }
    }

    if(searchData.type === 'my_products') {
        try {
            dispatch({
                type: MY_PRODUCTS_SEARCH_REQUEST
            })

            const {
                userLogin: { userInfo },
            } = getState()
    
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${userInfo.access}`
                }
            }
    
            const { data } = await axios.get(`${ baseUrl }/api/search/?type=${searchData.type}&store_name=${searchData.store}&search_string=${searchData.searchString}`,
            config
            )
           
            dispatch({
                type: MY_PRODUCTS_SEARCH_SUCCESS,
                payload: data
            })
    
        } catch (error) {
            dispatch({
                type: MY_PRODUCTS_SEARCH_FAIL,
                payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
            })
        }
    }

    if(searchData.type === 'product_in_my_store') {
        try {
            dispatch({
                type: STOCK_SEARCH_REQUEST
            })
    
            const { data } = await axios.get(`${ baseUrl }/api/search/?type=${searchData.type}&store_name=${searchData.store}&search_string=${searchData.searchString}`)
            // const result = data.filter((data) => data.number > 0).map(result => result.product)
            const result = data.filter((data) => data.number > 0)
                       
            dispatch({
                type: STOCK_SEARCH_SUCCESS,
                payload: result
            })
    
        } catch (error) {
            dispatch({
                type: STOCK_SEARCH_FAIL,
                payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
            })
        }
    }
    
}

