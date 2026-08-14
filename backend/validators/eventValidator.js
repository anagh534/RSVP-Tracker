const { body } = require('express-validator');

exports.createEventValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
  body('date')
    .isISO8601().withMessage('Must be a valid date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  body('location')
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Location must be between 3 and 255 characters')
];

exports.rsvpValidation = [
  body('status')
    .isIn(['going', 'maybe', 'declined']).withMessage('Invalid RSVP status')
];
