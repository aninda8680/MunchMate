import React, { useState } from "react";
import { motion } from "framer-motion";
import { Utensils, AlertTriangle, CheckCircle } from "lucide-react";
import { auth } from "../config"; // Adjust path as needed
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Aurora from "./Aurora"; // Make sure this path is correct

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Oops! We need your email to serve you";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Hmm, that doesn't look like a real email";
    } else if (!formData.email.endsWith("stu.adamasuniversity.ac.in")) {
      newErrors.email =
        "Please use your Adamas University email (@stu.adamasuniversity.ac.in)";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Hungry for a password? Create one!";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password too short - needs more flavor!";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFirebaseError(null);

    if (validateForm()) {
      setIsLoading(true);
      try {
        // Create user with Firebase Authentication
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // User creation successful
        setIsSubmitted(true);
        console.log("Tasty signup:", formData.email);
      } catch (error) {
        // Handle Firebase auth errors
        console.error("Firebase signup error:", error.code, error.message);
        let errorMessage = "Failed to create account. Please try again.";

        if (error.code === "auth/email-already-in-use") {
          errorMessage = "This email is already registered. Try signing in!";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Password is too weak. Add more ingredients!";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address format.";
        } else if (error.code === "auth/network-request-failed") {
          errorMessage = "Network error. Check your connection and try again.";
        }

        setFirebaseError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Navigate to UserDetails when "Continue" button is clicked
  const handleContinue = () => {
    navigate("/userdetails");
  };

  // Orange themed Aurora colors
  const auroraColors = ["#FF6600", "#FF8800", "#FFAA33"];

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Aurora colorStops={auroraColors} amplitude={1.2} blend={0.7} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden z-10"
      >
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8"
          >
            <CheckCircle className="mx-auto text-orange-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-orange-700 mb-4">
              Welcome to MunchMate!
            </h2>
            <p className="text-gray-600">
              Get ready to explore delicious adventures!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              Continue to Complete Profile
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-center">
              <Utensils className="mx-auto text-white" size={48} />
              <h2 className="text-3xl font-bold text-white mt-2">
                MunchMate Signup
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 pt-4">
              {firebaseError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start"
                >
                  <AlertTriangle
                    size={20}
                    className="mr-2 flex-shrink-0 mt-0.5"
                  />
                  <span>{firebaseError}</span>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-4"
              >
                <label className="block text-gray-700 text-lg mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your University Email"
                  className={`w-full p-3 rounded-lg border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500"
                  } focus:outline-none focus:ring-2`}
                />
                {errors.email && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle size={16} className="mr-2" />
                    {errors.email}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-4"
              >
                <label className="block text-gray-700 text-lg mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Secret Recipe 🍽️"
                  className={`w-full p-3 rounded-lg border ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500"
                  } focus:outline-none focus:ring-2`}
                />
                {errors.password && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle size={16} className="mr-2" />
                    {errors.password}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mb-6"
              >
                <label className="block text-gray-700 text-lg mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Secret Recipe 🥘"
                  className={`w-full p-3 rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500"
                  } focus:outline-none focus:ring-2`}
                />
                {errors.confirmPassword && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle size={16} className="mr-2" />
                    {errors.confirmPassword}
                  </div>
                )}
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                className={`w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </motion.button>

              {/* Sign In Option */}
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/signin");
                    }}
                    className="text-orange-600 hover:text-orange-800 font-semibold transition duration-300"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SignUp;
