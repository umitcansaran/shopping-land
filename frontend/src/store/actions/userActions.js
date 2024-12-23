import { baseUrl } from "../constants";
import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  PROFILE_CREATE_REQUEST,
  PROFILE_CREATE_SUCCESS,
  PROFILE_CREATE_FAIL,
  PROFILE_LIST_REQUEST,
  PROFILE_LIST_SUCCESS,
  PROFILE_LIST_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  PROFILE_DETAILS_REQUEST,
  PROFILE_DETAILS_SUCCESS,
  PROFILE_DETAILS_FAIL,
  SELLER_PROFILES_REQUEST,
  SELLER_PROFILES_SUCCESS,
  SELLER_PROFILES_FAIL,
  MY_DETAILS_REQUEST,
  MY_DETAILS_SUCCESS,
  MY_DETAILS_FAIL,
  MY_DETAILS_RESET,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  PROFILE_BY_USER_REQUEST,
  PROFILE_BY_USER_SUCCESS,
  PROFILE_BY_USER_FAIL,
  LATEST_SELLERS_LIST_REQUEST,
  LATEST_SELLERS_LIST_SUCCESS,
  LATEST_SELLERS_LIST_FAIL,
} from "../constants/userConstants";

import {
  ORDER_LIST_MY_RESET,
  ORDER_DETAILS_RESET,
} from "../constants/orderConstants";

export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const { data } = await axios.post(`${baseUrl}/api/users/login/`, {
      username: username,
      password: password,
    });

    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
    dispatch(myDetails());
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("user");
  localStorage.removeItem("shippingAddress");
  localStorage.removeItem("paymentMethod");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: MY_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  dispatch({ type: USER_LIST_RESET });
  dispatch({ type: ORDER_DETAILS_RESET });
};

export const createProfile =
  (id, username, password, profile) => async (dispatch) => {
    try {
      dispatch({
        type: PROFILE_CREATE_REQUEST,
      });

      const { data } = await axios.post(`${baseUrl}/api/profiles/new/`, {
        user: id,
        status: profile,
      });
      

      dispatch({
        type: PROFILE_CREATE_SUCCESS,
        payload: data,
      });

      dispatch(login(username, password));
    } catch (error) {
      dispatch({
        type: PROFILE_CREATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const updateProfile = (profile, formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.patch(
      `${baseUrl}/api/profiles/${profile.id}/`,
      formData,
      config
    );

    dispatch({
      type: PROFILE_UPDATE_SUCCESS,
      payload: data,
    });

    dispatch(myDetails());
  } catch (error) {
    dispatch({
      type: PROFILE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const deleteAccount = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
      },
    };

    await axios.delete(`${baseUrl}/api/users/${id}/`, config);

    dispatch({
      type: USER_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const register =
  (username, email, password, profile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_REGISTER_REQUEST,
      });
      
      const { data } = await axios.post(`${baseUrl}/api/users/registration/`, {
        username: username,
        email: email,
        password: password,
      });
      
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      });
      
      localStorage.setItem("userInfo", JSON.stringify(data));
  
      dispatch(createProfile(data.id, username, password, profile));
    } catch (error) {
      console.log(error.response.data)
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const myDetails = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: MY_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.access}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/users/me/`, config);

    dispatch({
      type: MY_DETAILS_SUCCESS,
      payload: data,
    });

    localStorage.setItem("user", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: MY_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listProfiles = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PROFILE_LIST_REQUEST,
    });

    const { data } = await axios.get(`${baseUrl}/api/profiles/`);

    dispatch({
      type: PROFILE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listSellerProfiles = () => async (dispatch) => {
  try {
    dispatch({
      type: SELLER_PROFILES_REQUEST,
    });

    const { data } = await axios.get(`${baseUrl}/api/profiles/sellers/`);

    dispatch({
      type: SELLER_PROFILES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SELLER_PROFILES_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.access}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/users/`, config);

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.access}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/api/users/${id}/`, config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getProfileDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PROFILE_DETAILS_REQUEST,
    });

    const { data } = await axios.get(`${baseUrl}/api/profiles/${id}/`);

    dispatch({
      type: PROFILE_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listProfileByUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: PROFILE_BY_USER_REQUEST });

    const { data } = await axios.get(`${baseUrl}/api/profiles/user/${id}`);

    dispatch({
      type: PROFILE_BY_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_BY_USER_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listLatestSellers = () => async (dispatch) => {
  try {
    dispatch({ type: LATEST_SELLERS_LIST_REQUEST });

    const { data } = await axios.get(`${baseUrl}/api/latest-sellers/`);

    dispatch({
      type: LATEST_SELLERS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LATEST_SELLERS_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
