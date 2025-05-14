import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
const HistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        // In a real app, fetch from API
        // Using mock data for demonstration

        // Mock order history
        const mockOrders = [{
          id: 'order-1',
          restaurantId: '1',
          restaurantName: 'Burger Delight',
          date: '2025-05-10T14:30:00',
          status: 'completed',
          items: [{
            id: 'item-1-1',
            name: 'Classic Cheeseburger',
            price: 12.99,
            quantity: 2
          }, {
            id: 'item-1-2',
            name: 'French Fries',
            price: 4.99,
            quantity: 1
          }, {
            id: 'item-1-3',
            name: 'Soft Drink',
            price: 2.99,
            quantity: 2
          }],
          total: 36.95
        }, {
          id: 'order-2',
          restaurantId: '3',
          restaurantName: 'Sushi Express',
          date: '2025-05-08T19:15:00',
          status: 'completed',
          items: [{
            id: 'item-2-1',
            name: 'Salmon Sushi Set',
            price: 18.99,
            quantity: 1
          }, {
            id: 'item-2-2',
            name: 'Miso Soup',
            price: 3.99,
            quantity: 1
          }],
          total: 22.98
        }, {
          id: 'order-3',
          restaurantId: '2',
          restaurantName: 'Pizza Paradise',
          date: '2025-05-05T20:45:00',
          status: 'cancelled',
          items: [{
            id: 'item-3-1',
            name: 'Margherita Pizza',
            price: 13.99,
            quantity: 1
          }, {
            id: 'item-3-2',
            name: 'Garlic Bread',
            price: 5.99,
            quantity: 1
          }],
          total: 19.98
        }, {
          id: 'order-4',
          restaurantId: '4',
          restaurantName: 'Taco Fiesta',
          date: '2025-04-30T13:20:00',
          status: 'completed',
          items: [{
            id: 'item-4-1',
            name: 'Beef Tacos',
            price: 11.99,
            quantity: 1
          }, {
            id: 'item-4-2',
            name: 'Nachos',
            price: 8.99,
            quantity: 1
          }, {
            id: 'item-4-3',
            name: 'Guacamole',
            price: 3.99,
            quantity: 1
          }],
          total: 24.97
        }, {
          id: 'order-5',
          restaurantId: '1',
          restaurantName: 'Burger Delight',
          date: '2025-04-25T18:10:00',
          status: 'completed',
          items: [{
            id: 'item-5-1',
            name: 'BBQ Bacon Burger',
            price: 14.99,
            quantity: 1
          }, {
            id: 'item-5-2',
            name: 'Onion Rings',
            price: 5.99,
            quantity: 1
          }],
          total: 20.98
        }];

        // Sort orders by date (newest first)
        mockOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(mockOrders);
      } catch (err) {
        console.error('Failed to fetch order history:', err);
        setError('Failed to load order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);
  const toggleOrderDetails = orderId => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  const getStatusBadge = status => {
    switch (status) {
      case 'completed':
        return /*#__PURE__*/React.createElement("span", {
          className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        }, /*#__PURE__*/React.createElement(CheckCircle, {
          className: "h-3 w-3 mr-1"
        }), "Completed");
      case 'in-progress':
        return /*#__PURE__*/React.createElement("span", {
          className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        }, /*#__PURE__*/React.createElement(Clock, {
          className: "h-3 w-3 mr-1"
        }), "In Progress");
      case 'cancelled':
        return /*#__PURE__*/React.createElement("span", {
          className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
        }, /*#__PURE__*/React.createElement(XCircle, {
          className: "h-3 w-3 mr-1"
        }), "Cancelled");
      default:
        return null;
    }
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-gray-50"
    }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-center items-center py-20"
    }, /*#__PURE__*/React.createElement("div", {
      className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gray-50"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("main", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold text-gray-900"
  }, "Order History"), /*#__PURE__*/React.createElement("p", {
    className: "mt-2 text-gray-600"
  }, "View your past orders and their details")), error ? /*#__PURE__*/React.createElement("div", {
    className: "py-12 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-red-500"
  }, error), /*#__PURE__*/React.createElement("button", {
    className: "mt-4 px-4 py-2 bg-orange-500 text-white rounded-md",
    onClick: () => window.location.reload()
  }, "Retry")) : orders.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-md p-8 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "h-8 w-8 text-gray-400",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-semibold text-gray-800 mb-2"
  }, "No orders yet"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 mb-6"
  }, "You haven't placed any orders yet."), /*#__PURE__*/React.createElement(Link, {
    to: "/",
    className: "bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 transition-colors duration-200"
  }, "Browse Restaurants")) : /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-md overflow-hidden"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "divide-y divide-gray-200"
  }, orders.map(order => /*#__PURE__*/React.createElement("li", {
    key: order.id,
    className: "hover:bg-gray-50 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-5 sm:px-6 cursor-pointer",
    onClick: () => toggleOrderDetails(order.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row justify-between items-start sm:items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center mb-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-gray-900 mr-3"
  }, order.restaurantName), getStatusBadge(order.status)), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500"
  }, "Ordered on ", formatDate(order.date))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center mt-2 sm:mt-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-gray-900 mr-3"
  }, "$", order.total.toFixed(2)), expandedOrderId === order.id ? /*#__PURE__*/React.createElement(ChevronUp, {
    className: "h-5 w-5 text-gray-400"
  }) : /*#__PURE__*/React.createElement(ChevronDown, {
    className: "h-5 w-5 text-gray-400"
  })))), expandedOrderId === order.id && /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm font-medium text-gray-700 mb-3"
  }, "Order Items"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2 mb-4"
  }, order.items.map(item => /*#__PURE__*/React.createElement("li", {
    key: item.id,
    className: "flex justify-between text-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, item.quantity, "x"), " ", item.name), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-600"
  }, "$", (item.price * item.quantity).toFixed(2))))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-200 pt-3 mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "Subtotal"), /*#__PURE__*/React.createElement("span", null, "$", (order.total - 2.99).toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm mt-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "Delivery Fee"), /*#__PURE__*/React.createElement("span", null, "$2.99")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between font-semibold mt-3"
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", null, "$", order.total.toFixed(2)))), order.status !== 'cancelled' && /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement(Link, {
    to: `/restaurant/${order.restaurantId}`,
    className: "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 transition-colors duration-200"
  }, "Order Again")))))))));
};
export default HistoryPage;