const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/userController');
const { validateSignup } = require('../validations/userValidation');

// POST /api/users/signup - Create a new user
router.post('/signup', validateSignup, signup);

module.exports = router;
