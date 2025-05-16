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
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    verificationCode: {
        type: String,
        default: null
    },
    verificationCodeExpires: {
        type: Date,
        default: null
    }
});

// Hacher le mot de passe avant de sauvegarder
clientSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Vérifier le mot de passe
clientSchema.methods.isValidPassword = async function (password) {
    try {
        console.log('Comparing passwords:', {
            plainPassword: password.substring(0, 3) + '...', // Log only first 3 chars for security
            hashedLength: this.password.length
        });
        
        const isValid = await bcrypt.compare(password, this.password);
        console.log('Comparison result:', isValid);
        
        return isValid;
    } catch (error) {
        console.error('Password validation error:', error);
        throw error;
    }
};

// Créer le modèle
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
