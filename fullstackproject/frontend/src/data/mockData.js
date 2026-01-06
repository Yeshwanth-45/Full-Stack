// Mock data for restaurants
export const mockRestaurants = [
  {
    id: 1,
    name: 'Burger Palace',
    cuisine: 'American, Fast Food, Burgers',
    rating: 4.2,
    deliveryTime: '25-35 min',
    minOrder: 99,
    image: 'https://source.unsplash.com/600x400/?burger,restaurant',
    isOpen: true,
    discount: 20,
    distance: 1.5,
    priceRange: '₹₹',
    tags: ['Burgers', 'Fast Food', 'American'],
    featured: true
  },
  {
    id: 2,
    name: 'Pizza Heaven',
    cuisine: 'Italian, Pizza, Pasta',
    rating: 4.5,
    deliveryTime: '30-40 min',
    minOrder: 149,
    image: 'https://source.unsplash.com/600x400/?pizza,italian',
    isOpen: true,
    discount: 30,
    distance: 2.1,
    priceRange: '₹₹₹',
    tags: ['Pizza', 'Italian', 'Pasta'],
    featured: true
  },
  {
    id: 3,
    name: 'Sushi World',
    cuisine: 'Japanese, Sushi, Asian',
    rating: 4.7,
    deliveryTime: '35-45 min',
    minOrder: 199,
    image: 'https://source.unsplash.com/600x400/?sushi,japanese',
    isOpen: true,
    discount: 15,
    distance: 3.2,
    priceRange: '₹₹₹₹',
    tags: ['Sushi', 'Japanese', 'Asian'],
    featured: true
  },
  {
    id: 4,
    name: 'Spice Garden',
    cuisine: 'North Indian, Chinese, Mughlai',
    rating: 4.3,
    deliveryTime: '20-30 min',
    minOrder: 149,
    image: 'https://source.unsplash.com/600x400/?indian,food',
    isOpen: true,
    discount: 40,
    distance: 1.8,
    priceRange: '₹₹₹',
    tags: ['North Indian', 'Chinese', 'Mughlai'],
    featured: false
  },
  {
    id: 5,
    name: 'The Pasta House',
    cuisine: 'Italian, Pasta, Salad',
    rating: 4.1,
    deliveryTime: '25-35 min',
    minOrder: 179,
    image: 'https://source.unsplash.com/600x400/?pasta,italian',
    isOpen: true,
    discount: 0,
    distance: 2.5,
    priceRange: '₹₹₹',
    tags: ['Pasta', 'Italian', 'Salad'],
    featured: false
  },
  {
    id: 6,
    name: 'Burger King',
    cuisine: 'American, Fast Food, Burgers',
    rating: 4.0,
    deliveryTime: '20-30 min',
    minOrder: 129,
    image: 'https://source.unsplash.com/600x400/?burger,fastfood',
    isOpen: true,
    discount: 50,
    distance: 1.2,
    priceRange: '₹₹',
    tags: ['Burgers', 'Fast Food', 'American'],
    featured: true
  },
  {
    id: 7,
    name: 'Dominos',
    cuisine: 'Italian, Pizza, Fast Food',
    rating: 4.2,
    deliveryTime: '25-35 min',
    minOrder: 99,
    image: 'https://source.unsplash.com/600x400/?pizza,delivery',
    isOpen: true,
    discount: 25,
    distance: 1.7,
    priceRange: '₹₹',
    tags: ['Pizza', 'Fast Food', 'Italian'],
    featured: true
  },
  {
    id: 8,
    name: 'China Town',
    cuisine: 'Chinese, Asian, Noodles',
    rating: 4.4,
    deliveryTime: '30-40 min',
    minOrder: 199,
    image: 'https://source.unsplash.com/600x400/?chinese,food',
    isOpen: true,
    discount: 20,
    distance: 2.8,
    priceRange: '₹₹₹',
    tags: ['Chinese', 'Asian', 'Noodles'],
    featured: false
  }
];

// Mock menu items for restaurants
export const mockMenuItems = {
  1: [
    { id: 101, name: 'Classic Burger', description: 'Beef patty with lettuce, tomato, and special sauce', price: 129, category: 'Burgers', isVeg: false, isBestSeller: true },
    { id: 102, name: 'Cheese Burger', description: 'Classic burger with extra cheese', price: 149, category: 'Burgers', isVeg: false, isBestSeller: true },
    { id: 103, name: 'French Fries', description: 'Crispy golden fries with seasoning', price: 79, category: 'Sides', isVeg: true, isBestSeller: true },
    { id: 104, name: 'Chicken Wings', description: 'Spicy buffalo wings with blue cheese dip', price: 199, category: 'Starters', isVeg: false, isBestSeller: false }
  ],
  2: [
    { id: 201, name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce and mozzarella', price: 249, category: 'Pizzas', isVeg: true, isBestSeller: true },
    { id: 202, name: 'Pepperoni Pizza', description: 'Pizza with spicy pepperoni and cheese', price: 299, category: 'Pizzas', isVeg: false, isBestSeller: true },
    { id: 203, name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 99, category: 'Sides', isVeg: true, isBestSeller: false },
    { id: 204, name: 'Pasta Alfredo', description: 'Fettuccine in creamy alfredo sauce', price: 179, category: 'Pasta', isVeg: true, isBestSeller: true }
  ],
  3: [
    { id: 301, name: 'California Roll', description: 'Crab, avocado, and cucumber roll', price: 349, category: 'Sushi Rolls', isVeg: false, isBestSeller: true },
    { id: 302, name: 'Salmon Nigiri', description: 'Fresh salmon over pressed rice', price: 299, category: 'Nigiri', isVeg: false, isBestSeller: true },
    { id: 303, name: 'Miso Soup', description: 'Traditional Japanese soybean soup', price: 99, category: 'Soups', isVeg: true, isBestSeller: false },
    { id: 304, name: 'Tempura Udon', description: 'Udon noodles in broth with tempura', price: 279, category: 'Noodles', isVeg: false, isBestSeller: true }
  ]
};

// Mock orders
export const mockOrders = [
  {
    id: 'ORD1001',
    restaurantId: 1,
    restaurantName: 'Burger Palace',
    status: 'delivered',
    totalAmount: 328,
    items: [
      { id: 101, name: 'Classic Burger', quantity: 2, price: 129 },
      { id: 103, name: 'French Fries', quantity: 1, price: 79 }
    ],
    orderDate: '2025-01-05T18:30:00.000Z',
    deliveryAddress: '123 Main St, City, 400001'
  },
  {
    id: 'ORD1002',
    restaurantId: 2,
    restaurantName: 'Pizza Heaven',
    status: 'preparing',
    totalAmount: 548,
    items: [
      { id: 201, name: 'Margherita Pizza', quantity: 1, price: 249 },
      { id: 203, name: 'Garlic Bread', quantity: 2, price: 99 },
      { id: 204, name: 'Pasta Alfredo', quantity: 1, price: 179 }
    ],
    orderDate: '2025-01-06T19:15:00.000Z',
    deliveryAddress: '123 Main St, City, 400001'
  }
];

// Mock user data
export const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+919876543210',
  addresses: [
    {
      id: 1,
      type: 'home',
      address: '123 Main St, City',
      landmark: 'Near Central Park',
      isDefault: true
    },
    {
      id: 2,
      type: 'work',
      address: '456 Business District, City',
      landmark: 'Opposite Metro Station',
      isDefault: false
    }
  ]
};
