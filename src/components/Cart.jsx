import { useCart } from "../context/CartContext"; // Update this path to where you place the context file
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTrash2,
  FiShoppingBag,
  FiPlus,
  FiMinus,
  FiCreditCard,
} from "react-icons/fi";
import Squares from "./Squares"; // Make sure this path is correct

const Cart = () => {
  // Destructure all needed functions and state from the context
  const { cart, removeFromCart, clearCart, addToCart, decreaseQuantity } =
    useCart();

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

  // Calculate total price
  const totalPrice = cart
    .reduce((total, item) => total + item.price, 0)
    .toFixed(2);

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
    visible: { opacity: 1, y: 0 },
  };

  // Define manual decrease function if context one is not available
  const handleDecreaseQuantity = (itemId) => {
    console.log("Decreasing quantity for item:", itemId);
    if (typeof decreaseQuantity === "function") {
      decreaseQuantity(itemId);
    } else {
      console.error("decreaseQuantity not available in context");
      // Fallback implementation
      const itemIndex = cart.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        const newCart = [...cart];
        newCart.splice(itemIndex, 1);
        // You would need setCart here, but this is just a fallback
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Squares background */}
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100">
              Your Cart
            </h2>
            <Link
              to="/menu"
              className="text-gray-300 hover:text-gray-100 font-medium flex items-center"
            >
              <span className="mr-2">Continue Shopping</span>
            </Link>
          </div>

          {cart.length === 0 ? (
            <div className="bg-black bg-opacity-80 rounded-lg shadow-md p-8 text-center border border-gray-800">
              <div className="flex justify-center mb-4">
                <FiShoppingBag size={60} className="text-gray-600" />
              </div>
              <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
              <Link
                to="/menu"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium hover:from-gray-700 hover:to-gray-600 transition-all duration-300"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-black bg-opacity-80 rounded-lg shadow-lg overflow-hidden mb-6 border border-gray-800"
              >
                <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-medium">
                  {cart.length} {cart.length === 1 ? "Item" : "Items"} in Cart
                </div>

                <motion.ul className="divide-y divide-gray-800">
                  {groupedItems.map((item) => (
                    <motion.li
                      key={item.id}
                      variants={itemVariants}
                      className="flex justify-between items-center p-4 hover:bg-gray-900 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-700"
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-200">
                            {item.name}
                          </h3>
                          <p className="text-gray-400 font-medium">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center mr-4 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleDecreaseQuantity(item.id)}
                            className="p-2 text-gray-400 hover:bg-gray-800"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="px-3 font-medium text-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="p-2 text-gray-400 hover:bg-gray-800"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            // Remove all instances of this item
                            for (let i = 0; i < item.quantity; i++) {
                              removeFromCart(item.id);
                            }
                          }}
                          className="text-gray-500 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              <div className="bg-black bg-opacity-80 rounded-lg shadow-md p-6 mb-6 border border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-300">
                      Total
                    </span>
                    <span className="text-lg font-bold text-white">
                      ₹{totalPrice}
                    </span>
                  </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4">
                <button
                  onClick={clearCart}
                  className="px-6 py-3 rounded-lg border border-gray-600 text-gray-400 font-medium hover:bg-gray-900 transition-all duration-300"
                >
                  Clear Cart
                </button>

                {/* Changed: Invoice button replaced with Payment button */}
                <Link
                  to="/payment"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium hover:from-gray-700 hover:to-gray-600 transition-all duration-300 text-center flex items-center justify-center"
                >
                  <FiCreditCard className="mr-2" />
                  Proceed to Payment
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;