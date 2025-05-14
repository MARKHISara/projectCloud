import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import { Star, Clock, MapPin, Plus, ShoppingBag } from 'lucide-react';
const OrderPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    addItem,
    items: cartItems,
    restaurantId
  } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCartNotification, setShowCartNotification] = useState(false);
  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // In a real app, fetch from API
        // Using mock data for demonstration

        // Mock restaurant details
        const mockRestaurant = {
          id,
          name: id === '1' ? 'Burger Delight' : id === '2' ? 'Pizza Paradise' : id === '3' ? 'Sushi Express' : id === '4' ? 'Taco Fiesta' : id === '5' ? 'Thai Spice' : 'Pasta House',
          image: id === '1' ? 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' : id === '2' ? 'https://images.pexels.com/photos/2762942/pexels-photo-2762942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' : id === '3' ? 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' : id === '4' ? 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' : id === '5' ? 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' : 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          cuisine: id === '1' ? 'American' : id === '2' || id === '6' ? 'Italian' : id === '3' ? 'Japanese' : id === '4' ? 'Mexican' : 'Thai',
          rating: 4.5 + Number(id) * 0.1 % 0.5,
          deliveryTime: '20-35 min',
          distance: '2.3 km',
          categories: ['Popular', 'Starters', 'Main Course', 'Desserts', 'Drinks']
        };

        // Generate mock menu items based on restaurant ID
        const mockMenu = [];

        // Add popular items
        mockMenu.push({
          id: `${id}-popular-1`,
          name: 'Chef\'s Special',
          description: 'Our most popular dish, prepared with premium ingredients',
          price: 15.99,
          image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Popular'
        });

        // Add starters
        mockMenu.push({
          id: `${id}-starter-1`,
          name: 'Garlic Bread',
          description: 'Freshly baked bread with garlic butter and herbs',
          price: 5.99,
          image: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Starters'
        });
        mockMenu.push({
          id: `${id}-starter-2`,
          name: 'Mozzarella Sticks',
          description: 'Golden fried mozzarella sticks served with marinara sauce',
          price: 7.99,
          image: 'https://images.pexels.com/photos/9609861/pexels-photo-9609861.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Starters'
        });

        // Add main courses - specific to restaurant type
        if (id === '1') {
          // Burger place
          mockMenu.push({
            id: `${id}-main-1`,
            name: 'Classic Cheeseburger',
            description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
            price: 12.99,
            image: 'https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Main Course'
          });
          mockMenu.push({
            id: `${id}-main-2`,
            name: 'BBQ Bacon Burger',
            description: 'Beef patty with bacon, cheddar, BBQ sauce, and onion rings',
            price: 14.99,
            image: 'https://images.pexels.com/photos/3219547/pexels-photo-3219547.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Main Course'
          });
        } else if (id === '2' || id === '6') {
          // Pizza or Pasta
          mockMenu.push({
            id: `${id}-main-1`,
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
            price: 13.99,
            image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Main Course'
          });
          mockMenu.push({
            id: `${id}-main-2`,
            name: 'Spaghetti Bolognese',
            description: 'Al dente spaghetti with rich meat sauce and parmesan',
            price: 12.99,
            image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Main Course'
          });
        } else if (id === '3') {
          // Sushi
          mockMenu.push({
            id: `${id}-main-1`,
            name: 'Salmon Sushi Set',
            description: 'Assortment of fresh salmon nigiri and maki rolls',
            price: 18.99,
            image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Main Course'
          });
          mockMenu.push({
            id: `${id}-main-2`,
            name: 'Dragon Roll',
            description: 'Shrimp tempura roll topped with avocado and eel sauce',
            price: 16.99,
            image: 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Main Course'
          });
        } else if (id === '4') {
          // Mexican
          mockMenu.push({
            id: `${id}-main-1`,
            name: 'Beef Tacos',
            description: 'Three corn tortillas with seasoned beef, pico de gallo, and lime',
            price: 11.99,
            image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Main Course'
          });
          mockMenu.push({
            id: `${id}-main-2`,
            name: 'Chicken Quesadilla',
            description: 'Grilled flour tortilla filled with chicken, cheese, and peppers',
            price: 13.99,
            image: 'https://images.pexels.com/photos/6605206/pexels-photo-6605206.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Main Course'
          });
        } else {
          // Thai
          mockMenu.push({
            id: `${id}-main-1`,
            name: 'Pad Thai',
            description: 'Stir-fried rice noodles with eggs, tofu, bean sprouts, and peanuts',
            price: 14.99,
            image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Main Course'
          });
          mockMenu.push({
            id: `${id}-main-2`,
            name: 'Green Curry',
            description: 'Spicy curry with coconut milk, bamboo shoots, and Thai basil',
            price: 15.99,
            image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Main Course'
          });
        }

        // Add desserts
        mockMenu.push({
          id: `${id}-dessert-1`,
          name: 'Chocolate Cake',
          description: 'Rich chocolate cake with a molten center',
          price: 7.99,
          image: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Desserts'
        });

        // Add drinks
        mockMenu.push({
          id: `${id}-drink-1`,
          name: 'Soft Drink',
          description: 'Choice of cola, lemon-lime, or orange soda',
          price: 2.99,
          image: 'https://images.pexels.com/photos/1292862/pexels-photo-1292862.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Drinks'
        });
        mockMenu.push({
          id: `${id}-drink-2`,
          name: 'Fresh Lemonade',
          description: 'Freshly squeezed lemonade with mint',
          price: 4.99,
          image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Drinks'
        });
        setRestaurant(mockRestaurant);
        setMenu(mockMenu);
      } catch (err) {
        console.error('Failed to fetch restaurant details:', err);
        setError('Failed to load restaurant details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantAndMenu();
  }, [id]);
  const handleAddToCart = item => {
    if (!id) return;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      restaurantId: id
    }, id);

    // Show notification
    setShowCartNotification(true);
    setTimeout(() => {
      setShowCartNotification(false);
    }, 1500);
  };
  const filteredMenu = activeCategory === 'all' ? menu : menu.filter(item => item.category === activeCategory);
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-gray-50"
    }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-center items-center py-20"
    }, /*#__PURE__*/React.createElement("div", {
      className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"
    })));
  }
  if (error || !restaurant) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-gray-50"
    }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
      className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-red-500"
    }, error || 'Restaurant not found'), /*#__PURE__*/React.createElement("button", {
      className: "mt-4 px-4 py-2 bg-orange-500 text-white rounded-md",
      onClick: () => navigate('/')
    }, "Back to restaurants")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gray-50"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
    className: "relative h-64 sm:h-80"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0"
  }, /*#__PURE__*/React.createElement("img", {
    src: restaurant.image,
    alt: restaurant.name,
    className: "w-full h-full object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-black bg-opacity-40"
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-0 left-0 right-0 p-6 text-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold"
  }, restaurant.name), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center mt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, restaurant.cuisine), /*#__PURE__*/React.createElement("span", {
    className: "mx-2"
  }, "\u2022"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Star, {
    className: "h-4 w-4 text-yellow-400 mr-1"
  }), /*#__PURE__*/React.createElement("span", null, restaurant.rating)), /*#__PURE__*/React.createElement("span", {
    className: "mx-2"
  }, "\u2022"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Clock, {
    className: "h-4 w-4 mr-1"
  }), /*#__PURE__*/React.createElement("span", null, restaurant.deliveryTime)), /*#__PURE__*/React.createElement("span", {
    className: "mx-2"
  }, "\u2022"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(MapPin, {
    className: "h-4 w-4 mr-1"
  }), /*#__PURE__*/React.createElement("span", null, restaurant.distance)))))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8 overflow-x-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex space-x-2 pb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: `px-4 py-2 rounded-full text-sm font-medium shadow-sm whitespace-nowrap ${activeCategory === 'all' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors duration-200`,
    onClick: () => setActiveCategory('all')
  }, "All"), restaurant.categories.map(category => /*#__PURE__*/React.createElement("button", {
    key: category,
    className: `px-4 py-2 rounded-full text-sm font-medium shadow-sm whitespace-nowrap ${activeCategory === category ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors duration-200`,
    onClick: () => setActiveCategory(category)
  }, category)))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-6"
  }, filteredMenu.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    className: "bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm:w-1/3 h-32 sm:h-auto"
  }, /*#__PURE__*/React.createElement("img", {
    src: item.image,
    alt: item.name,
    className: "w-full h-full object-cover"
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-4 flex-1 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-gray-900"
  }, item.name), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 mt-1"
  }, item.description)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mt-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-orange-500 font-semibold"
  }, "$", item.price.toFixed(2)), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleAddToCart(item),
    className: "bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "h-5 w-5"
  }))))))), cartItems.length > 0 && restaurantId === id && /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-6 left-0 right-0 px-4 sm:px-6 flex justify-center z-40"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/cart'),
    className: "bg-orange-500 text-white py-3 px-6 rounded-full shadow-lg flex items-center space-x-2 hover:bg-orange-600 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement(ShoppingBag, {
    className: "h-5 w-5"
  }), /*#__PURE__*/React.createElement("span", null, "View Cart (", cartItems.length, " items)"))), showCartNotification && /*#__PURE__*/React.createElement("div", {
    className: "fixed top-20 right-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-md transition-opacity duration-300 z-50 animate-fade-in"
  }, "Item added to cart!")));
};
export default OrderPage;