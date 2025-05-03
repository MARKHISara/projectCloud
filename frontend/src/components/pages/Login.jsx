import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const token = res.data.token;
      const nomComplet = res.data.user.name;
      const clientId = res.data.user._id;

      localStorage.setItem('token', token);
      localStorage.setItem('nomComplet', nomComplet);
      localStorage.setItem('clientId', clientId);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      // Redirection en fonction du rôle
      if (role === 'restaurateur' || role === 'Admin') {
        window.location.href = '/dashboard';  // Admin et Restaurateur vers Dashboard
      } else if (role === 'client') {
        window.location.href = '/';  // Client vers la page d'accueil
      } else {
        alert('Rôle inconnu');
      }
    } catch (err) {
      alert('Erreur de connexion : email ou mot de passe incorrect.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Se connecter</h2>
        <input
          className="w-full p-2 border border-gray-300 rounded mb-3"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full p-2 border border-gray-300 rounded mb-4"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Se connecter
        </button>

        <p className="text-sm mt-4">
          Pas encore inscrit ?{' '}
          <a href="/register" className="text-blue-500 underline">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
}
