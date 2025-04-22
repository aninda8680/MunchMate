import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../config";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiCheck, FiX, FiTruck } from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/");
          return;
        }

        const q = query(
          collection(db, "invoices"),
          where("customer.uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const fetchedOrders = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FiClock className="text-yellow-500" />;
      case "Preparing":
        return <FiTruck className="text-blue-500" />;
      case "Delivered":
        return <FiCheck className="text-green-500" />;
      case "Cancelled":
        return <FiX className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  // Generate QR code for the invoice number
  const generateQRCode = (invoiceNumber) => {
    // Return an SVG QR code for the invoice number
    // Using a simple placeholder for now - in a real app, you'd use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(invoiceNumber)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center p-6 max-w-sm">
          <div className="h-12 w-12 border-t-2 border-r-2 border-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-orange-400 mb-6 hover:text-orange-300 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          <span>Back</span>
        </button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            My Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-black/40 rounded-xl p-8 text-center border border-orange-500/20 shadow-lg backdrop-blur-sm">
            <p className="text-gray-400 mb-4">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate("/menu")}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full text-white"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Order List */}
            {!selectedOrder && (
              <>
                <p className="text-gray-400 mb-4">
                  You have {orders.length} order{orders.length !== 1 ? "s" : ""}.
                </p>
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    variants={itemVariants}
                    className="bg-black/40 rounded-xl p-5 border border-orange-500/20 shadow-lg backdrop-blur-sm hover:bg-black/60 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-orange-400">
                          {order.invoiceNumber || `Order #${order.id.slice(0, 8)}`}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1 rounded-full">
                        {getStatusIcon(order.orderStatus)}
                        <span
                          className={`text-sm ${
                            order.orderStatus === "Delivered"
                              ? "text-green-400"
                              : order.orderStatus === "Pending"
                              ? "text-yellow-400"
                              : order.orderStatus === "Preparing"
                              ? "text-blue-400"
                              : "text-red-400"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {order.items && order.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-800/70 px-2 py-1 rounded-md"
                        >
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm">
                        {order.items && order.items.reduce((total, item) => total + item.quantity, 0)}{" "}
                        item{order.items && order.items.reduce((total, item) => total + item.quantity, 0) !== 1 ? "s" : ""}
                      </p>
                      <p className="font-semibold">
                        {order.totalAmount !== undefined ? `₹${order.totalAmount.toFixed(2)}` : "Price not available"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </>
            )}

            {/* Order Details - Simplified */}
            {selectedOrder && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 rounded-xl p-6 border border-orange-500/20 shadow-lg backdrop-blur-sm"
              >
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex items-center text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <FiArrowLeft className="mr-2" />
                    <span>Back to Orders</span>
                  </button>
                </div>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent mb-1">
                    {selectedOrder.invoiceNumber || `Order #${selectedOrder.id.slice(0, 8)}`}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Order Status:</span>
                    <div
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                        selectedOrder.orderStatus === "Delivered"
                          ? "bg-green-900/30 text-green-400"
                          : selectedOrder.orderStatus === "Pending"
                          ? "bg-yellow-900/30 text-yellow-400"
                          : selectedOrder.orderStatus === "Preparing"
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {getStatusIcon(selectedOrder.orderStatus)}
                      <span>{selectedOrder.orderStatus}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code and Order Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-900/50 rounded-lg p-4 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">
                      Invoice QR Code
                    </h3>
                    <img 
                      src={generateQRCode(selectedOrder.invoiceNumber || selectedOrder.id)} 
                      alt="Invoice QR Code" 
                      className="w-32 h-32 mb-2"
                    />
                    <p className="text-sm text-gray-400">Scan to verify invoice</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">
                      Order Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Order Date:</span>
                        <span>{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Invoice Number:</span>
                        <span>{selectedOrder.invoiceNumber || `#${selectedOrder.id.slice(0, 8)}`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items - Fixed version */}
                <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-orange-400">
                    Order Items
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-400">Item</th>
                          <th className="text-right py-2 text-gray-400">Price</th>
                          <th className="text-right py-2 text-gray-400">Qty</th>
                          <th className="text-right py-2 text-gray-400">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                          <tr 
                            key={idx} 
                            className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                          >
                            <td className="py-3">{item.name}</td>
                            <td className="text-right">₹{item.price !== undefined ? item.price.toFixed(2) : "N/A"}</td>
                            <td className="text-right">{item.quantity}</td>
                            <td className="text-right">
                              {item.subtotal !== undefined ? `₹${item.subtotal.toFixed(2)}` : 
                               (item.price !== undefined && item.quantity) ? `₹${(item.price * item.quantity).toFixed(2)}` : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="text-white">
                          <td colSpan={3} className="text-right pt-3 text-lg font-bold">
                            Total:
                          </td>
                          <td className="text-right text-lg font-bold">
                            {selectedOrder.totalAmount !== undefined ? 
                              `₹${selectedOrder.totalAmount.toFixed(2)}` : 
                              "N/A"}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;