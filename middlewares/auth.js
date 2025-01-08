const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Le token doit être dans le header "Authorization" sous la forme "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing!' });
    }

    try {
        // Vérifie le token
        const decoded = jwt.verify(token, '1234');
        req.user = decoded.userId; // Ajoute l'ID de l'utilisateur dans la requête
        next(); // Passe à la route suivante
    } catch (error) {
        res.status(400).json({ message: 'Invalid token', error });
    }
};

module.exports = authenticateToken;
