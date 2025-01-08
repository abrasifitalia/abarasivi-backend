const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Pour hacher le mot de passe
const jwt = require('jsonwebtoken');

// Schéma de l'utilisateur
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'  // Valeur par défaut : 'user'
    }
});

// Hacher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Vérifier si le mot de passe est correct lors de la connexion
userSchema.methods.isValidPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// Créer un token JWT pour l'utilisateur
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: '1h'  // Le token expire après 1 heure
    });
    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
