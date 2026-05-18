const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/me', asyncHandler(authController.me));
router.post('/login', asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));

module.exports = router;
