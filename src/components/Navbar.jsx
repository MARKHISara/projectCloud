import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Home, History, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    isAuthenticated,
    logout
  } = useAuth();
  const {
    getItemCount
  } = useCart();
  const navigate = useNavigate();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMenu();
  };
  const cartItemCount = getItemCount();
  return /*#__PURE__*/React.createElement("nav", {
    className: "bg-white shadow-md sticky top-0 z-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between h-16"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/",
    className: "flex-shrink-0 flex items-center"
  }, /*#__PURE__*/React.createElement(ShoppingBag, {
    className: "h-8 w-8 text-orange-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ml-2 text-xl font-bold text-gray-800"
  }, "FoodDelivery"))), /*#__PURE__*/React.createElement("div", {
    className: "hidden md:flex items-center space-x-4"
  }, isAuthenticated ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Link, {
    to: "/",
    className: "text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
  }, "Restaurants"), /*#__PURE__*/React.createElement(Link, {
    to: "/history",
    className: "text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
  }, "Order History"), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogout,
    className: "text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
  }, "Logout"), /*#__PURE__*/React.createElement(Link, {
    to: "/cart",
    className: "relative text-gray-600 hover:text-orange-500 ml-4"
  }, /*#__PURE__*/React.createElement(ShoppingBag, {
    className: "h-6 w-6"
  }), cartItemCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
  }, cartItemCount))) : /*#__PURE__*/React.createElement(Link, {
    to: "/login",
    className: "bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors duration-200"
  }, "Login")), /*#__PURE__*/React.createElement("div", {
    className: "flex md:hidden items-center"
  }, isAuthenticated && /*#__PURE__*/React.createElement(Link, {
    to: "/cart",
    className: "relative text-gray-600 mr-2"
  }, /*#__PURE__*/React.createElement(ShoppingBag, {
    className: "h-6 w-6"
  }), cartItemCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
  }, cartItemCount)), /*#__PURE__*/React.createElement("button", {
    onClick: toggleMenu,
    className: "text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
  }, isMenuOpen ? /*#__PURE__*/React.createElement(X, {
    className: "h-6 w-6"
  }) : /*#__PURE__*/React.createElement(Menu, {
    className: "h-6 w-6"
  }))))), isMenuOpen && /*#__PURE__*/React.createElement("div", {
    className: "md:hidden bg-white shadow-lg rounded-b-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-2 pt-2 pb-3 space-y-1 sm:px-3"
  }, isAuthenticated ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Link, {
    to: "/",
    className: "flex items-center text-gray-600 hover:bg-gray-100 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium",
    onClick: closeMenu
  }, /*#__PURE__*/React.createElement(Home, {
    className: "mr-2 h-5 w-5"
  }), "Restaurants"), /*#__PURE__*/React.createElement(Link, {
    to: "/history",
    className: "flex items-center text-gray-600 hover:bg-gray-100 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium",
    onClick: closeMenu
  }, /*#__PURE__*/React.createElement(History, {
    className: "mr-2 h-5 w-5"
  }), "Order History"), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogout,
    className: "flex w-full items-center text-gray-600 hover:bg-gray-100 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium"
  }, /*#__PURE__*/React.createElement(LogOut, {
    className: "mr-2 h-5 w-5"
  }), "Logout")) : /*#__PURE__*/React.createElement(Link, {
    to: "/login",
    className: "flex items-center bg-orange-500 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600",
    onClick: closeMenu
  }, "Login"))));
};
export default Navbar;