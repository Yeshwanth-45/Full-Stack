import { mockRestaurants, mockMenuItems, mockOrders, mockUser } from '../data/mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth
  login: async (email, password) => {
    await delay(800);
    if (email === 'user@example.com' && password === 'password') {
      const token = 'mock_jwt_token_' + Math.random().toString(36).substr(2);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, token, user: mockUser };
    }
    throw new Error('Invalid credentials');
  },

  logout: async () => {
    await delay(300);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    return { success: true };
  },

  getCurrentUser: async () => {
    await delay(300);
    const user = localStorage.getItem('user');
    if (!user) throw new Error('Not authenticated');
    return JSON.parse(user);
  },

  // Restaurants
  getRestaurants: async () => {
    await delay(600);
    return mockRestaurants;
  },

  getRestaurant: async (id) => {
    await delay(400);
    const restaurant = mockRestaurants.find(r => r.id === parseInt(id));
    if (!restaurant) throw new Error('Restaurant not found');
    return restaurant;
  },

  // Menu
  getMenu: async (restaurantId) => {
    await delay(500);
    const menu = mockMenuItems[restaurantId];
    if (!menu) throw new Error('Menu not found');
    return menu;
  },

  // Cart
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  updateCart: (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    return items;
  },

  // Orders
  getOrders: async () => {
    await delay(700);
    return mockOrders;
  },

  getOrder: async (orderId) => {
    await delay(500);
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    return order;
  },

  createOrder: async (orderData) => {
    await delay(1000);
    const newOrder = {
      ...orderData,
      id: `ORD${1000 + mockOrders.length + 1}`,
      status: 'confirmed',
      orderDate: new Date().toISOString()
    };
    mockOrders.unshift(newOrder);
    localStorage.removeItem('cart');
    return newOrder;
  },

  // Coupons
  validateCoupon: async (code) => {
    await delay(400);
    const coupons = {
      'WELCOME10': { discount: 10, type: 'percentage', maxDiscount: 100 },
      'FLAT50': { discount: 50, type: 'fixed' },
      'FREEDEL': { discount: 0, type: 'free_delivery' }
    };
    
    const coupon = coupons[code];
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }
    return { ...coupon, code };
  }
};

export default api;
