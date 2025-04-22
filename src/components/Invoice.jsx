import React, { useRef, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPrinter,
  FiDownload,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import Squares from "./Squares";
import QRCode from "react-qr-code";
import { db, auth } from "../config"; // Import Firebase db and auth
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore"; // Import Firestore functions

const Invoice = () => {
  const { cart } = useCart();
  const invoiceRef = useRef(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [invoiceSaved, setInvoiceSaved] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState("Not Given"); // Simplified status

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

  const totalPrice = cart
    .reduce((total, item) => total + item.price, 0)
    .toFixed(2);
  const currentDate = new Date().toLocaleDateString("en-GB");

  // Fetch user details from Firestore
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setError(null);
        const user = auth.currentUser;
        if (!user) {
          console.log("No user is signed in");
          setError("No user is signed in. Please log in to continue.");
          setIsLoading(false);
          return;
        }

        // Use userProfiles collection
        const userDocRef = doc(db, "userProfiles", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          setUserDetails(userSnapshot.data());
        } else {
          // Fallback to basic auth info if userProfile not found
          setUserDetails({
            name: user.displayName || user.email || "Guest User",
            email: user.email || "No email provided",
            uid: user.uid,
          });

          console.log("No user profile document found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user details. Using limited information.");

        // Use auth information as fallback if Firestore fails
        const user = auth.currentUser;
        if (user) {
          setUserDetails({
            name: user.displayName || user.email || "Guest User",
            email: user.email || "No email provided",
            uid: user.uid,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Get the latest order number and invoice number
  useEffect(() => {
    const fetchLatestInvoiceNumber = async () => {
      try {
        // First try to get the invoice number from Firestore
        let nextSerialNumber = 1; // Default start

        try {
          // Query to get the last invoice ordered by invoice number (descending)
          const invoicesRef = collection(db, "invoices");
          const q = query(
            invoicesRef,
            orderBy("serialNumber", "desc"),
            limit(1)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const latestInvoice = querySnapshot.docs[0].data();
            nextSerialNumber = latestInvoice.serialNumber + 1;
          }
        } catch (firebaseError) {
          console.error("Firestore query failed:", firebaseError);
          // Continue with the default invoice number if Firestore fails
        }

        // Format invoice and order numbers
        const formattedInvoiceNumber = `INV-${nextSerialNumber
          .toString()
          .padStart(4, "0")}`;
        const formattedOrderNumber = `TKY-${nextSerialNumber
          .toString()
          .padStart(4, "0")}`;
        setInvoiceNumber(formattedInvoiceNumber);
        setOrderNumber(formattedOrderNumber);

        setIsLoading(false);

        // Save the invoice to Firebase if we have items in cart
        if (cart.length > 0 && userDetails) {
          saveInvoiceToFirebase(
            nextSerialNumber,
            formattedInvoiceNumber,
            formattedOrderNumber
          );
        }
      } catch (error) {
        console.error("Error in invoice process:", error);
        // Fallback to random number if everything fails
        const randomNumber = Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0");
        setInvoiceNumber(`INV-${randomNumber}`);
        setOrderNumber(`TKY-${randomNumber}`);
        setIsLoading(false);
      }
    };

    // Inject print styles
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
          padding: 10px;
          margin: 0;
        }

        html, body {
          zoom: 80%;
        }

        @page {
          margin: 8mm;
        }

        .qr-code {
          width: 80px !important;
          height: 80px !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Only fetch invoice number when user details are available
    if (userDetails) {
      fetchLatestInvoiceNumber();
    } else if (!isLoading) {
      // Generate a random invoice number if we don't have user details
      const randomNumber = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      setInvoiceNumber(`INV-${randomNumber}`);
      setOrderNumber(`TKY-${randomNumber}`);
    }
  }, [cart, userDetails, isLoading]);

  // Save invoice data to Firebase
  const saveInvoiceToFirebase = async (
    serialNumber,
    formattedInvoiceNumber,
    formattedOrderNumber
  ) => {
    if (invoiceSaved || cart.length === 0 || !userDetails) return;

    setIsSaving(true);

    try {
      // Calculate subtotals for each item
      const items = groupedItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      // Create invoice data object with user details
      const invoiceData = {
        serialNumber: serialNumber,
        invoiceNumber: formattedInvoiceNumber,
        orderNumber: formattedOrderNumber,
        date: new Date(), // Store as Firestore timestamp
        formattedDate: currentDate,
        customer: {
          uid: userDetails.uid || "guest",
          name: userDetails.name || "Guest User",
          email: userDetails.email || "Unknown",
          contactNumber: userDetails.contactNumber || "Unknown",
          // Student specific fields if needed
          rollNumber: userDetails.rollNumber || "Unknown",
          department: userDetails.department || "Unknown",
          section: userDetails.section || "Unknown",
          semester: userDetails.semester || "Unknown",
        },
        items: items,
        subtotal: parseFloat(totalPrice),
        tax: 0,
        totalAmount: parseFloat(totalPrice),
        deliveryStatus: deliveryStatus,
        orderType: "Takeaway",
        createdAt: new Date(),
      };

      // Add to Firestore
      try {
        const invoicesRef = collection(db, "invoices");
        const docRef = await addDoc(invoicesRef, invoiceData);
        console.log("Invoice saved with ID:", docRef.id);
        setInvoiceSaved(true);
      } catch (firebaseError) {
        console.error("Firestore save failed:", firebaseError);
        // Store in local storage as fallback
        localStorage.setItem(
          `invoice_${formattedInvoiceNumber}`,
          JSON.stringify(invoiceData)
        );
        console.log("Invoice saved to local storage as fallback");
        setInvoiceSaved(true);
      }
    } catch (error) {
      console.error("Error processing invoice data:", error);
      setError(
        "Failed to save invoice to database. A local copy has been stored."
      );

      // Store in local storage as ultimate fallback
      try {
        localStorage.setItem(
          `invoice_emergency_${Date.now()}`,
          JSON.stringify({
            invoiceNumber: formattedInvoiceNumber,
            orderNumber: formattedOrderNumber,
            date: currentDate,
            customerName: userDetails?.name || "Guest",
            items: groupedItems,
            total: totalPrice,
            deliveryStatus: deliveryStatus,
          })
        );
      } catch (localStorageError) {
        console.error("Even local storage failed:", localStorageError);
      }
    } finally {
      setIsSaving(false);
    }
  };

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

  const getStatusIcon = () => {
    switch (deliveryStatus.toLowerCase()) {
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "not delivered":
        return <FiAlertCircle className="text-yellow-500" />;
      default:
        return <FiAlertCircle className="text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="text-gray-300">Loading your order receipt...</div>
      </div>
    );
  }

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
              to="/menu"
              className="text-gray-300 hover:text-gray-100 font-medium flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Back to Menu
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100">
              Order Receipt
            </h2>
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

          {/* Error and Status Messages - hidden on print */}
          {error && (
            <div className="bg-red-900 bg-opacity-40 text-red-200 rounded-lg p-4 mb-4 text-center no-print flex items-center justify-center">
              <FiAlertCircle className="mr-2" size={20} />
              <span>{error}</span>
            </div>
          )}

          {isSaving && (
            <div className="bg-yellow-900 bg-opacity-40 text-yellow-200 rounded-lg p-2 mb-4 text-center no-print">
              Processing your order...
            </div>
          )}

          {invoiceSaved && (
            <div className="bg-green-900 bg-opacity-40 text-green-200 rounded-lg p-2 mb-4 text-center no-print">
              Order successfully saved!
            </div>
          )}

          {/* Invoice Content */}
          {cart.length === 0 ? (
            <div className="bg-black bg-opacity-80 rounded-lg shadow-md p-8 text-center border border-gray-800">
              <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
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
                  <h1 className="text-2xl font-bold text-gray-100">
                    TAKEAWAY ORDER
                  </h1>
                  <p className="text-gray-400">Order #: {orderNumber}</p>
                  <p className="text-gray-400 text-sm">
                    Invoice #: {invoiceNumber}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="font-bold text-gray-300">Date:</p>
                  <p className="text-gray-400">{currentDate}</p>
                </div>
              </div>

              {/* From / To */}
              <div className="flex flex-col md:flex-row justify-between mb-8">
                <div>
                  <h2 className="font-bold text-gray-300 mb-2">Pickup from:</h2>
                  <p className="text-gray-400">Your Business Name</p>
                  <p className="text-gray-400">123 Campus Street</p>
                  <p className="text-gray-400">Building #2, Food Court</p>
                  <p className="text-gray-400">contact@yourfoodcourt.com</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <h2 className="font-bold text-gray-300 mb-2">Customer:</h2>
                  {userDetails ? (
                    <>
                      <p className="text-gray-400">{userDetails.name}</p>
                      {userDetails.contactNumber && (
                        <p className="text-gray-400">
                          Phone: {userDetails.contactNumber}
                        </p>
                      )}
                      {userDetails.email && (
                        <p className="text-gray-400">{userDetails.email}</p>
                      )}
                      {userDetails.rollNumber && (
                        <p className="text-gray-400">
                          Roll No: {userDetails.rollNumber}
                        </p>
                      )}
                      {userDetails.department && (
                        <p className="text-gray-400">
                          {userDetails.department}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-gray-400">Guest Customer</p>
                      <p className="text-gray-400">
                        Guest Details Not Available
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-2 text-gray-300">
                        Item
                      </th>
                      <th className="text-center py-3 px-2 text-gray-300">
                        Quantity
                      </th>
                      <th className="text-right py-3 px-2 text-gray-300">
                        Price
                      </th>
                      <th className="text-right py-3 px-2 text-gray-300">
                        Amount
                      </th>
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
                        <td className="py-3 px-2 text-center text-gray-300">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-2 text-right text-gray-300">
                          ₹{item.price}
                        </td>
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

              {/* Order Status - Simplified */}
              <div className="mt-8 pt-4 border-t border-gray-800">
                <div className="flex flex-col items-center">
                  <div className="flex items-center mb-4">
                    {getStatusIcon()}
                    <span
                      className={`font-medium ml-2 ${
                        deliveryStatus.toLowerCase() === "delivered"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      Status: {deliveryStatus}
                    </span>
                  </div>

                  <div className="mt-4 bg-gray-900 p-4 rounded-lg w-full max-w-md">
                    <p className="text-gray-400 text-center">
                      Food Court, Building #2
                    </p>
                    <p className="text-gray-400 text-center">
                      Show this receipt when picking up your order
                    </p>
                  </div>

                  <div className="mt-4">
                    <QRCode
                      value={`${orderNumber}|${currentDate}`}
                      size={128}
                      className="qr-code bg-white p-2 rounded"
                    />
                    <p className="text-gray-400 text-center mt-2 text-sm">
                      Scan to verify order
                    </p>
                  </div>
                </div>
              </div>

              {/* Pickup Instructions */}
              <div className="mt-8 pt-4 border-t border-gray-800">
                <h2 className="font-bold text-gray-300 mb-2">
                  Pickup Instructions:
                </h2>
                <ul className="text-gray-400 list-disc pl-5 space-y-1">
                  <li>
                    Present this receipt or order number when collecting your
                    order
                  </li>
                  <li>For any changes, please contact us immediately</li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-4 border-t border-gray-800">
                <h2 className="font-bold text-gray-300 mb-2">Need Help?</h2>
                <p className="text-gray-400">Call us: +91 1234567890</p>
                <p className="text-gray-400">
                  Email: support@yourfoodcourt.com
                </p>
              </div>

              {/* T&Cs */}
              <div className="mt-8 pt-4 border-t border-gray-800">
                <h2 className="font-bold text-gray-300 mb-2">
                  Terms & Conditions:
                </h2>
                <ul className="text-gray-400 list-disc pl-5 space-y-1">
                  <li>All items are non-refundable after collection</li>
                  <li>Please check your order details at the time of pickup</li>
                  <li>
                    This receipt is automatically generated and serves as proof
                    of purchase
                  </li>
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
