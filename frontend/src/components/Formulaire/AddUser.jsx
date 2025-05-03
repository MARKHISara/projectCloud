import React, { useState } from "react";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // Assurez-vous que l'admin est connecté

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
        const res = await fetch("http://localhost:5000/api/auth/create-restaurateur", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (!res.ok) throw new Error(data.message || "Erreur lors de la création.");
        setMessage(data.message);
        setFormData({ name: "", email: "", password: "" });
      } catch (e) {
        console.error("Réponse non JSON :", text);
        setError("Erreur serveur ou réponse inattendue.");
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-xl rounded-2xl transition-all duration-300">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
        Ajouter un restaurateur
      </h2>

      {message && (
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
          <p>{message}</p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Nom"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Adresse email"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Mot de passe"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AddUser;
