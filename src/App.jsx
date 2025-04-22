import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import UserNavbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartContext";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import UserDetails from "./components/UserDetails";
import Invoice from "./components/Invoice";
import Landing from "./components/Landing";
import About from "./components/About";
import Payment from "./components/Payment";
import UserProfile from "./components/UserProfile";
import Orders from "./components/Orders";
import "./App.css";

function App() {
  const location = useLocation();

  // Check if current path is the landing page, sign in, or sign up page
  const isLandingPage = location.pathname === "/";
  const isAuthPage = ["/signin", "/signup", "/userdetails"].includes(location.pathname);

  return (
    <CartProvider>
      <div className="App">
        {/* Show user navbar if not on landing or auth pages */}
        {!isLandingPage && !isAuthPage && <UserNavbar />}

        <Routes>
          {/* Landing route */}
          <Route path="/" element={<Landing />} />

          {/* User routes */}
          <Route path="/home" element={<Hero />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/userdetails" element={<UserDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<Orders />} />

          {/* Auth routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
