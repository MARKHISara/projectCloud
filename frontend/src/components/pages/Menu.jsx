import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header';
import axios from 'axios';

export default function Menu() {
  const { id } = useParams();
  const [plats, setPlats] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get(`http://localhost:8000/api/restaurants/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPlats(res.data.dishes))
    .catch(err => console.error(err));
  }, [id]);

  const toggleSelection = (dishId) => {
    setSelectedItems(prev =>
      prev.includes(dishId)
        ? prev.filter(i => i !== dishId)
        : [...prev, dishId]
    );
  };

  const handleOrder = async () => {
    if (!user || !user.id) {
      alert("Utilisateur non identifié !");
      return;
    }

    const clientId = user.id;
    const items = selectedItems.map(dishId => ({
      dish_id: dishId,
      quantity: 1,
    }));

    const total = plats
      .filter(p => selectedItems.includes(p.id))
      .reduce((acc, curr) => acc + Number(curr.price), 0);

    try {
      await axios.post('http://localhost:8000/api/orders', {
        client_id: String(user.id), 
        restaurant_id: id,
        items,
        total
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await axios.post('http://localhost:5003/notify', {
        user_id: clientId,
        message: 'Votre commande a bien été envoyée !'
      });

      alert("Commande envoyée !");
      setSelectedItems([]);
    } catch (err) {
      console.error("Erreur commande :", err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="w-full bg-white">
      <Header />
      <div className="pt-24 p-6 min-h-screen">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Find the menu you want</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {plats.map(p => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-4 shadow-md hover:shadow-xl border transition duration-300 ${
                selectedItems.includes(p.id) ? 'border-orange-500' : 'border-gray-100'
              }`}
            >
              {p.image && (
                <img
                  src={`http://localhost:8000/storage/${p.image}`}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
              )}
              <h3 className="text-lg font-bold text-gray-800">{p.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-orange-500 font-semibold text-md">
                    {Number(p.price).toFixed(2)} MAD
                  </p>
                  {p.original_price && Number(p.original_price) > Number(p.price) && (
                    <p className="text-sm text-gray-400 line-through">
                      {Number(p.original_price).toFixed(2)} MAD
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleSelection(p.id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg"
                >
                  {selectedItems.includes(p.id) ? "Annuler" : "Order"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedItems.length > 0 && (
          <div className="mt-10 text-center">
            <button
              onClick={handleOrder}
              className="px-8 py-3 rounded-xl bg-orange-500 text-white text-lg font-semibold hover:bg-orange-600 shadow-md"
            >
              Commander {selectedItems.length} plat(s)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
