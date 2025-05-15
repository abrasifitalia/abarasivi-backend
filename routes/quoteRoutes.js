const express = require('express');
const router = express.Router();
const { createManualQuote } = require('../controllers/manualQuoteController');
const { validateQuoteRequest, quoteLimiter } = require('../middleware/quoteValidation');

router.post('/manual', 
  quoteLimiter,
  validateQuoteRequest,
  createManualQuote
);

module.exports = router;