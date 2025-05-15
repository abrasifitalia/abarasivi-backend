const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet'); // Add helmet for security
const rateLimit = require('express-rate-limit'); // Add rate limiting

// Routes imports
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const articleRoutes = require('./routes/articleRoutes');
const messageRoutes = require('./routes/messageRoutes');
const viewRoutes = require('./routes/viewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboard');
const clientRoutes = require('./routes/ClientRoutes'); // Fixed typo
const quoteRoutes = require('./routes/quoteRoutes'); // Add quote routes

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Global rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Enhanced CORS configuration
const whitelist = [
    'https://abrasifitalia.com',
    'https://www.abrasifitalia.com',
    'https://admin.abrasifitalia.com',
    'http://localhost:3000',
    'http://localhost:3001',
];

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "blob:"]
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
})); // Add security headers with correct static file access
app.use(limiter); // Apply rate limiting
app.use(cors(corsOptions));

// Preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' })); // Reduced from 50mb for security
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Reduced from 50mb
app.use(morgan('dev')); // Request logging

// Configure static file serving before routes
app.use('/public', express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategory', subcategoryRoutes);
app.use('/api/article', articleRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/view', viewRoutes);
app.use('/api/order', orderRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/quote', quoteRoutes); // Add quote routes

// Logging middleware
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Logout route
app.post('/api/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    // Don't expose stack traces in production
    const error = process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message;
    
    res.status(err.status || 500).json({
        success: false,
        message: error
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

