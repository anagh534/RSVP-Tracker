const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return first error message for simplicity, or format them
    return res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
  }
  next();
};

module.exports = validate;
