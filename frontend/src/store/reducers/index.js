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
  orderMyListReducer,
  orderListReducer,
  orderDeliverReducer,
} from './orderReducers'

import {
  productListReducer,
  productMyListReducer,
  latestProductsListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productReviewCreateReducer,
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
    storesByUserReducer
} from './storeReducers'

export const reducers = combineReducers({

  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  profile: profileReducer,
  profileList: profileListReducer,
  profileDetails: profileDetailsReducer,
  myDetails: myDetailsReducer,
  userDetails: userDetailsReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  
  cart: cartReducer,

  productCategories: productCategoriesReducer,
  productSubcategories: productSubcategoriesReducer,

  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderMyList: orderMyListReducer,
  orderList: orderListReducer,
  orderDeliver: orderDeliverReducer,

  productList: productListReducer,
  productMyList: productMyListReducer,
  latestProductsList: latestProductsListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productReviewCreate: productReviewCreateReducer,
  reviewList: reviewListReducer,

  stockList: stockListReducer,
  stockUpdate: stockUpdateReducer,
  createStock: createStockReducer,

  storeList: storeListReducer,
  storeMyList: storeMyListReducer,
  storeDetails: storeDetailsReducer,
  createStore: createStoreReducer,
  storesByUser: storesByUserReducer,  
  
});