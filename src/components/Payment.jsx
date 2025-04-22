import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCreditCard, FiCheckCircle } from "react-icons/fi";
import Squares from "./Squares";

const Payment = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  // Group identical items together for display
  const groupedItems = cart.reduce((acc, item) => {
    const existingItem = acc.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  // Calculate total price
  const totalPrice = cart
    .reduce((total, item) => total + item.price, 0)
    .toFixed(2);

  // Generate order number
  const orderNumber = `ORD-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle payment
  const handlePayment = () => {
    setIsProcessing(true);

    try {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error("Razorpay key not found");
      }

      const options = {
        key: razorpayKey,
        amount: Math.round(parseFloat(totalPrice) * 100),
        currency: "INR",
        name: "MunchMate",
        description: `Payment for order ${orderNumber}`,
        image: "/restaurant-store-svgrepo-com.svg",
        handler: function (response) {
          if (response.razorpay_payment_id) {
            setPaymentId(response.razorpay_payment_id);
            setIsProcessing(false);
            setIsComplete(true);

            sessionStorage.setItem("paymentId", response.razorpay_payment_id);
            sessionStorage.setItem("orderNumber", orderNumber);
            sessionStorage.setItem("totalAmount", totalPrice);

            setTimeout(() => {
              navigate("/invoice");
            }, 2000);
          } else {
            throw new Error("Payment failed");
          }
        },
        prefill: {
          name: sessionStorage.getItem("userName") || "Guest User",
          email: sessionStorage.getItem("userEmail") || "",
          contact: "",
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: "Payment methods",
                instruments: [
                  { method: "upi" },
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        theme: {
          color: "#1d4ed8",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment failed: " + response.error.description);
        setIsProcessing(false);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initialization failed: " + error.message);
      setIsProcessing(false);
    }
  };

  const handleDemoPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      const demoPaymentId =
        "DEMO-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      setPaymentId(demoPaymentId);
      setIsProcessing(false);
      setIsComplete(true);

      // Store demo payment details
      sessionStorage.setItem("paymentId", demoPaymentId);
      sessionStorage.setItem("orderNumber", orderNumber);
      sessionStorage.setItem("totalAmount", totalPrice);

      setTimeout(() => {
        navigate("/invoice");
      }, 2000);
    }, 2000); // Simulate 2 second processing time
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Squares
          direction="none"
          speed={0}
          borderColor="#333"
          squareSize={50}
          hoverFillColor="#444"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 min-h-screen p-4 md:p-8 bg-transparent"
      >
        <div className="max-w-3xl mx-auto py-30">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/cart"
              className="text-gray-300 hover:text-gray-100 font-medium flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Back to Cart
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100">
              Payment
            </h2>
          </div>

          {cart.length === 0 ? (
            <div className="bg-black bg-opacity-80 rounded-lg shadow-md p-8 text-center border border-gray-800">
              <p className="text-gray-400 text-lg mb-6">No items to pay for</p>
              <Link
                to="/menu"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium hover:from-gray-700 hover:to-gray-600 transition-all duration-300"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-black bg-opacity-80 rounded-lg shadow-md p-6 mb-6 border border-gray-800">
                <h3 className="text-xl font-bold text-gray-100 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  {groupedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center pb-3 border-b border-gray-800"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-700"
                        />
                        <div>
                          <p className="text-gray-200">{item.name}</p>
                          <div className="flex space-x-4 text-sm text-gray-400">
                            <p>
                              ₹{item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-200">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-400">Order Number</span>
                    <span className="font-medium text-gray-200">
                      {orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Items ({cart.length})</span>
                    <span className="font-medium text-gray-200">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-300">
                      Total Amount
                    </span>
                    <span className="text-lg font-bold text-white">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-black bg-opacity-80 rounded-lg shadow-md p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-gray-100 mb-4">
                  Payment Method
                </h3>

                {isComplete ? (
                  <div className="text-center py-6">
                    <div className="flex justify-center mb-4">
                      <FiCheckCircle className="text-green-500" size={60} />
                    </div>
                    <h4 className="text-xl font-bold text-green-500 mb-2">
                      Payment Successful!
                    </h4>
                    <p className="text-gray-400 mb-2">
                      Payment ID: {paymentId}
                    </p>
                    <p className="text-gray-400">Redirecting to invoice...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-500 transition-all duration-300 flex justify-center items-center"
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
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
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <FiCreditCard className="mr-2" />
                          Pay with Razorpay
                        </span>
                      )}
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-black text-gray-400">Or</span>
                      </div>
                    </div>

                    <button
                      onClick={handleDemoPayment}
                      disabled={isProcessing}
                      className="w-full px-6 py-4 rounded-lg border border-gray-700 text-gray-300 font-medium hover:bg-gray-900 transition-all duration-300 flex justify-center items-center"
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
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
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <FiCreditCard className="mr-2" />
                          Demo Payment
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;
