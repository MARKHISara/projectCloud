import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
const Footer = () => {
  return /*#__PURE__*/React.createElement("footer", {
    className: "bg-gray-900 text-gray-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-4 gap-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center mb-4"
  }, /*#__PURE__*/React.createElement(ShoppingBag, {
    className: "h-8 w-8 text-orange-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ml-2 text-xl font-bold text-white"
  }, "FoodDelivery")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm mb-4"
  }, "Bringing the best local restaurants right to your doorstep. Fast, reliable, and delicious."), /*#__PURE__*/React.createElement("div", {
    className: "flex space-x-4"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "text-gray-400 hover:text-white transition-colors duration-200"
  }, /*#__PURE__*/React.createElement(Facebook, {
    className: "h-5 w-5"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "text-gray-400 hover:text-white transition-colors duration-200"
  }, /*#__PURE__*/React.createElement(Twitter, {
    className: "h-5 w-5"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "text-gray-400 hover:text-white transition-colors duration-200"
  }, /*#__PURE__*/React.createElement(Instagram, {
    className: "h-5 w-5"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-white font-semibold mb-4"
  }, "Quick Links"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Link, {
    to: "/",
    className: "text-gray-400 hover:text-white transition-colors duration-200"
  }, "Home")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Link, {
    to: "/cart",
    className: "text-gray-400 hover:text-white transition-colors duration-200"
  }, "Cart")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Link, {
    to: "/history",
    className: "text-gray-400 hover:text-white transition-colors duration-200"
  }, "Order History")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "text-gray-400 hover:text-white transition-colors duration-200"
  }, "About Us")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "text-gray-400 hover:text-white transition-colors duration-200"
  }, "Contact")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-white font-semibold mb-4"
  }, "Contact Us"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("li", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Phone, {
    className: "h-5 w-5 mr-2 text-orange-500"
  }), 
  /*#__PURE__*/React.createElement("span", null, "+1 (555) 123-4567")), /*#__PURE__*/React.createElement("li", {
    className: "flex items-center"
  }, 
  /*#__PURE__*/React.createElement(Mail, {
    className: "h-5 w-5 mr-2 text-orange-500"
  }), 
  /*#__PURE__*/React.createElement("span", null, "support@fooddelivery.com")), /*#__PURE__*/React.createElement("li", {
    className: "flex items-center"
  }, 
  /*#__PURE__*/React.createElement(MapPin, {
    className: "h-5 w-5 mr-2 text-orange-500"
  }),
   /*#__PURE__*/React.createElement("span", null, "123 Delivery Street, Food City, FC 12345")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-white font-semibold mb-4"
  }, "Newsletter"),
   /*#__PURE__*/React.createElement("p", {
    className: "text-sm mb-4"
  }, "Subscribe to our newsletter for exclusive deals and updates."), /*#__PURE__*/React.createElement("form", {
    className: "space-y-2"
  },
   /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "Enter your email",
    className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
  }),
   /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
  }, "Subscribe")))),
   /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-800 mt-8 pt-8 text-center text-sm"
  }, 
  /*#__PURE__*/React.createElement("p", null, "\xA9 ", new Date().getFullYear(), " FoodDelivery. All rights reserved."))));
};
export default Footer;