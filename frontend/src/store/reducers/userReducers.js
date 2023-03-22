import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_LOGOUT,

    PROFILE_CREATE_REQUEST,
    PROFILE_CREATE_SUCCESS,
    PROFILE_CREATE_FAIL,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    PROFILE_LIST_REQUEST,
    PROFILE_LIST_SUCCESS,
    PROFILE_LIST_FAIL,
    PROFILE_LIST_RESET,

    PROFILE_SEARCH_SUCCESS,

    PROFILE_UPDATE_SUCCESS,
    PROFILE_UPDATE_FAIL,

    MY_DETAILS_REQUEST,
    MY_DETAILS_SUCCESS,
    MY_DETAILS_FAIL,
    MY_DETAILS_RESET,

    PROFILE_DETAILS_REQUEST,
    PROFILE_DETAILS_SUCCESS,
    PROFILE_DETAILS_FAIL,
    PROFILE_DETAILS_RESET,

    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_RESET,

    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_RESET,

    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,

    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_RESET,

} from '../constants/userConstants'


export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true }

        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload }

        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload }

        case USER_LOGOUT:
            return {}

        default:
            return state
    }
}

export const profileReducer = (state = {}, action) => {
    switch (action.type) {
        case PROFILE_CREATE_REQUEST:
            return { loading: true }

        case PROFILE_CREATE_SUCCESS:
            return { loading: false, profile: action.payload }

        case PROFILE_UPDATE_SUCCESS:
            return { loading: false, profile: action.payload }

        case PROFILE_CREATE_FAIL:
            return { loading: false, error: action.payload }

        case PROFILE_UPDATE_FAIL:
            return { loading: false, error: action.payload }     

        default:
            return state
    }
}

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true }

        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload }

        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const myDetailsReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case MY_DETAILS_REQUEST:
            return { ...state, loading: true }

        case MY_DETAILS_SUCCESS:
            return { loading: false, user: action.payload }

        case MY_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        case MY_DETAILS_RESET:
            return { user: null }

        default:
            return state
    }
}

export const userDetailsReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_DETAILS_REQUEST:
            return { ...state, loading: true }

        case USER_DETAILS_SUCCESS:
            return { loading: false, user: action.payload }

        case USER_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        case USER_DETAILS_RESET:
            return { user: {} }


        default:
            return state
    }
}

export const profileListReducer = (state = { profiles: [] }, action) => {
    switch (action.type) {
        case PROFILE_LIST_REQUEST:
            return { loading: true }

        case PROFILE_LIST_SUCCESS:
            return { loading: false, profiles: action.payload }

        case PROFILE_SEARCH_SUCCESS:
            return { loading: false, profiles: action.payload }

        case PROFILE_LIST_FAIL:
            return { loading: false, error: action.payload }

        case PROFILE_LIST_RESET:
            return { profiles: [] }

        default:
            return state
    }
}

export const profileDetailsReducer = (state = { profile: {} }, action) => {
    switch (action.type) {
        case PROFILE_DETAILS_REQUEST:
            return { ...state, loading: true }

        case PROFILE_DETAILS_SUCCESS:
            return { loading: false, profile: action.payload }

        case PROFILE_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        case PROFILE_DETAILS_RESET:
            return { profile: {} }

        default:
            return state
    }
}


export const userListReducer = (state = { users: [] }, action) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return { loading: true }

        case USER_LIST_SUCCESS:
            return { loading: false, users: action.payload }

        case USER_LIST_FAIL:
            return { loading: false, error: action.payload }

        case USER_LIST_RESET:
            return { users: [] }

        default:
            return state
    }
}


export const userDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return { loading: true }

        case USER_DELETE_SUCCESS:
            return { loading: false, success: true }

        case USER_DELETE_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}


export const userUpdateReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return { loading: true }

        case USER_UPDATE_SUCCESS:
            return { loading: false, success: true }

        case USER_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case USER_UPDATE_RESET:
            return { user: {} }

        default:
            return state
    }
}