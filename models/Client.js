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

// Pre-save middleware to hash passwords
clientSchema.pre('save', async function(next) {
    // Only hash if password is modified
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Password validation method
clientSchema.methods.isValidPassword = async function(password) {
    try {
        // Debug logging
        console.log('Password validation attempt:', {
            hashedPasswordLength: this.password?.length || 0,
            attemptedPasswordLength: password?.length || 0
        });

        // Use bcrypt.compare directly
        const isValid = await bcrypt.compare(password, this.password);
        
        // Debug result
        console.log('Password validation result:', {
            isValid,
            timestamp: new Date().toISOString()
        });

        return isValid;
    } catch (error) {
        console.error('Password validation error:', error);
        return false;
    }
};

// Créer le modèle
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
