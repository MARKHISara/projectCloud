import React, { useState, useEffect } from "react";
import axios from "axios";

const AddMenu = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    restaurant_id: "",
    image: null, // Champ pour l'image
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [restaurants, setRestaurants] = useState([]); // Pour stocker la liste des restaurants

  const token = localStorage.getItem("token"); // Assurez-vous que l'utilisateur est connecté

  // Récupérer les restaurants depuis l'API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/restaurants", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setRestaurants(response.data); // Mettre à jour l'état avec les restaurants
      } catch (err) {
        console.error("Erreur lors de la récupération des restaurants", err);
        setError("Impossible de récupérer la liste des restaurants.");
      }
    };

    fetchRestaurants();
  }, [token]); // Cette requête sera exécutée à chaque fois que le token change

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] }); // Mettre à jour l'image dans l'état
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const formDataToSend = new FormData(); // Utilisation de FormData pour gérer l'upload du fichier
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("restaurant_id", formData.restaurant_id);
    if (formData.image) {
      formDataToSend.append("image", formData.image); // Ajouter l'image si elle est présente
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/dishes", // L'URL de votre API
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Indiquer que c'est un formulaire avec des fichiers
          },
        }
      );

      setMessage("Plat ajouté avec succès !");
      setFormData({ name: "", description: "", price: "", restaurant_id: "", image: null });
    } catch (err) {
      console.error("Erreur lors de l'ajout du plat", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-xl rounded-2xl transition-all duration-300">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
        Ajouter un plat au menu
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
            placeholder="Ex : Poulet rôti"
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
            placeholder="Une brève description du plat"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Prix</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Ex : 12.50"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Sélectionner un restaurant</label>
          <select
            name="restaurant_id"
            value={formData.restaurant_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            required
          >
            <option value="">Choisissez un restaurant</option>
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))
            ) : (
              <option disabled>Pas de restaurants disponibles</option>
            )}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Sélectionner une image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
        >
          Ajouter le plat
        </button>
      </form>
    </div>
  );
};

export default AddMenu;
