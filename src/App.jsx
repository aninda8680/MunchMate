import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import UserNavbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import AdminMenu from "./components/AdminMenu";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartContext";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import UserDetails from "./components/UserDetails";
import Invoice from './components/Invoice';
import Landing from "./components/Landing";
import "./App.css";
import About from "./components/About";
import Payment from "./components/Payment";
import UserProfile from "./components/UserProfile";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isAdminPath = location.pathname.includes("/admin");
    setIsAdmin(isAdminPath);
  }, [location]);

  // Check if current path is the landing page, sign in, or sign up page
  const isLandingPage = location.pathname === "/";
  const isAuthPage = ["/signin", "/signup", "/userdetails"].includes(location.pathname);

  return (
    <CartProvider>
      <div className="App">
        {/* Render appropriate Navbar based on path */}
        {!isLandingPage && !isAuthPage && (
          isAdmin ? <AdminNavbar /> : <UserNavbar />
        )}
        
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
          
          {/* Auth routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          
          {/* Admin routes */}
          <Route path="/admin/menu" element={<AdminMenu />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;