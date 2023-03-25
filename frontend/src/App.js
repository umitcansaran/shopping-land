import React from "react";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./containers/Home";
import RegisterScreen from "./containers/Register";
import LoginScreen from "./containers/Login";
import AddProductScreen from "./containers/AddProduct";
import AddStoreScreen from "./containers/AddStore";
import MapScreen from "./containers/Map";
import MyStoresScreen from "./containers/MyStores";
import MyProductsScreen from "./containers/MyProducts.js";
import ProductScreen from "./containers/Product";
import CartScreen from "./containers/Cart";
import ProfileScreen from "./containers/MyProfile";
import SellerScreen from "./containers/Seller";
import SellersScreen from "./containers/Sellers";
import ShippingScreen from "./containers/Shipping";
import PaymentScreen from "./containers/Payment";
import PlaceOrderScreen from "./containers/PlaceOrder";
import OrderScreen from "./containers/Order";
import OrdersScreen from "./containers/Orders";

function App() {
  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route exact path="/" element={<HomeScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/orders" element={<OrdersScreen />} />
          <Route path="/orders" element={<OrdersScreen />} />
          <Route path="/sellers" element={<SellersScreen />} />
          <Route path="/seller/:id" element={<SellerScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/mystores" element={<MyStoresScreen />} />
          <Route path="/myproducts" element={<MyProductsScreen />} />
          <Route path="/map" element={<MapScreen />} />
          <Route
            path="/myproducts/add-product"
            element={<AddProductScreen />}
          />
          <Route path="/mystores/add-store" element={<AddStoreScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}

export default App;
