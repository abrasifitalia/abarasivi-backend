const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const sendOnboardingEmail = require('./Mailing/_onboarding'); // Add this line

// Inscription d'un client
const registerClient = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    try {
        // Vérifier si un client existe déjà avec le même email
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        // Créer un nouveau client
        const client = new Client({
            firstName,
            lastName,
            email,
            password,
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
            // Don't return error response here - registration was successful
        }

        res.status(201).json({ message: 'Client enregistré avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'inscription du client :', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
};

// Connexion du client
const loginClient = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si le client existe
        const client = await Client.findOne({ email });
        if (!client) {
            return res.status(400).json({ message: 'Client introuvable' });
        }

        // Vérifier le mot de passe
        const isMatch = await client.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe invalide' });
        }

        // Créer un token JWT
        const token = jwt.sign({ _id: client._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            message: 'Connexion réussie',
            token, 
            clientId: client._id,
            clientName: client.firstName + ' ' + client.lastName
        });
    } catch (error) {
        console.error('Erreur lors de la connexion du client :', error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
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
  




module.exports = { registerClient, loginClient, getClientInfo, getAllClients, deleteClient };
