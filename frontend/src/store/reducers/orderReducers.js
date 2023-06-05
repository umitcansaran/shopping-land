import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_RESET,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_RESET,
  SELLER_ORDER_DETAILS_REQUEST,
  SELLER_ORDER_DETAILS_SUCCESS,
  SELLER_ORDER_DETAILS_FAIL,
  SELLER_ORDER_DETAILS_RESET,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_RESET,
  SELLER_ORDER_COMPLETE_REQUEST,
  SELLER_ORDER_COMPLETE_SUCCESS,
  SELLER_ORDER_COMPLETE_FAIL,
  SELLER_ORDER_COMPLETE_RESET,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_RESET,
  SELLER_ORDER_LIST_MY_REQUEST,
  SELLER_ORDER_LIST_MY_SUCCESS,
  SELLER_ORDER_LIST_MY_FAIL,
  SELLER_ORDER_LIST_MY_RESET,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  SELLER_ORDER_SEND_REQUEST,
  SELLER_ORDER_SEND_SUCCESS,
  SELLER_ORDER_SEND_FAIL,
  SELLER_ORDER_SEND_RESET,
  SELLER_ORDER_RETRIEVE_REQUEST,
  SELLER_ORDER_RETRIEVE_SUCCESS,
  SELLER_ORDER_RETRIEVE_FAIL,
  SELLER_ORDER_RETRIEVE_RESET,
  SELLER_ORDER_LIST_REQUEST,
  SELLER_ORDER_LIST_SUCCESS,
  SELLER_ORDER_LIST_FAIL,
} from "../constants/orderConstants";

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return {
        loading: true,
      };

    case ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      };

    case ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case ORDER_CREATE_RESET:
      return {};

    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };

    case ORDER_DETAILS_RESET:
      return {
        shippingAddress: {},
      };

    case ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const sellerOrderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case SELLER_ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SELLER_ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        sellerOrder: action.payload,
      };

    case SELLER_ORDER_DETAILS_RESET:
      return {
        shippingAddress: {},
      };

    case SELLER_ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_PAY_REQUEST:
      return {
        loading: true,
      };

    case ORDER_PAY_SUCCESS:
      return {
        loading: false,
        success: true,
      };

    case ORDER_PAY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case ORDER_PAY_RESET:
      return {};

    default:
      return state;
  }
};

export const sellerOrderCompleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SELLER_ORDER_COMPLETE_REQUEST:
      return {
        loading: true,
      };

    case SELLER_ORDER_COMPLETE_SUCCESS:
      return {
        loading: false,
        success: true,
      };

    case SELLER_ORDER_COMPLETE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case SELLER_ORDER_COMPLETE_RESET:
      return {};

    default:
      return state;
  }
};

export const sellerOrderSendReducer = (state = {}, action) => {
  switch (action.type) {
    case SELLER_ORDER_SEND_REQUEST:
      return {
        loading: true,
      };

    case SELLER_ORDER_SEND_SUCCESS:
      return {
        loading: false,
        success: true,
      };

    case SELLER_ORDER_SEND_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case SELLER_ORDER_SEND_RESET:
      return {};

    default:
      return state;
  }
};

export const sellerOrderRetrieveReducer = (state = {}, action) => {
  switch (action.type) {
    case SELLER_ORDER_RETRIEVE_REQUEST:
      return {
        loading: true,
      };

    case SELLER_ORDER_RETRIEVE_SUCCESS:
      return {
        loading: false,
        success: true,
      };

    case SELLER_ORDER_RETRIEVE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case SELLER_ORDER_RETRIEVE_RESET:
      return {};

    default:
      return state;
  }
};

export const purchaseMyListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_MY_REQUEST:
      return {
        loading: true,
      };

    case ORDER_LIST_MY_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };

    case ORDER_LIST_MY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case ORDER_LIST_MY_RESET:
      return {
        orders: [],
      };

    default:
      return state;
  }
};

export const sellerOrderMyListReducer = (
  state = { sellerOrders: [] },
  action
) => {
  switch (action.type) {
    case SELLER_ORDER_LIST_MY_REQUEST:
      return {
        loading: true,
      };

    case SELLER_ORDER_LIST_MY_SUCCESS:
      return {
        loading: false,
        sellerOrders: action.payload,
      };

    case SELLER_ORDER_LIST_MY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case SELLER_ORDER_LIST_MY_RESET:
      return {
        sellerOrders: [],
      };

    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return {
        loading: true,
      };

    case ORDER_LIST_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };

    case ORDER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const sellerOrderListReducer = (
  state = { sellerOrders: [] },
  action
) => {
  switch (action.type) {
    case SELLER_ORDER_LIST_REQUEST:
      return {
        loading: true,
      };

    case SELLER_ORDER_LIST_SUCCESS:
      return {
        loading: false,
        sellerOrders: action.payload,
      };

    case SELLER_ORDER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
