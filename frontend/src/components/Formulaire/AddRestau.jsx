import React, { useState } from 'react';
import axios from 'axios';
import { FaUtensils } from 'react-icons/fa';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const AddRestau = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const token = localStorage.getItem('token');

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await axios.post('http://localhost:8000/api/restaurants', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Restaurant ajouté avec succès !');
      setFormData({ name: '', description: '', image: null });
    } catch (err) {
      setError("Erreur lors de l’ajout du restaurant.");
      console.error("Error adding restaurant:", err.response?.data || err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-xl rounded-2xl transition-all duration-300">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
        <FaUtensils className="text-orange-500" /> Ajouter un restaurant
      </h2>

      {success && (
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
          <CheckCircleIcon className="h-5 w-5" />
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
          <ExclamationCircleIcon className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Ex: Le Jardin Gourmand"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none resize-none"
            placeholder="Une brève description du restaurant"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full file:bg-orange-500 file:text-white file:px-4 file:py-2 file:rounded file:cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
        >
          Ajouter le restaurant
        </button>
      </form>
    </div>
  );
};

export default AddRestau;
