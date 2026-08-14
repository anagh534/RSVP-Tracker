const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginValidation } = require('../validators/authValidator');
const validate = require('../validators/validate');

router.post('/login', loginValidation, validate, authController.login);
router.get('/users', authController.getUsers); // Used for testing/seeding display

module.exports = router;
