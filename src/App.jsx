import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Admin from "./Admin/Admin";
import Dashboard from "./Admin/Dashboard";
import Users from "./Admin/Users";
import Addproduct from "./Admin/Addproduct";
import Product from "./Admin/Product";
import { useProduct } from "./redux/Productprovider";
import Cart from "./components/Cart";
import Success from "./components/Success";
import Footer from "./components/Footer";
import Orderadmin from "./Admin/Orderadmin";
import Orders from "./components/Orders";

export default function App() {

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { productlist } = useProduct();
  const fetchproducts = async () => {
    try {
      const response = await fetch(`${backendURL}/api/product`);
      const data = await response.json();
      productlist(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchproducts();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cancel" element={<Cart />} />
          <Route path="/success" element={<Success />} />
          <Route path="/orders" element={<Orders/>}/>
          {/*admin panal*/}
          <Route path="/admin" element={<Admin />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="addproduct" element={<Addproduct />} />
            <Route path="product" element={<Product />} />
            <Route path="order" element={<Orderadmin/>}/>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
