import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardRestaurateur() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("restaurantId"); // Assurer que le restaurant_id est stocké

  const fetchCommandes = async () => {
    try {
      console.log("Token:", token); // Log pour vérifier le token
      console.log("Restaurant ID:", restaurantId); // Log pour vérifier l'ID du restaurant

      // Vérifier si le token et l'ID du restaurant existent
      if (!token || !restaurantId) {
        setError("Token ou ID du restaurant manquant !");
        setLoading(false);
        return;
      }

      // Récupérer les commandes par restaurantId
      const res = await axios.get(`http://localhost:8000/api/orders/restaurant/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Commandes récupérées:", res.data); // Log pour voir les données récupérées

      setCommandes(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur de récupération des commandes :", error.response || error);
      setError("Impossible de charger les commandes. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const updateStatut = async (id, nouveauStatut) => {
    try {
      await axios.put(`http://localhost:8000/api/orders/${id}/status`, {
        status: nouveauStatut
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCommandes();
    } catch (err) {
      console.error("Erreur lors du changement de statut :", err);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []); // On ne met à jour que lors du premier rendu

  if (loading) return <p>Chargement des commandes...</p>;
  if (error) return <p className="text-red-500">{error}</p>; // Affichage de l'erreur si elle existe

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Gestion des Commandes</h2>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-4">Client</th>
            <th className="p-4">Plats</th>
            <th className="p-4">Statut</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map((cmd) => (
            <tr key={cmd.id} className="border-t">
              <td className="p-4">{cmd.client.name}</td>
              <td className="p-4">
                {cmd.items.map((item) => item.dish.name).join(", ")}
              </td>
              <td className="p-4">{cmd.status}</td>
              <td className="p-4">
                <select
                  value={cmd.status}
                  onChange={(e) => updateStatut(cmd.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="en_attente">En attente</option>
                  <option value="en_preparation">En préparation</option>
                  <option value="livree">Livrée</option>
                  <option value="annulée">Annulée</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
