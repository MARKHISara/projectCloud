import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomComplet, setNomComplet] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: nomComplet,
        email,
        password,
        role
      });

      setSuccess(true);
      setError('');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setError('Erreur lors de l’inscription');
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Créer un compte</h2>
        <input
          className="w-full p-2 border border-gray-300 rounded mb-3"
          type="text"
          value={nomComplet}
          onChange={e => setNomComplet(e.target.value)}
          placeholder="Nom Complet"
        />
        <input
          className="w-full p-2 border border-gray-300 rounded mb-3"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full p-2 border border-gray-300 rounded mb-3"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
        <select
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="client">Client</option>
          <option value="restaurateur">Restaurateur</option>
          <option value="Admin">Admin</option>
        </select>

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          S'inscrire
        </button>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm mt-3">
            Inscription réussie ! Redirection...
          </p>
        )}
      </div>
    </div>
  );
}
