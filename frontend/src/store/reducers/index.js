import { combineReducers } from "redux";

import {
  userLoginReducer,
  userRegisterReducer,
  profileReducer,
  myDetailsReducer,
  userDetailsReducer,
  userListReducer,
  userDeleteReducer,
  profileListReducer,
  profileDetailsReducer,
  sellerProfilesReducer,
  profileByUserReducer,
} from "./userReducers";

import { cartReducer } from "./cartReducers";

import {
  productCategoriesReducer,
  productSubcategoriesReducer,
} from "./categoriesReducers";

import {
  orderCreateReducer,
  orderDetailsReducer,
  sellerOrderDetailsReducer,
  orderPayReducer,
  sellerOrderCompleteReducer,
  purchaseMyListReducer,
  sellerOrderMyListReducer,
  orderListReducer,
  sellerOrderListReducer,
  sellerOrderSendReducer,
  sellerOrderRetrieveReducer,
} from "./orderReducers";

import {
  productListReducer,
  productMyListReducer,
  latestProductsListReducer,
  latestReviewsListReducer,
  productDetailsReducer,
  productReviewsReducer,
  productDeleteReducer,
  productCreateReducer,
  productReviewCreateReducer,
  productsByUserReducer,
  reviewListReducer,
} from "./productReducers";

import {
  createStockReducer,
  stockListReducer,
  stockUpdateReducer,
  productStocksReducer,
} from "./stockReducers";

import {
  createStoreReducer,
  storeListReducer,
  storeMyListReducer,
  storeDetailsReducer,
  storeStocksReducer,
  storesByUserReducer,
  storeDeleteReducer,
} from "./storeReducers";

export const reducers = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  profile: profileReducer,
  profileList: profileListReducer,
  profileDetails: profileDetailsReducer,
  sellerProfiles: sellerProfilesReducer,
  myDetails: myDetailsReducer,
  userDetails: userDetailsReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  profileByUser: profileByUserReducer,

  cart: cartReducer,

  productCategories: productCategoriesReducer,
  productSubcategories: productSubcategoriesReducer,

  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  sellerOrderDetails: sellerOrderDetailsReducer,
  orderPay: orderPayReducer,
  sellerOrderComplete: sellerOrderCompleteReducer,
  purchaseMyList: purchaseMyListReducer,
  sellerOrderMyList: sellerOrderMyListReducer,
  orderList: orderListReducer,
  sellerOrderList: sellerOrderListReducer,
  sellerOrderSend: sellerOrderSendReducer,
  sellerOrderRetrieve: sellerOrderRetrieveReducer,

  productList: productListReducer,
  productMyList: productMyListReducer,
  latestProductsList: latestProductsListReducer,
  latestReviewsList: latestReviewsListReducer,
  productDetails: productDetailsReducer,
  productStocks: productStocksReducer,
  productReviews: productReviewsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productReviewCreate: productReviewCreateReducer,
  productsByUser: productsByUserReducer,
  reviewList: reviewListReducer,

  stockList: stockListReducer,
  stockUpdate: stockUpdateReducer,
  createStock: createStockReducer,

  storeList: storeListReducer,
  storeMyList: storeMyListReducer,
  storeDetails: storeDetailsReducer,
  storeStocks: storeStocksReducer,
  createStore: createStoreReducer,
  storesByUser: storesByUserReducer,
  storeDelete: storeDeleteReducer,
});
