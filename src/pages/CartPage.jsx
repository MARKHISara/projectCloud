import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/api';
import Navbar from '../components/Navbar';
import { Plus, Minus, Trash, ArrowLeft, ShoppingBag } from 'lucide-react';
const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    restaurantId
  } = useCart();
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };
  const handlePlaceOrder = async () => {
    if (!restaurantId || items.length === 0) return;
    setIsOrdering(true);
    setError('');
    try {
      await orderService.placeOrder(restaurantId, items);
      setOrderSuccess(true);
      setTimeout(() => {
        clearCart();
        navigate('/history');
      }, 3000);
    } catch (err) {
      console.error('Failed to place order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };
  const handleBackToMenu = () => {
    if (restaurantId) {
      navigate(`/restaurant/${restaurantId}`);
    } else {
      navigate('/');
    }
  };

  // Calculate totals
  const subtotal = getTotalPrice();
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gray-50"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("main", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleBackToMenu,
    className: "flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    className: "h-5 w-5 mr-2"
  }), "Back to menu"), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold text-gray-900 mt-4"
  }, "Your Cart")), orderSuccess ? /*#__PURE__*/React.createElement("div", {
    className: "bg-green-50 border border-green-200 rounded-lg p-6 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-8 h-8 text-green-500",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M5 13l4 4L19 7"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-semibold text-gray-800 mb-2"
  }, "Order Placed Successfully!"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 mb-4"
  }, "Your order has been placed and is being processed."), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600"
  }, "You will be redirected to your order history in a moment...")) : items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-md p-6 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
  }, /*#__PURE__*/React.createElement(ShoppingBag, {
    className: "h-8 w-8 text-gray-400"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-semibold text-gray-800 mb-2"
  }, "Your cart is empty"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 mb-6"
  }, "Looks like you haven't added any items to your cart yet."), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/'),
    className: "bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 transition-colors duration-200"
  }, "Browse Restaurants")) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-md overflow-hidden"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "divide-y divide-gray-200"
  }, items.map(item => /*#__PURE__*/React.createElement("li", {
    key: item.id,
    className: "p-4 sm:p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4 sm:mb-0"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-gray-900"
  }, item.name), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500"
  }, "$", item.price.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center border border-gray-300 rounded-md overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleUpdateQuantity(item.id, item.quantity - 1),
    className: "px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement(Minus, {
    className: "h-4 w-4"
  })), /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 border-l border-r border-gray-300"
  }, item.quantity), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleUpdateQuantity(item.id, item.quantity + 1),
    className: "px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "h-4 w-4"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeItem(item.id),
    className: "ml-4 text-red-500 hover:text-red-600 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement(Trash, {
    className: "h-5 w-5"
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-md p-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-semibold text-gray-900 mb-4"
  }, "Order Summary"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-gray-600"
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", null, "$", subtotal.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-gray-600"
  }, /*#__PURE__*/React.createElement("span", null, "Delivery Fee"), /*#__PURE__*/React.createElement("span", null, "$", deliveryFee.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-gray-600"
  }, /*#__PURE__*/React.createElement("span", null, "Tax"), /*#__PURE__*/React.createElement("span", null, "$", tax.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900"
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", null, "$", total.toFixed(2)))), error && /*#__PURE__*/React.createElement("div", {
    className: "mb-4 bg-red-50 text-red-500 p-3 rounded-md text-sm"
  }, error), /*#__PURE__*/React.createElement("button", {
    onClick: handlePlaceOrder,
    disabled: isOrdering,
    className: `w-full py-3 px-4 bg-orange-500 text-white rounded-md shadow-sm font-medium hover:bg-orange-600 transition-colors duration-200 ${isOrdering ? 'opacity-70 cursor-not-allowed' : ''}`
  }, isOrdering ? /*#__PURE__*/React.createElement("span", {
    className: "flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("circle", {
    className: "opacity-25",
    cx: "12",
    cy: "12",
    r: "10",
    stroke: "currentColor",
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("path", {
    className: "opacity-75",
    fill: "currentColor",
    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  })), "Processing...") : 'Place Order'))))));
};
export default CartPage;