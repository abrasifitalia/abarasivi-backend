const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes'); // Routes utilisateur
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const articleRoutes = require('./routes/articleRoutes');
const messageRoutes = require('./routes/messageRoutes');
const viewRoutes = require('./routes/viewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboard'); // Importez le fichier de route
const clientRoules = require('./routes/ClientRoutes');
dotenv.config(); // Charger les variables d'environnement depuis .env

const path = require('path');
const app = express();

const port = process.env.PORT || 5000;

// Middleware pour permettre le CORS et parser le corps des requêtes en JSON
app.use(cors({
    origin: ['http://abrasifitalia.com', 'https://abrasifitalia.com'],
    credentials: true
}));
app.use(express.json()); // Placer ici l'appel à `express.json()`

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes publiques
app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategory', subcategoryRoutes);
app.use('/api/article', articleRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/view', viewRoutes);
app.use('/api/order', orderRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/client', clientRoules);
// Route de déconnexion
app.post('/api/logout', (req, res) => {
    // Ici, vous pouvez ajouter des opérations pour invalider le token ou le supprimer du côté serveur si nécessaire.
    // Par exemple, stocker les tokens invalidés dans une base de données ou une liste (si vous avez un mécanisme pour cela).

    res.status(200).json({ message: 'Logout successful' });
});



// Servir les fichiers statiques depuis le dossier 'public/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
