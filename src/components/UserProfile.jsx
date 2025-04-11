import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser, FiEdit, FiLogOut, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/");
          return;
        }

        const userDocRef = doc(db, "userProfiles", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setUserData({ 
            name: user.displayName || "User",
            email: user.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="h-16 w-16 border-t-4 border-r-4 border-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate("/home")}
          className="mb-6 flex items-center space-x-2 text-orange-400 hover:text-orange-300"
        >
          <FiArrowLeft />
          <span>Back to Home</span>
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-orange-500/20 shadow-lg shadow-orange-500/10"
        >
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-orange-500/20">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-full p-4 text-white">
              <FiUser size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{userData?.name || "User"}</h1>
              <p className="text-orange-400/80">{userData?.email || ""}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-orange-400 mb-4">Personal Information</h2>
              
              <InfoItem label="Full Name" value={userData?.name} />
              <InfoItem label="Email Address" value={userData?.email} />
              <InfoItem label="Contact Number" value={userData?.contactNumber} />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-orange-400 mb-4">Academic Information</h2>
              
              <InfoItem label="Roll Number" value={userData?.rollNumber} />
              <InfoItem label="Semester" value={userData?.semester} />
              <InfoItem label="Section" value={userData?.section} />
              <InfoItem label="Department" value={userData?.department} />
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
            <motion.button
              onClick={() => navigate("/UserDetails")}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiEdit />
              <span>Edit Profile</span>
            </motion.button>
            
            <motion.button
              onClick={handleSignOut}
              className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 rounded-lg border border-orange-500/30 hover:bg-orange-950/50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiLogOut />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-orange-500/20 shadow-lg shadow-orange-500/10"
        >
          <h2 className="text-xl font-semibold text-orange-400 mb-4">Order History</h2>
          <p className="text-gray-400">Your recent orders will appear here.</p>
          {/* Order history could be implemented here */}
        </motion.div>
      </div>
    </div>
  );
};

// Helper component for information items
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-orange-400/80 text-sm">{label}</span>
    <span className="text-gray-200 font-medium">{value || "Not provided"}</span>
  </div>
);

export default UserProfile;