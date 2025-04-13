import React, { useRef, useEffect, useState } from "react";
import { useCart } from "../context/CartContext"; // Update this path as needed
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPrinter, FiDownload, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import Squares from "./Squares"; // Make sure this path is correct
import QRCode from "react-qr-code";

const Invoice = () => {
  const { cart } = useCart();
  const invoiceRef = useRef(null);
  const [paymentId, setPaymentId] = useState(null);

  // Get the payment ID from session storage and inject print styles
  useEffect(() => {
    const storedPaymentId = sessionStorage.getItem("paymentId");
    if (storedPaymentId) {
      setPaymentId(storedPaymentId);
    }

    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
  body {
    margin: 0 !important;
    padding: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .no-print {
    display: none !important;
  }

  .print-container, .invoice-page {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .invoice-page {
    overflow: hidden;
    padding: 10px; /* Slight padding to avoid touching edges */
    margin: 0;
  }

  html, body {
    zoom: 80%; /* Reduce slightly more to ensure fit */
  }

  @page {
    margin: 8mm; /* Smaller margins to use more space */
  }

  /* Optional: Reduce QR code size if needed */
  .qr-code {
    width: 80px !important;
    height: 80px !important;
  }
}

    `;
    document.head.appendChild(style);
  }, []);

  // Group identical items together
  const groupedItems = cart.reduce((acc, item) => {
    const existingItem = acc.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  const totalPrice = cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  const invoiceNumber = `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
  const currentDate = new Date().toLocaleDateString("en-GB");

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleDownload = () => {
    alert(
      "In a real app, this would generate a PDF for download. Use a library like jsPDF or html2pdf."
    );
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
          {/* Header Buttons - hidden on print */}
          <div className="flex items-center justify-between mb-6 no-print">
            <Link
              to="/payment"
              className="text-gray-300 hover:text-gray-100 font-medium flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Back to Payment
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100">Invoice</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 font-medium hover:bg-gray-900 transition-all duration-300 flex items-center"
              >
                <FiPrinter className="mr-2" /> Print
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium hover:from-gray-700 hover:to-gray-600 transition-all duration-300 flex items-center"
              >
                <FiDownload className="mr-2" /> Download
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          {cart.length === 0 ? (
            <div className="bg-black bg-opacity-80 rounded-lg shadow-md p-8 text-center border border-gray-800">
              <p className="text-gray-400 text-lg mb-6">No items to invoice</p>
              <Link
                to="/menu"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium hover:from-gray-700 hover:to-gray-600 transition-all duration-300"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div
              ref={invoiceRef}
              className="bg-black bg-opacity-80 rounded-lg shadow-md p-6 md:p-8 border border-gray-800 print-container invoice-page"
            >
              {/* Invoice Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-800">
                <div>
                  <h1 className="text-2xl font-bold text-gray-100">INVOICE</h1>
                  <p className="text-gray-400">{invoiceNumber}</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="font-bold text-gray-300">Date:</p>
                  <p className="text-gray-400">{currentDate}</p>
                </div>
              </div>

              {/* From / To */}
              <div className="flex flex-col md:flex-row justify-between mb-8">
                <div>
                  <h2 className="font-bold text-gray-300 mb-2">From:</h2>
                  <p className="text-gray-400">Your Business Name</p>
                  <p className="text-gray-400">123 Business Street</p>
                  <p className="text-gray-400">City, State, ZIP</p>
                  <p className="text-gray-400">contact@yourbusiness.com</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <h2 className="font-bold text-gray-300 mb-2">To:</h2>
                  <p className="text-gray-400">Customer</p>
                  <p className="text-gray-400">Customer Address</p>
                  <p className="text-gray-400">Customer Contact</p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-2 text-gray-300">Item</th>
                      <th className="text-center py-3 px-2 text-gray-300">Quantity</th>
                      <th className="text-right py-3 px-2 text-gray-300">Price</th>
                      <th className="text-right py-3 px-2 text-gray-300">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-800">
                        <td className="py-3 px-2">
                          <div className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3 hidden md:block"
                            />
                            <span className="text-gray-300">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center text-gray-300">{item.quantity}</td>
                        <td className="py-3 px-2 text-right text-gray-300">₹{item.price}</td>
                        <td className="py-3 px-2 text-right text-gray-300">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full md:w-1/3">
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-300">Subtotal:</span>
                    <span className="text-gray-300">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-300">Tax (0%):</span>
                    <span className="text-gray-300">₹0.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-800 font-bold">
                    <span className="text-gray-200">Total:</span>
                    <span className="text-gray-100">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-8 pt-4 border-t border-gray-800">
                {paymentId ? (
                  <div className="flex flex-col items-center mb-4">
                    <div className="flex items-center mb-4">
                      <FiCheckCircle className="text-green-500 mr-2" size={24} />
                      <span className="text-green-500 font-medium">Payment Complete</span>
                    </div>
                    <p className="text-gray-400">Payment ID: {paymentId}</p>
                    {paymentId && (
                      <div className="mt-4 p-4 bg-white rounded">
                        <QRCode value={paymentId} size={128} />
                      </div>
                    )}
                    <div className="mt-4 p-4 border border-gray-700 rounded-lg bg-gray-900">
                      <p className="text-gray-400 text-center text-sm">
                        This invoice serves as proof of payment. Please keep it for your records.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center mb-4">
                    <p className="text-yellow-500 font-medium mb-4">Payment Pending</p>
                    <Link
                      to="/payment"
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium hover:from-gray-700 hover:to-gray-600 transition-all duration-300 flex items-center"
                    >
                      Go to Payment
                    </Link>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="mt-8 pt-4 border-t border-gray-800">
                <h2 className="font-bold text-gray-300 mb-2">Notes:</h2>
                <p className="text-gray-400">
                  Thank you for your business! We appreciate your patronage.
                </p>
                <p className="text-gray-400 mt-2">
                  For any questions about this invoice, please contact our support team.
                </p>
              </div>

              {/* T&Cs */}
              <div className="mt-8 pt-4 border-t border-gray-800">
                <h2 className="font-bold text-gray-300 mb-2">Terms & Conditions:</h2>
                <ul className="text-gray-400 list-disc pl-5 space-y-1">
                  <li>Payment is due upon receipt.</li>
                  <li>This invoice is automatically generated.</li>
                  <li>All items are non-refundable after consumption.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Invoice;
