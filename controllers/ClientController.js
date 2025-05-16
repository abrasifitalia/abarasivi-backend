const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const sendOnboardingEmail = require('./Mailing/_onboarding'); // Add this line
const crypto = require('crypto');
const mailService = require('./Mailing/_mailmiddleware');
const resetPasswordTemplate = require('../utils/mailing-templates/_reset_password');
const bcrypt = require('bcrypt'); // Add this line

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

        // Debug log
        console.log('Registration attempt:', { email, firstName, lastName });

        // Check if email already exists
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: 'Email déjà utilisé'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new client
        const client = new Client({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
        });

        await client.save();

        // Send onboarding email
        try {
            await sendOnboardingEmail({
                email,
                firstName,
                lastName
            });
            console.log('Onboarding email sent successfully');
        } catch (emailError) {
            console.error('Error sending onboarding email:', emailError);
        }

        // Generate token for automatic login
        const token = jwt.sign(
            { _id: client._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            success: true,
            message: 'Client enregistré avec succès !',
            token,
            clientId: client._id,
            clientName: `${client.firstName} ${client.lastName}`
        });

    } catch (error) {
        console.error('Registration error:', error);
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

        // Add input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis'
            });
        }

        // Debug log
        console.log('Login attempt for:', email);

        // Fix: Use proper error handling for findOne
        const client = await Client.findOne({ email });
        
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }

        // Verify password
        const isMatch = await client.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }

        // Generate token
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
        const client = await Client.findById(req.clientId).select('-password'); // Exclure le mot de passe
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
        // Récupérer tous les clients et exclure le mot de passe
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
  
      await client.remove();
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
            codeExpired: client?.verificationCodeExpires < Date.now(),
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

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(actualPassword, salt);

        // Update client password and clear verification code
        client.password = hashedPassword;
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

module.exports = { 
    registerClient, 
    loginClient, 
    getClientInfo, 
    getAllClients, 
    deleteClient,
    requestPasswordReset,
    resetPassword
};
