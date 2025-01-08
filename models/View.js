// models/View.js
const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client', // Référence à l'utilisateur (client)
        required: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article', // Référence à l'article
        required: true
    },
    views: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('View', viewSchema);
