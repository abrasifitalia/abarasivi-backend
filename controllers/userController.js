const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Pour la gestion des tokens JWT
const bcrypt = require('bcryptjs');
// Clé secrète pour signer les tokens
const JWT_SECRET = '1234';
// Fonction pour enregistrer un utilisateur
const registerUser = async (req, res) => {
    const { firstName, lastName, phone, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newUser = new User({ firstName, lastName, phone, email, password });
        await newUser.save();
        
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email },
        });
    } catch (error) {
        console.error('Error during registration:', error);  // Log de l'erreur
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};


// Fonction pour connecter un utilisateur
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login request received:', { email, password });  // Log des informations envoyées

    // Vérifier que l'email et le mot de passe sont fournis
    if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Chercher l'utilisateur dans la base de données
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log('User found:', user);

        // Comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log('Password match successful');

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id }, '1234', { expiresIn: '1h' });

        console.log('JWT generated:', token);

        // Répondre avec les informations de l'utilisateur et le token
        res.status(200).json({
            message: 'Login successful',
            token,  // Envoyer le token d'authentification
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error in login process:', error);  // Log de l'erreur
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};



// Fonction pour lister tous les utilisateurs
const listUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclut les mots de passe des résultats
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};


module.exports = { registerUser, loginUser, listUsers };
