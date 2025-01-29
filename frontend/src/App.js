import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./containers/Home";
import Register from "./containers/Register";
import Login from "./containers/Login";
import MyProfile from "./containers/MyProfile";
import MyStores from "./containers/MyStores";
import MyProducts from "./containers/MyProducts";
import AddStore from "./containers/AddStore";
import AddProduct from "./containers/AddProduct";
import Product from "./containers/Product";
import Map from "./containers/Map";
import Seller from "./containers/Seller";
import Sellers from "./containers/Sellers";
import Cart from "./containers/Cart";
import PlaceOrder from "./containers/PlaceOrder";
import CustomerOrder from "./containers/CustomerOrder";
import CustomerOrders from "./containers/CustomerOrders";
import Shipping from "./containers/Shipping";
import Payment from "./containers/Payment";
import SellerOrders from "./containers/SellerOrders";
import SellerOrder from "./containers/SellerOrder";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/mystores" element={<MyStores />} />
          <Route path="/myproducts" element={<MyProducts />} />
          <Route path="/mystores/add-store" element={<AddStore />} />
          <Route path="/myproducts/add-product" element={<AddProduct />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/map" element={<Map />} />
          <Route path="/seller/:id" element={<Seller />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/customer-orders" element={<CustomerOrders />} />
          <Route path="/customer-order/:id" element={<CustomerOrder />} />
          <Route path="/seller-orders" element={<SellerOrders />} />
          <Route path="/seller-order/:id" element={<SellerOrder />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
