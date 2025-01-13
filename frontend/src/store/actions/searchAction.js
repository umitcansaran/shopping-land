import { baseUrl } from "../constants";
import axios from "axios";
import {
  STORE_SEARCH_REQUEST,
  STORE_SEARCH_SUCCESS,
  STORE_SEARCH_FAIL,
  MY_PRODUCTS_SEARCH_REQUEST,
  MY_PRODUCTS_SEARCH_SUCCESS,
  MY_PRODUCTS_SEARCH_FAIL,
  STORE_STOCKS_SEARCH_REQUEST,
  STORE_STOCKS_SEARCH_SUCCESS,
  STORE_STOCKS_SEARCH_FAIL,
  PRODUCTS_BY_USER_REQUEST,
  PRODUCTS_BY_USER_SUCCESS,
  PRODUCTS_BY_USER_FAIL,
} from "../constants/searchConstants";
import {
  SELLER_PROFILES_REQUEST,
  SELLER_PROFILES_SUCCESS,
  SELLER_PROFILES_FAIL,
} from "../constants/userConstants";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
} from "../constants/productConstants";
import {
  STORE_LIST_FAIL,
  STORE_LIST_REQUEST,
  STORE_LIST_SUCCESS,
  STORE_MY_LIST_REQUEST,
  STORE_MY_LIST_SUCCESS,
  STORE_MY_LIST_FAIL,
} from "../constants/storeConstants";

export const search = (searchData) => async (dispatch, getState) => {
  if (searchData.type === "stores") {
    try {
      dispatch({
        type: STORE_SEARCH_REQUEST,
      });

      const { data } = await axios.get(
        `${baseUrl}/api/search/?type=${searchData.type}&search_string=${searchData.searchString}`
      );

      dispatch({
        type: STORE_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: STORE_SEARCH_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }

  if (searchData.type === "map") {
    try {
      dispatch({
        type: STORE_LIST_REQUEST,
      });

      const { data } = await axios.get(
        `${baseUrl}/api/search/?type=${searchData.type}&search_string=${searchData.searchString}`
      );

      dispatch({
        type: STORE_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: STORE_LIST_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }

  if (searchData.type === "products") {
    try {
      dispatch({
        type: PRODUCT_LIST_REQUEST,
      });

      const { data } = await axios.get(
        `${baseUrl}/api/search/?type=${searchData.type}&search_string=${searchData.searchString}`
      );

      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }

  if (searchData.type === "profiles") {
    try {
      dispatch({
        type: SELLER_PROFILES_REQUEST,
      });

      const { data } = await axios.get(
        `${baseUrl}/api/search/?type=${searchData.type}&search_string=${searchData.searchString}`
      );

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
  }

  if (searchData.type === "all") {
    try {
      dispatch({
        type: PRODUCT_LIST_REQUEST,
      });

      const { data } = await axios.get(
        `${baseUrl}/api/search/?type=${searchData.type}&search_string=${searchData.searchString}`
      );

      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }

  if (searchData.type === "products_in_store") {
    try {
      dispatch({
        type: PRODUCTS_BY_USER_REQUEST,
      });

      const { data } = await axios.get(
        `${baseUrl}/api/search/?type=${searchData.type}&store_id=${searchData.store}&search_string=${searchData.searchString}`
      );
      const result = data
        .filter((data) => data.number > 0)
        .map((result) => result.product);

      dispatch({
        type: PRODUCTS_BY_USER_SUCCESS,
        payload: result,
      });
    } catch (error) {
      dispatch({
        type: PRODUCTS_BY_USER_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }

  if (searchData.type === "my_products") {
    try {
      dispatch({
        type: MY_PRODUCTS_SEARCH_REQUEST,
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

      const { data } = await axios.get(
        `${baseUrl}/api/search/?type=${searchData.type}&store_name=${searchData.store}&search_string=${searchData.searchString}`,
        config
      );

      dispatch({
        type: MY_PRODUCTS_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: MY_PRODUCTS_SEARCH_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }

  if (searchData.type === "my_stores") {
    try {
      dispatch({
        type: STORE_MY_LIST_REQUEST,
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

      const { data } = await axios.get(
        `${baseUrl}/api/search/?type=${searchData.type}&search_string=${searchData.searchString}`,
        config
      );

      dispatch({
        type: STORE_MY_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: STORE_MY_LIST_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }

  if (searchData.type === "products_in_my_store") {
    try {
      dispatch({
        type: STORE_STOCKS_SEARCH_REQUEST,
      });

      const { data } = await axios.get(
        `${baseUrl}/api/search/?type=${searchData.type}&store_id=${searchData.store}&search_string=${searchData.searchString}`
      );

      dispatch({
        type: STORE_STOCKS_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: STORE_STOCKS_SEARCH_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }

  if (searchData.type === "products_by_seller") {
    try {
      dispatch({
        type: PRODUCTS_BY_USER_REQUEST,
      });

      const { data } = await axios.get(
        `${baseUrl}/api/search/?type=${searchData.type}&seller_id=${searchData.seller_id}&search_string=${searchData.searchString}`
      );

      dispatch({
        type: PRODUCTS_BY_USER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCTS_BY_USER_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }
};
