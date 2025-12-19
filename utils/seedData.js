require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create sample users
    const sampleUsers = await User.insertMany([
      {
        name: 'John Doe',
        email: 'user@example.com',
        password: 'user123',
        role: 'user'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'user123',
        role: 'user'
      },
      {
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        password: 'user123',
        role: 'user'
      },
      {
        name: 'Anita Singh',
        email: 'anita@example.com',
        password: 'user123',
        role: 'user'
      }
    ]);

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        image: {
          public_id: 'sample_electronics',
          url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'
        }
      },
      {
        name: 'Clothing',
        description: 'Fashion and apparel',
        image: {
          public_id: 'sample_clothing',
          url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
        }
      },
      {
        name: 'Books',
        description: 'Books and literature',
        image: {
          public_id: 'sample_books',
          url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
        }
      }
    ]);

    // Create sample products
    const products = [
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced features',
        price: 699.99,
        discountPrice: 599.99,
        category: categories[0]._id,
        stock: 50,
        images: [{
          public_id: 'sample_phone',
          url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
        }],
        isFeatured: true
      },
      {
        name: 'Laptop',
        description: 'High-performance laptop for work and gaming',
        price: 1299.99,
        category: categories[0]._id,
        stock: 25,
        images: [{
          public_id: 'sample_laptop',
          url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
        }],
        isFeatured: true
      },
      {
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 29.99,
        discountPrice: 19.99,
        category: categories[1]._id,
        stock: 100,
        images: [{
          public_id: 'sample_tshirt',
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
        }]
      },
      {
        name: 'Jeans',
        description: 'Classic blue jeans',
        price: 79.99,
        category: categories[1]._id,
        stock: 75,
        images: [{
          public_id: 'sample_jeans',
          url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
        }]
      },
      {
        name: 'Programming Book',
        description: 'Learn programming with this comprehensive guide',
        price: 49.99,
        category: categories[2]._id,
        stock: 30,
        images: [{
          public_id: 'sample_book',
          url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'
        }]
      }
    ];

    const createdProducts = await Product.insertMany(products);

    // Create sample orders
    const sampleOrders = [
      {
        user: sampleUsers[0]._id,
        orderItems: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            quantity: 1,
            price: createdProducts[0].discountPrice || createdProducts[0].price,
            image: createdProducts[0].images[0].url
          }
        ],
        shippingAddress: {
          street: '123 MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        paymentMethod: 'stripe',
        itemsPrice: 599.99,
        taxPrice: 107.99,
        shippingPrice: 0,
        totalPrice: 707.98,
        isPaid: true,
        paidAt: new Date(),
        orderStatus: 'delivered',
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        user: sampleUsers[1]._id,
        orderItems: [
          {
            product: createdProducts[2]._id,
            name: createdProducts[2].name,
            quantity: 2,
            price: createdProducts[2].discountPrice || createdProducts[2].price,
            image: createdProducts[2].images[0].url
          }
        ],
        shippingAddress: {
          street: '456 Brigade Road',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        },
        paymentMethod: 'stripe',
        itemsPrice: 39.98,
        taxPrice: 7.20,
        shippingPrice: 5,
        totalPrice: 52.18,
        isPaid: true,
        paidAt: new Date(),
        orderStatus: 'shipped'
      },
      {
        user: sampleUsers[2]._id,
        orderItems: [
          {
            product: createdProducts[1]._id,
            name: createdProducts[1].name,
            quantity: 1,
            price: createdProducts[1].price,
            image: createdProducts[1].images[0].url
          },
          {
            product: createdProducts[4]._id,
            name: createdProducts[4].name,
            quantity: 1,
            price: createdProducts[4].price,
            image: createdProducts[4].images[0].url
          }
        ],
        shippingAddress: {
          street: '789 CP Market',
          city: 'New Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        paymentMethod: 'stripe',
        itemsPrice: 1349.98,
        taxPrice: 242.99,
        shippingPrice: 0,
        totalPrice: 1592.97,
        isPaid: true,
        paidAt: new Date(),
        orderStatus: 'processing'
      },
      {
        user: sampleUsers[3]._id,
        orderItems: [
          {
            product: createdProducts[3]._id,
            name: createdProducts[3].name,
            quantity: 1,
            price: createdProducts[3].price,
            image: createdProducts[3].images[0].url
          }
        ],
        shippingAddress: {
          street: '321 Park Street',
          city: 'Kolkata',
          state: 'West Bengal',
          zipCode: '700016',
          country: 'India'
        },
        paymentMethod: 'stripe',
        itemsPrice: 79.99,
        taxPrice: 14.40,
        shippingPrice: 0,
        totalPrice: 94.39,
        isPaid: true,
        paidAt: new Date(),
        orderStatus: 'pending'
      }
    ];

    await Order.insertMany(sampleOrders);

    console.log('✅ Sample data seeded successfully!');
    console.log('Admin credentials: admin@example.com / admin123');
    console.log('User credentials: user@example.com / user123');
    console.log('Sample customers: Priya Sharma, Rahul Kumar, Anita Singh');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();