import React, { useEffect, useState } from 'react';
import {
  FaChartBar, FaUsers, FaShoppingCart, FaCalendar,
  FaComments, FaWallet, FaChartPie,FaUtensils
} from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';

const Dashboard = () => {
  const [nomComplet, setNomComplet] = useState(null);

  useEffect(() => {
    const storedNom = localStorage.getItem('nomComplet');
    if (storedNom) {
      setNomComplet(storedNom);
    }
  }, []);

  const isConnected = !!nomComplet;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nomComplet');
    setNomComplet(null);
    window.location.href = '/login';
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-orange-600 mb-10">MonPetitPlat</h1>
          <nav className="space-y-4">
            {[
              { icon: <FaChartBar />, label: 'Dashboard' },
              { icon: <FaShoppingCart />, label: 'Order List', path: '/dashboard/commande' },
              { icon: <FaUsers />, label: 'Ajouter Restaurateur', path: '/dashboard/adduser' },
              { icon: <FaUtensils/>, label: 'Restaurant' , path: '/dashboard/addRestau'},
              { icon: <FaChartPie />, label: 'Menus', path: '/dashboard/addmenu' },
              { icon: <FaCalendar />, label: 'Calendrier',path: '/dashboard/MyCalendar' },
              { icon: <FaWallet />, label: 'Wallet' },
            ].map((item, idx) =>
              item.path ? (
                <Link
                  key={idx}
                  to={item.path}
                  className="flex items-center gap-3 cursor-pointer hover:text-blue-500"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ) : (
                <div
                  key={idx}
                  className="flex items-center gap-3 cursor-pointer hover:text-blue-500"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              )
            )}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={isConnected ? handleLogout : handleLoginRedirect}
            className="bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            {isConnected ? 'Déconnexion' : 'Connexion'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-gray-500">
              {isConnected
                ? `Hi, ${nomComplet}. Welcome back!`
                : 'Bienvenue sur votre dashboard'}
            </p>
          </div>
        </div>

        {/* Ceci permet d’afficher AddUser, DashboardRestaurateur, etc. */}
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
