import React, { useState, useEffect } from "react";
import {
  FiMenu, FiX, FiUser, FiList, FiBookOpen, FiCamera, FiLogOut
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config";
import { onAuthStateChanged } from "firebase/auth";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("Menu");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Menu", icon: <FiBookOpen />, path: "/admin/menu" },
    { name: "Orders", icon: <FiList />, path: "/admin/orders" },
    { name: "Scan QR", icon: <FiCamera />, path: "/admin/scan" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "userProfiles", user.uid));
          setUserData(userDoc.exists() ? userDoc.data() : { 
            name: user.displayName || "Admin", email: user.email || "" 
          });
        } catch (error) {
          console.error("Error fetching admin data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem) setActiveItem(currentItem.name);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".mobile-menu-container")) setIsOpen(false);
      if (showProfileDropdown && !e.target.closest(".profile-dropdown-container")) setShowProfileDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, showProfileDropdown]);

  const handleNavigation = (itemName, path) => {
    setIsOpen(false);
    setActiveItem(itemName);
    navigate(path);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
      setShowProfileDropdown(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-[90%] md:w-4/5 lg:w-3/4 bg-gray-900/75 backdrop-blur-md rounded-2xl py-4 px-6 flex justify-between items-center border border-purple-500/20">
        <div className="cursor-pointer relative">
          <span className="text-2xl font-bold text-white relative">
            <span className="bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 bg-clip-text text-transparent">Munch</span>
            <span className="text-white">Mate</span>
            <span className="text-xs ml-2 text-purple-300">ADMIN</span>
          </span>
        </div>
        <div className="flex items-center">
          <div className="h-5 w-5 border-t-2 border-r-2 border-purple-500 rounded-full animate-spin mr-2"></div>
          <p className="text-purple-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-[90%] md:w-4/5 lg:w-3/4 ${
        scrolled ? "bg-gray-900/90 shadow-lg shadow-purple-500/40" : "bg-gray-900/75"
      } backdrop-blur-md rounded-2xl transition-all duration-500 border border-purple-500/20`}
    >
      <div className="flex justify-between items-center w-full px-6 py-3">
        {/* Logo */}
        <div onClick={() => navigate("/admin/menu")} className="cursor-pointer">
          <span className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 bg-clip-text text-transparent">Munch</span>
            <span className="text-white">Mate</span>
            <span className="text-xs ml-2 text-purple-300 border border-purple-400 px-2 py-0.5 rounded-md">ADMIN</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-10">
          {menuItems.map((item) => (
            <a 
              key={item.name}
              onClick={() => handleNavigation(item.name, item.path)}
              className={`flex items-center space-x-2 relative font-medium cursor-pointer ${
                activeItem === item.name ? "text-purple-400" : "text-gray-300"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
              {activeItem === item.name && (
                <div className="h-0.5 bg-purple-500 rounded-full absolute bottom-0 left-0 w-full"></div>
              )}
            </a>
          ))}
        </div>

        {/* User Profile (Desktop) */}
        <div className="hidden md:flex space-x-2 items-center">
          <div className="relative profile-dropdown-container">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-gray-900 text-white px-4 py-2 rounded-full"
            >
              <FiUser />
              <span>Admin</span>
              <FiMenu className="ml-2" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900/90 backdrop-blur-md shadow-lg rounded-xl p-2 z-50 border border-purple-500/20 text-white">
                <button
                  onClick={() => navigate("/admin/profile")}
                  className="text-white text-sm py-1.5 px-4 rounded-md text-left hover:bg-purple-500/20 w-full flex items-center space-x-2"
                >
                  <FiUser size={14} />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="text-white text-sm py-1.5 px-4 rounded-md text-left hover:bg-purple-500/20 w-full flex items-center space-x-2"
                >
                  <FiMenu size={14} />
                  <span>User View</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-white text-sm py-1.5 px-4 rounded-md text-left hover:bg-purple-500/20 w-full flex items-center space-x-2"
                >
                  <FiLogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-2xl text-purple-500 bg-gray-900/40 p-2 rounded-full"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && userData && (
        <div className="md:hidden absolute top-16 right-0 bg-gray-900/95 backdrop-blur-md shadow-lg rounded-xl p-5 flex flex-col space-y-4 w-60 mobile-menu-container border-l border-t border-purple-500/20">
          <div className="flex items-center space-x-3 border-b border-purple-500/20 pb-3">
            <div className="bg-purple-500/20 rounded-full p-2">
              <FiUser className="text-purple-400" />
            </div>
            <div className="text-left">
              <p className="font-bold text-purple-400">Admin Panel</p>
            </div>
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.name}
                onClick={() => handleNavigation(item.name, item.path)}
                className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${
                  activeItem === item.name
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-gray-300 hover:bg-purple-500/10 hover:text-purple-400"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            ))}
            
            <a
              onClick={() => navigate("/admin/profile")}
              className="flex items-center space-x-3 py-2 px-3 rounded-lg text-gray-300 hover:bg-purple-500/10 hover:text-purple-400"
            >
              <span className="text-lg"><FiUser /></span>
              <span>Admin Profile</span>
            </a>
            
            <a
              onClick={() => navigate("/home")}
              className="flex items-center space-x-3 py-2 px-3 rounded-lg text-gray-300 hover:bg-purple-500/10 hover:text-purple-400"
            >
              <span className="text-lg"><FiMenu /></span>
              <span>User View</span>
            </a>
          </div>

          <div className="pt-2 border-t border-purple-500/20">
            <button
              onClick={handleSignOut}
              className="w-full bg-gradient-to-r from-purple-600 to-gray-900 text-white py-2 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default AdminNavbar;