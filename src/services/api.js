import axios from 'axios';

// Base API URL - replace with your actual Laravel API endpoint
const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token to protected requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authService = {
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (email, password, role) => {
    try {
      const response = await api.post('/login', {
        email,
        password,
        role
      });
      
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Restaurant API calls
export const restaurantService = {
  getRestaurants: async () => {
    // Mock restaurant data
    const mockRestaurants = [
      {
        id: '1',
        name: 'Burger Delight',
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cuisine: 'American',
        rating: 4.7,
        deliveryTime: '20-30 min',
        distance: '1.2 km',
        priceRange: '$$',
        isOpen: true,
        featured: true
      },
      {
        id: '2',
        name: 'Pizza Paradise',
        image: 'https://images.pexels.com/photos/2762942/pexels-photo-2762942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cuisine: 'Italian',
        rating: 4.5,
        deliveryTime: '25-35 min',
        distance: '2.0 km',
        priceRange: '$$',
        isOpen: true,
        featured: false
      },
      {
        id: '3',
        name: 'Sushi Express',
        image: 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cuisine: 'Japanese',
        rating: 4.8,
        deliveryTime: '30-40 min',
        distance: '3.5 km',
        priceRange: '$$$',
        isOpen: true,
        featured: true
      },
      {
        id: '4',
        name: 'Taco Fiesta',
        image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cuisine: 'Mexican',
        rating: 4.3,
        deliveryTime: '15-25 min',
        distance: '1.8 km',
        priceRange: '$',
        isOpen: true,
        featured: false
      },
      {
        id: '5',
        name: 'Thai Spice',
        image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cuisine: 'Thai',
        rating: 4.6,
        deliveryTime: '25-40 min',
        distance: '2.7 km',
        priceRange: '$$',
        isOpen: true,
        featured: false
      },
      {
        id: '6',
        name: 'Pasta House',
        image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cuisine: 'Italian',
        rating: 4.2,
        deliveryTime: '30-45 min',
        distance: '4.0 km',
        priceRange: '$$',
        isOpen: false,
        featured: false
      },
      {
        id: '7',
        name: 'Marrakesh Delights',
        image: 'https://images.pexels.com/photos/7474372/pexels-photo-7474372.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cuisine: 'Moroccan',
        rating: 4.9,
        deliveryTime: '25-40 min',
        distance: '2.5 km',
        priceRange: '$$',
        isOpen: true,
        featured: true
      },
      {
        id: '8',
        name: 'Casablanca Kitchen',
        image: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cuisine: 'Moroccan',
        rating: 4.7,
        deliveryTime: '30-45 min',
        distance: '3.2 km',
        priceRange: '$$$',
        isOpen: true,
        featured: false
      }
    ];

    return { data: mockRestaurants };
  },
  getRestaurantById: async (id) => {
    const { data: restaurants } = await restaurantService.getRestaurants();
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    return { data: restaurant };
  },
  getMenuForRestaurant: async (id) => {
    // Mock menu data with Moroccan dishes for Moroccan restaurants
    const mockMenus = {
      '7': [
        {
          id: 'md-1',
          name: 'Couscous Royal',
          description: 'Traditional couscous with lamb, chicken, merguez, and seasonal vegetables',
          price: 24.99,
          image: 'https://images.pexels.com/photos/7474372/pexels-photo-7474372.jpeg',
          category: 'Main Course',
          spicyLevel: 'Medium',
          popular: true,
          dietary: ['Halal']
        },
        {
          id: 'md-2',
          name: 'Tajine of Lamb',
          description: 'Slow-cooked lamb with prunes, almonds, and aromatic spices',
          price: 22.99,
          image: 'https://images.pexels.com/photos/7474375/pexels-photo-7474375.jpeg',
          category: 'Main Course',
          spicyLevel: 'Mild',
          popular: true,
          dietary: ['Halal', 'Gluten-free']
        },
        {
          id: 'md-3',
          name: 'Pastilla',
          description: 'Sweet and savory pie with chicken, almonds, and cinnamon',
          price: 18.99,
          image: 'https://images.pexels.com/photos/7474380/pexels-photo-7474380.jpeg',
          category: 'Starters',
          popular: true,
          dietary: ['Halal']
        },
        {
          id: 'md-4',
          name: 'Moroccan Mint Tea',
          description: 'Traditional green tea with fresh mint and sugar',
          price: 4.99,
          image: 'https://images.pexels.com/photos/1493080/pexels-photo-1493080.jpeg',
          category: 'Drinks',
          dietary: ['Vegan', 'Gluten-free']
        },
        {
          id: 'md-5',
          name: 'Zaalouk',
          description: 'Smoky eggplant dip with tomatoes, garlic, and Moroccan spices',
          price: 8.99,
          image: 'https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg',
          category: 'Starters',
          spicyLevel: 'Mild',
          dietary: ['Vegan', 'Gluten-free']
        },
        {
          id: 'md-6',
          name: 'Moroccan Orange Cake',
          description: 'Moist orange and almond cake with orange blossom water',
          price: 7.99,
          image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
          category: 'Desserts',
          dietary: ['Vegetarian']
        }
      ],
      '8': [
        {
          id: 'ck-1',
          name: 'Moroccan Seafood Tajine',
          description: 'Fresh seafood cooked with chermoula and vegetables',
          price: 26.99,
          image: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg',
          category: 'Main Course',
          spicyLevel: 'Medium',
          popular: true,
          dietary: ['Halal']
        },
        {
          id: 'ck-2',
          name: 'Harira Soup',
          description: 'Traditional Moroccan soup with lentils, chickpeas, and tomatoes',
          price: 8.99,
          image: 'https://images.pexels.com/photos/2641887/pexels-photo-2641887.jpeg',
          category: 'Starters',
          spicyLevel: 'Mild',
          popular: true,
          dietary: ['Vegetarian']
        },
        {
          id: 'ck-3',
          name: 'Chicken Rfissa',
          description: 'Shredded chicken with lentils, fenugreek, and msemen bread',
          price: 21.99,
          image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
          category: 'Main Course',
          spicyLevel: 'Medium',
          dietary: ['Halal']
        },
        {
          id: 'ck-4',
          name: 'Moroccan Briouats',
          description: 'Crispy phyllo pastries filled with meat or cheese',
          price: 9.99,
          image: 'https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg',
          category: 'Starters',
          dietary: ['Halal']
        },
        {
          id: 'ck-5',
          name: 'Vegetable Tajine',
          description: 'Seasonal vegetables slow-cooked with Moroccan spices',
          price: 18.99,
          image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
          category: 'Main Course',
          dietary: ['Vegan', 'Gluten-free']
        },
        {
          id: 'ck-6',
          name: 'Chebakia',
          description: 'Honey-coated sesame cookies, traditional Moroccan sweet',
          price: 6.99,
          image: 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg',
          category: 'Desserts',
          dietary: ['Vegetarian']
        }
      ]
    };

    // Return mock menu for Moroccan restaurants or default menu for others
    const menu = mockMenus[id] || [];
    return { data: menu };
  }
};

// Order API calls
export const orderService = {
  placeOrder: async (restaurantId, items) => {
    // Mock successful order placement
    const orderId = Math.random().toString(36).substr(2, 9);
    const orderDate = new Date().toISOString();
    
    return {
      data: {
        success: true,
        order: {
          id: orderId,
          restaurantId,
          items,
          status: 'confirmed',
          date: orderDate,
          estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString() // 45 minutes from now
        }
      }
    };
  },
  
  getOrderHistory: async () => {
    // Mock order history with more Moroccan dishes
    const mockOrders = [
      {
        id: 'ord-1',
        restaurantId: '7',
        restaurantName: 'Marrakesh Delights',
        date: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
        status: 'completed',
        items: [
          { id: 'md-1', name: 'Couscous Royal', price: 24.99, quantity: 2 },
          { id: 'md-3', name: 'Pastilla', price: 18.99, quantity: 1 },
          { id: 'md-4', name: 'Moroccan Mint Tea', price: 4.99, quantity: 2 }
        ],
        total: 78.95
      },
      {
        id: 'ord-2',
        restaurantId: '8',
        restaurantName: 'Casablanca Kitchen',
        date: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(), // 5 days ago
        status: 'completed',
        items: [
          { id: 'ck-1', name: 'Moroccan Seafood Tajine', price: 26.99, quantity: 1 },
          { id: 'ck-2', name: 'Harira Soup', price: 8.99, quantity: 2 },
          { id: 'ck-6', name: 'Chebakia', price: 6.99, quantity: 1 }
        ],
        total: 51.96
      }
    ];
    
    return { data: mockOrders };
  }
};

export default api;