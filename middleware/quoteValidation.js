const { check } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiting middleware
exports.quoteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: {
    success: false,
    message: 'Too many quote requests. Please try again later.'
  }
});

// Validation middleware
exports.validateQuoteRequest = [
  check('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .escape(),

  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  check('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[\d\s-]{8,}$/).withMessage('Invalid phone number format')
    .escape(),

  check('articleId')
    .trim()
    .notEmpty().withMessage('Article ID is required')
    .isMongoId().withMessage('Invalid article ID'),

  check('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive number'),

  check('articleName')
    .trim()
    .notEmpty().withMessage('Article name is required')
    .escape(),

  check('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .escape(),

  check('subCategory')
    .trim()
    .notEmpty().withMessage('Sub-category is required')
    .escape()
];