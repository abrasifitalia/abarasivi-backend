const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        required: true,
        select: false // Don't return password in queries by default
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
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationCode: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    }
});

// Pre-save middleware to hash passwords
clientSchema.pre('save', async function(next) {
    // Only hash if password is modified
    if (!this.isModified('password')) return next();
    
    try {
        // Use consistent salt rounds (10)
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        // Debug log
        console.log('Password hashed successfully');
        
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        next(error);
    }
});

// Password validation method
clientSchema.methods.isValidPassword = async function(password) {
    try {
        // Ensure password exists
        if (!password || !this.password) {
            console.error('Missing password for comparison');
            return false;
        }
        
        // Debug logging
        console.log('Password validation attempt:', {
            hashedPasswordLength: this.password?.length || 0,
            attemptedPasswordLength: password?.length || 0
        });
        
        // Use bcrypt.compare properly
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