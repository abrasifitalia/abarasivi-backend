const mongoose = require('mongoose');

const manualQuoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s-]{8,}$/, 'Please enter a valid phone number']
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'Article ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  articleName: {
    type: String,
    required: [true, 'Article name is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  subCategory: {
    type: String,
    required: [true, 'Sub-category is required']
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ManualQuote', manualQuoteSchema);