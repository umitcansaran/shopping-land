import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  REVIEW_LIST_REQUEST,
  REVIEW_LIST_SUCCESS,
  REVIEW_LIST_FAIL,
  PRODUCT_LIST_RESET,
  PRODUCT_MY_LIST_REQUEST,
  PRODUCT_MY_LIST_SUCCESS,
  PRODUCT_MY_LIST_FAIL,
  LATEST_PRODUCTS_LIST_REQUEST,
  LATEST_PRODUCTS_LIST_SUCCESS,
  LATEST_PRODUCTS_LIST_FAIL,
  LATEST_REVIEWS_LIST_REQUEST,
  LATEST_REVIEWS_LIST_SUCCESS,
  LATEST_REVIEWS_LIST_FAIL,
  MY_PRODUCTS_SEARCH_SUCCESS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_RESET,
  PRODUCT_REVIEWS_REQUEST,
  PRODUCT_REVIEWS_SUCCESS,
  PRODUCT_REVIEWS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_RESET,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_RESET,
  PRODUCTS_BY_USER_REQUEST,
  PRODUCTS_BY_USER_SUCCESS,
  PRODUCTS_BY_USER_FAIL,
} from "../constants/productConstants";

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true };

    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };

    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_CREATE_RESET:
      return {};

    default:
      return state;
  }
};

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };

    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload,
      };

    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_LIST_RESET:
      return { products: [] };

    default:
      return state;
  }
};

export const latestProductsListReducer = (
  state = { latestProducts: [] },
  action
) => {
  switch (action.type) {
    case LATEST_PRODUCTS_LIST_REQUEST:
      return { loading: true, latestProducts: [] };

    case LATEST_PRODUCTS_LIST_SUCCESS:
      return {
        loading: false,
        latestProducts: action.payload,
      };

    case LATEST_PRODUCTS_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const latestReviewsListReducer = (
  state = { latestReviews: [] },
  action
) => {
  switch (action.type) {
    case LATEST_REVIEWS_LIST_REQUEST:
      return { loading: true, latestReviews: [] };

    case LATEST_REVIEWS_LIST_SUCCESS:
      return {
        loading: false,
        latestReviews: action.payload,
      };

    case LATEST_REVIEWS_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productMyListReducer = (state = { myProducts: [] }, action) => {
  switch (action.type) {
    case PRODUCT_MY_LIST_REQUEST:
      return { loading: true, myProducts: [] };

    case PRODUCT_MY_LIST_SUCCESS:
      return {
        loading: false,
        myProducts: action.payload,
      };

    case MY_PRODUCTS_SEARCH_SUCCESS:
      return {
        loading: false,
        myProducts: action.payload,
      };

    case PRODUCT_MY_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state };

    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };

    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_DETAILS_RESET:
      return { product: {} };

    default:
      return state;
  }
};

export const productReviewsReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case PRODUCT_REVIEWS_REQUEST:
      return { loading: true, ...state };

    case PRODUCT_REVIEWS_SUCCESS:
      return { loading: false, reviews: action.payload };

    case PRODUCT_REVIEWS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };

    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };

    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_DELETE_RESET:
      return {};

    default:
      return state;
  }
};

export const productReviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REVIEW_REQUEST:
      return { loading: true };

    case PRODUCT_CREATE_REVIEW_SUCCESS:
      return { loading: false, success: true };

    case PRODUCT_CREATE_REVIEW_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_CREATE_REVIEW_RESET:
      return {};

    default:
      return state;
  }
};

export const productsByUserReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCTS_BY_USER_REQUEST:
      return { loading: true };

    case PRODUCTS_BY_USER_SUCCESS:
      return { loading: false, products: action.payload };

    case PRODUCTS_BY_USER_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const reviewListReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case REVIEW_LIST_REQUEST:
      return { loading: true, reviews: [] };

    case REVIEW_LIST_SUCCESS:
      return {
        loading: false,
        reviews: action.payload,
      };

    case REVIEW_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
