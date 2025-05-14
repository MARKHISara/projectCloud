import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantService } from '../services/api';
import Navbar from '../components/Navbar';
import { Star, Clock, MapPin } from 'lucide-react';

const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await restaurantService.getRestaurants();
        setRestaurants(response.data);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
        setError('Failed to load restaurants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = activeFilter === 'all' 
    ? restaurants 
    : restaurants.filter(r => r.cuisine.toLowerCase() === activeFilter.toLowerCase());
  
  const cuisines = ['All', ...new Set(restaurants.map(r => r.cuisine))];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurants Near You</h1>
          <p className="mt-2 text-gray-600">Discover the best food for delivery</p>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {cuisines.map(cuisine => (
              <button
                key={cuisine}
                className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm whitespace-nowrap ${
                  (cuisine === 'All' ? activeFilter === 'all' : activeFilter === cuisine.toLowerCase())
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-colors duration-200`}
                onClick={() => setActiveFilter(cuisine === 'All' ? 'all' : cuisine.toLowerCase())}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-500">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center bg-green-50 px-2 py-1 rounded-md">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700">
                        {restaurant.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{restaurant.cuisine}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{restaurant.distance}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantPage;