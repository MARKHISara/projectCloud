import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const ProtectedRoute = ({
  children
}) => {
  const {
    isAuthenticated,
    loading
  } = useAuth();
  const location = useLocation();
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-center min-h-screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"
    }));
  }
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return /*#__PURE__*/React.createElement(Navigate, {
      to: "/login",
      state: {
        from: location.pathname
      },
      replace: true
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, children);
};
export default ProtectedRoute;