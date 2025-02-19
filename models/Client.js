const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Pour hacher les mots de passe

// Schéma du client
const clientSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hacher le mot de passe avant de sauvegarder
clientSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Vérifier le mot de passe
clientSchema.methods.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Créer le modèle
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
