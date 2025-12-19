require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({ 
  origin: ['http://localhost:3000', 'https://ecommerce-client-simw.onrender.com', 'https://your-netlify-app.netlify.app'], 
  credentials: true 
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handler
app.use(errorHandler);

// Seed data in production if no users exist
if (process.env.NODE_ENV === 'production') {
  const User = require('./models/User');
  User.countDocuments().then(count => {
    if (count === 0) {
      console.log('No users found, seeding data...');
      require('./utils/seedData');
    }
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});