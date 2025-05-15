const ManualQuote = require('../models/ManualQuote');
const Article = require('../models/Article');
const sendQuoteEmail = require('./Mailing/_quote_email');
const { validationResult } = require('express-validator');

exports.createManualQuote = async (req, res) => {
  try {
    // Validation results from middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error', 
        errors: errors.array() 
      });
    }

    const { articleId, quantity, name, email, phone, articleName, category, subCategory } = req.body;

    // Verify article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(400).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Create quote
    const quote = new ManualQuote({
      name,
      email,
      phone,
      articleId,
      quantity,
      articleName,
      category,
      subCategory
    });

    await quote.save();

    // Send emails
    await sendQuoteEmail({
      quoteDetails: quote,
      articleImage: article.image,
      isAdmin: false
    });

    await sendQuoteEmail({
      quoteDetails: quote,
      articleImage: article.image,
      isAdmin: true
    });

    res.status(200).json({
      success: true,
      message: 'Quote request received successfully',
      quoteId: quote._id
    });

  } catch (error) {
    console.error('Manual quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};