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
} from './userReducers'

import { 
  cartReducer 
} from './cartReducers'

import {
  productCategoriesReducer,
  productSubcategoriesReducer,
} from './categoriesReducers'

import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  purchaseMyListReducer,
  orderListReducer,
  subOrderListReducer,
  orderDeliverReducer,
} from './orderReducers'

import {
  productListReducer,
  productMyListReducer,
  latestProductsListReducer,
  latestReviewsListReducer,
  productDetailsReducer,
  productStocksReducer,
  productReviewsReducer,
  productDeleteReducer,
  productCreateReducer,
  productReviewCreateReducer,
  productsByUserReducer,
  reviewListReducer,
} from './productReducers'

import {
  createStockReducer,
  stockListReducer,
  stockUpdateReducer,
} from './stockReducers'

import {
    createStoreReducer,
    storeListReducer,
    storeMyListReducer,
    storeDetailsReducer,
    storeStocksReducer,
    storesByUserReducer,
    storeDeleteReducer,
} from './storeReducers'

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
  orderPay: orderPayReducer,
  purchaseMyList: purchaseMyListReducer,
  orderList: orderListReducer,
  subOrderList: subOrderListReducer,
  orderDeliver: orderDeliverReducer,

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
  storeDelete: storeDeleteReducer
});