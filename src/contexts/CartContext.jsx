import React, { createContext, useContext, useState, useEffect } from 'react';
const CartContext = /*#__PURE__*/createContext(undefined);
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
const CART_STORAGE_KEY = 'food-delivery-cart';
export const CartProvider = ({
  children
}) => {
  const [items, setItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const {
          items,
          restaurantId
        } = JSON.parse(savedCart);
        setItems(items || []);
        setRestaurantId(restaurantId || null);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      items,
      restaurantId
    }));
  }, [items, restaurantId]);
  const addItem = (item, newRestaurantId) => {
    // If adding from a different restaurant, clear the cart first
    if (restaurantId && restaurantId !== newRestaurantId) {
      if (!window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
        return;
      }
      setItems([]);
    }
    setRestaurantId(newRestaurantId);
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Item doesn't exist, add it
        return [...prevItems, {
          ...item,
          quantity: 1
        }];
      }
    });
  };
  const removeItem = itemId => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    // If cart becomes empty, reset restaurantId
    if (items.length === 1) {
      setRestaurantId(null);
    }
  };
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prevItems => prevItems.map(item => item.id === itemId ? {
      ...item,
      quantity
    } : item));
  };
  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
  };
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };
  const value = {
    items,
    restaurantId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount
  };
  return /*#__PURE__*/React.createElement(CartContext.Provider, {
    value: value
  }, children);
};