import React from "react";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from './components/Footer'
import HomeScreen from "./screens/HomeScreen"
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from './screens/LoginScreen'
import ProductsScreen from "./screens/ProductsScreen";
import RetailersScreen from "./screens/RetailersScreen";
import AddProductScreen from "./screens/AddProductScreen";
import AddStoreScreen from './screens/AddStoreScreen'
import MapScreen from './screens/MapScreen'
import MyStoresScreen from './screens/MyStoresScreen'
import MyProductsScreen from "./screens/MyProductsScreen.js";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RetailerScreen from "./screens/RetailerScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrdersScreen from "./screens/OrdersScreen";

function App() {

  return (
    <HashRouter>
    <Header/>
      <main>
      <Routes>
        <Route exact path="/" element={<HomeScreen />} />
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={< OrderScreen />} />
        <Route path='/orders' element={< OrdersScreen />} />
        <Route path="/orders" element={< OrdersScreen />} />
        <Route path="/retailers" element={<RetailersScreen />} />
        <Route path="/retailers/:id" element={<RetailerScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path='/products' element={<ProductsScreen />} />
        <Route path='/product/:id' element={<ProductScreen />} />
        <Route path='/mystores' element={<MyStoresScreen />} />
        <Route path='/myproducts' element={<MyProductsScreen />} />
        <Route path='/map' element={< MapScreen />} />
        <Route path='/myproducts/add-product' element={<AddProductScreen />} />
        <Route path='/mystores/add-store' element={<AddStoreScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path='/login' element={<LoginScreen />} />

      </Routes>
      </main>
    <Footer/>
    </HashRouter> 
  );
}

export default App;
