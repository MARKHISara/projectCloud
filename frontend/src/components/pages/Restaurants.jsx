import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header';
import { Link } from 'react-router-dom';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8000/api/restaurants', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setRestaurants(res.data))
    .catch(err => console.error(err));
  }, []);

  const handleOrder = async (restaurantId) => {
    const clientId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const items = [
      { menuId: "661fd25d2f1234567890abcd", quantity: 1 }
    ];
    const total = 100;

    try {
      await axios.post('http://localhost:5001/api/orders/create', {
        clientId,
        items,
        total
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Commande effectuée avec succès !');
    } catch (err) {
      console.error("❌ Erreur lors de la commande :", err);
    }
  };

  return (
    <div className="w-full bg-white">
      <Header />
      <div className="pt-24 p-6 min-h-screen">
        {/* Titre */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Menu That Always Make You</h1>
          <h2 className="text-xl text-gray-600">Fall In Love</h2>
        </div>

        {/* Catégories horizontales */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-2">
          {['Roman', 'Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks'].map((cat) => (
            <button 
              key={cat} 
              className="px-4 py-2 bg-white border border-gray-200 rounded-full whitespace-nowrap hover:bg-yellow-50"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Nouvelle version des cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(r => (
            <div key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              {/* Image du restaurant */}
              <div className="relative h-48 w-full">
                {r.image && (
                  <img
                    src={`http://localhost:8000/storage/${r.image}`}
                    alt={r.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-2">
                  <h3 className="text-white text-lg font-semibold">{r.name}</h3>
                  <div className="flex items-center text-yellow-400 text-sm font-medium">
                    ⭐ 4.5 <span className="text-gray-300 ml-2">(105)</span>
                  </div>
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className="p-4 flex flex-col justify-between h-44">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {r.description}
                </p>

                <Link
                  to={`/menu/${r.id}`}
                  className="block text-center bg-orange-500 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                  Voir menu
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
