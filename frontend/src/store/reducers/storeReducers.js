import {
  STORE_LIST_REQUEST,
  STORE_LIST_SUCCESS,
  STORE_LIST_FAIL,
  STORE_LIST_RESET,
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
  STORE_STOCKS_REQUEST,
  STORE_STOCKS_SUCCESS,
  STORE_STOCKS_FAIL,
  STORE_STOCKS_RESET,
  STORES_BY_USER_REQUEST,
  STORES_BY_USER_SUCCESS,
  STORES_BY_USER_FAIL,
  STORE_DELETE_REQUEST,
  STORE_DELETE_SUCCESS,
  STORE_DELETE_FAIL,
  STORE_DELETE_RESET,
} from "../constants/storeConstants";

import {
  MY_STORES_LIST_SUCCESS,
  STORE_STOCKS_SEARCH_SUCCESS,
} from "../constants/searchConstants";

export const createStoreReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_CREATE_REQUEST:
      return { loading: true };

    case STORE_CREATE_SUCCESS:
      return { loading: false, success: true, store: action.payload };

    case STORE_CREATE_FAIL:
      return { loading: false, error: action.payload };

    case STORE_CREATE_RESET:
      return {};

    default:
      return state;
  }
};

export const storeListReducer = (state = { stores: [] }, action) => {
  switch (action.type) {
    case STORE_LIST_REQUEST:
      return { loading: true, stores: [] };

    case STORE_LIST_SUCCESS:
      return {
        loading: false,
        stores: action.payload,
      };

    case STORE_SEARCH_SUCCESS:
      return {
        loading: false,
        stores: action.payload,
      };

    case STORE_LIST_FAIL:
      return { loading: false, error: action.payload };

    case STORE_LIST_RESET:
      return { stores: [] };

    default:
      return state;
  }
};

export const storeMyListReducer = (state = { myStores: [] }, action) => {
  switch (action.type) {
    case STORE_MY_LIST_REQUEST:
      return { loading: true, myStores: [] };

    case STORE_MY_LIST_SUCCESS:
      return {
        loading: false,
        myStores: action.payload,
      };

    case MY_STORES_LIST_SUCCESS:
      return {
        loading: false,
        myStores: action.payload,
      };

    case STORE_MY_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const storeDetailsReducer = (state = { store: {} }, action) => {
  switch (action.type) {
    case STORE_DETAILS_REQUEST:
      return { loading: true, ...state };

    case STORE_DETAILS_SUCCESS:
      return { loading: false, store: action.payload };

    case STORE_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const storeStocksReducer = (state = { stocks: [] }, action) => {
  switch (action.type) {
    case STORE_STOCKS_REQUEST:
      return { loading: true, ...state };

    case STORE_STOCKS_SUCCESS:
      return { loading: false, stocks: action.payload };

    case STORE_STOCKS_FAIL:
      return { loading: false, error: action.payload };

    case STORE_STOCKS_SEARCH_SUCCESS:
      return {
        loading: false,
        stocks: action.payload,
      };

    case STORE_STOCKS_RESET:
      return {};

    default:
      return state;
  }
};

export const storesByUserReducer = (state = { stores: [] }, action) => {
  switch (action.type) {
    case STORES_BY_USER_REQUEST:
      return { loading: true };

    case STORES_BY_USER_SUCCESS:
      return { loading: false, stores: action.payload };

    case STORES_BY_USER_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const storeDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_DELETE_REQUEST:
      return { loading: true };
    case STORE_DELETE_SUCCESS:
      return { loading: false, success: true };
    case STORE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case STORE_DELETE_RESET:
      return {};

    default:
      return state;
  }
};
