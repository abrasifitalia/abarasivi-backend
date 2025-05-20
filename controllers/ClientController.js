const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const sendOnboardingEmail = require('../utils/mailing-templates/_onboarding');
const crypto = require('crypto');
const mailService = require('./Mailing/_mailmiddleware');
const resetPasswordTemplate = require('../utils/mailing-templates/_reset_password');
const bcrypt = require('bcryptjs');
const verificationEmailTemplate = require('../utils/mailing-templates/_email_verification');

// Update the hashPassword utility
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Inscription d'un client
const registerClient = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        // Input validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont requis'
            });
        }

        // Check if email already exists
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: 'Cette adresse email est déjà utilisée'
            });
        }

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create new client
        const client = new Client({
            firstName,
            lastName,
            email,
            password,
            phone,
            emailVerificationCode: verificationCode,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: false // Explicitly set verification status
        });

        await client.save();

        // Send both onboarding and verification emails
        try {
            // Send onboarding email first
            const onboardingResult = await sendOnboardingEmail({
                email,
                firstName,
                lastName
            });
            console.log('Onboarding email status:', onboardingResult);

            // Send verification email
            await mailService.sendMail({
                type: 'auth',
                to: email,
                subject: 'Vérification de votre compte Abrasif Italia',
                html: verificationEmailTemplate({
                    firstName,
                    verificationCode
                })
            });

            console.log('All emails sent successfully');
        } catch (emailError) {
            console.error('Error sending emails:', emailError);
            // Don't fail registration if email sending fails
        }

        // Success response
        res.status(201).json({
            success: true,
            message: 'Compte créé avec succès. Veuillez vérifier votre email.',
            email,
            requiresVerification: true
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate key error specifically
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Cette adresse email est déjà utilisée'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'inscription',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Connexion du client
const loginClient = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis'
            });
        }

        // Debug log
        console.log('Login attempt for:', email);

        // Find client
        const client = await Client.findOne({ email }).select('+password');

        if (!client) {
            console.log('Client not found:', email);
            return res.status(400).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }

        // Check if email is verified - skip for old users without verification field
        if (client.emailVerificationCode !== undefined && !client.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Veuillez vérifier votre email avant de vous connecter',
                needsVerification: true,
                email: client.email
            });
        }

        // Validate password using the model method
        const isValid = await client.isValidPassword(password);

        if (!isValid) {
            console.log('Invalid password for user:', email);
            return res.status(400).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }

        console.log('Login successful for:', email);

        // Generate token on success
        const token = jwt.sign(
            { _id: client._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            token,
            clientId: client._id,
            clientName: `${client.firstName} ${client.lastName}`
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion'
        });
    }
};

// Obtenir les informations d'un client
const getClientInfo = async (req, res) => {
    try {
        const client = await Client.findById(req.clientId).select('-password');
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error('Erreur lors de la récupération des informations du client :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des informations' });
    }
};

// Obtenir la liste de tous les clients
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find().select('-password');

        if (!clients || clients.length === 0) {
            return res.status(404).json({ message: 'Aucun client trouvé' });
        }

        res.status(200).json(clients);
    } catch (error) {
        console.error('Erreur lors de la récupération de la liste des clients :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des clients' });
    }
};

// Supprimer un client
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Tentative de suppression du client avec l\'ID:', id);
  
        const client = await Client.findById(id);
        if (!client) {
            console.log('Client non trouvé');
            return res.status(404).json({ message: 'Client non trouvé' });
        }
  
        // Use deleteOne() instead of remove() which is deprecated
        await Client.deleteOne({ _id: id });
        console.log('Client supprimé avec succès');
        res.status(200).json({ message: 'Client supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression du client', error: error.message });
    }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const client = await Client.findOne({ email });

        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        // Save verification code
        client.verificationCode = verificationCode;
        client.verificationCodeExpires = verificationCodeExpires;
        await client.save();

        // Send email with verification code
        await mailService.sendMail({
            type: 'auth',
            to: email,
            subject: 'Code de réinitialisation de mot de passe',
            html: resetPasswordTemplate({
                firstName: client.firstName,
                verificationCode
            })
        });

        res.status(200).json({ 
            message: 'Code de vérification envoyé par email',
            email: client.email
        });
    } catch (error) {
        console.error('Error in requestPasswordReset:', error);
        res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation' });
    }
};

// Verify code and reset password
const resetPassword = async (req, res) => {
    try {
        const { email, code, verificationCode, password, newPassword } = req.body;
        
        // Support both code and verificationCode parameters
        const actualCode = code || verificationCode;
        const actualPassword = password || newPassword;

        // Input validation
        if (!email || !actualCode || !actualPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'Email, code de vérification et nouveau mot de passe sont requis'
            });
        }

        // Log incoming request data (remove in production)
        console.log('Reset attempt:', {
            email,
            code: actualCode,
            timestamp: new Date()
        });

        // Find client with active verification code
        const client = await Client.findOne({
            email,
            verificationCode: actualCode,
            verificationCodeExpires: { $gt: Date.now() }
        });

        // Debug logging
        console.log('Client found:', {
            found: !!client,
            codeMatch: client?.verificationCode === actualCode,
            codeExpired: client ? client.verificationCodeExpires < Date.now() : null,
            requestCode: actualCode,
            storedCode: client?.verificationCode
        });

        if (!client) {
            return res.status(400).json({ 
                success: false,
                message: 'Code de vérification invalide ou expiré',
                details: 'Veuillez demander un nouveau code'
            });
        }

        // Update client password (don't hash manually - let the pre-save hook handle it)
        client.password = actualPassword; 
        client.verificationCode = null;
        client.verificationCodeExpires = null;
        
        await client.save();

        res.status(200).json({ 
            success: true,
            message: 'Mot de passe réinitialisé avec succès' 
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la réinitialisation du mot de passe',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Verify email
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const client = await Client.findOne({
            email,
            emailVerificationCode: code,
            emailVerificationExpires: { $gt: Date.now() },
            isEmailVerified: false
        });

        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Code de vérification invalide ou expiré'
            });
        }

        // Update client verification status
        client.isEmailVerified = true;
        client.emailVerificationCode = null;
        client.emailVerificationExpires = null;
        await client.save();

        // Generate token for automatic login
        const token = jwt.sign(
            { _id: client._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Email vérifié avec succès',
            token,
            clientId: client._id,
            clientName: `${client.firstName} ${client.lastName}`
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification'
        });
    }
};

// Resend verification code
const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        const client = await Client.findOne({ 
            email,
            isEmailVerified: false 
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client non trouvé ou déjà vérifié'
            });
        }

        // Generate new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        client.emailVerificationCode = verificationCode;
        client.emailVerificationExpires = verificationExpires;
        await client.save();

        // Send new verification email
        await mailService.sendMail({
            type: 'auth',
            to: email,
            subject: 'Nouveau code de vérification - Abrasif Italia',
            html: verificationEmailTemplate({
                firstName: client.firstName,
                verificationCode
            })
        });

        res.status(200).json({
            success: true,
            message: 'Nouveau code de vérification envoyé',
            email
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi du nouveau code'
        });
    }
};

module.exports = { 
    registerClient, 
    loginClient, 
    getClientInfo, 
    getAllClients, 
    deleteClient,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerificationCode
};
