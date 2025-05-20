const mailService = require('./Mailing/_mailmiddleware');
const Message = require('../models/Message');
const sendContactMessageEmail = require('./Mailing/_contact_message'); // Import the email function

const sendContactEmail = async (messageDetails) => {
    try {
        // Send to client
        await mailService.sendMail({
            type: 'contact',
            to: messageDetails.email,
            subject: 'Nous avons reçu votre message',
            html: contactClientTemplate(messageDetails)
        });

        // Send to admin
        await mailService.sendMail({
            type: 'contact',
            to: process.env.ADMIN_EMAIL,
            subject: `Nouveau message de contact - ${messageDetails.name}`,
            html: contactAdminTemplate(messageDetails)
        });

        return true;
    } catch (error) {
        console.error('Error sending contact emails:', error);
        return false;
    }
};

// Ajouter un message
const addMessage = async (req, res) => {
    const { nom, email, message, phone, objet } = req.body;

    try {
        const newMessage = new Message({
            nom,
            email,
            message,
            phone,
            objet
        });

        await newMessage.save();

        // Prepare message details for email
        const messageDetails = { nom, email, message, phone, objet };

        // Send emails
        await sendContactMessageEmail(messageDetails);

        res.status(201).json({ message: 'Message added successfully', message: newMessage });
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ message: 'Error adding message', error: error.message });
    }
};

// Lister tous les messages
const listMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error listing messages:', error);
        res.status(500).json({ message: 'Error listing messages', error: error.message });
    }
};

// Supprimer un message
const deleteMessage = async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Error deleting message', error: error.message });
    }
};

module.exports = { addMessage, listMessages, deleteMessage };
