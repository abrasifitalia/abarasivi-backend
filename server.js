const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan'); // For request logging

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

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS configuration
const whitelist = [
    'https://abrasifitalia.com',
    'https://www.abrasifitalia.com',
    'https://admin.abrasifitalia.com',
    'http://localhost:3000',
    'http://localhost:3001',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400, // Cache preflight requests for 24 hours
};

app.use(cors(corsOptions));

// Preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev')); // Request logging

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
    res.status(err.status || 500).json({
        error: 'Something went wrong!',
        message: err.message,
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

