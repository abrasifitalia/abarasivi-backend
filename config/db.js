const mongoose = require('mongoose');
const config = require('./config');  // On charge la configuration

const connectDB = async () => {
    try {
        await mongoose.connect(config.dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);  // Arrêter le processus en cas d'erreur de connexion
    }
};

module.exports = connectDB;
