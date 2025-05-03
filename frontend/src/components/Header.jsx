import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bell } from "lucide-react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsLoggedIn(!!token);
    if (token && user?.id) {
      fetchNotifications();
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5003/notifications/${user.id}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Erreur notifications:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-orange-600">MonPetitPlat</div>

        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-orange-500">Accueil</Link>
          <Link to="/restaurants" className="hover:text-orange-500">Restaurant</Link>
          <a href="#" className="hover:text-orange-500">About Us</a>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <div className="relative" ref={notificationRef}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
                <Bell className="text-orange-600 w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              <div
                className={`absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-200 transform origin-top-right ${
                  showNotifications ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                }`}
              >
                <div className="p-4 border-b font-semibold text-gray-700">Notifications</div>
                <ul className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif, index) => (
                      <li key={index} className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-800">
                        {notif.message}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-sm text-gray-500">Aucune notification</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Se déconnecter
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition inline-block"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
