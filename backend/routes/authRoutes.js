const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
// Route to register a new user
router.post('/register', registerUser);
// Route to login a user
router.post('/login', loginUser);
// Route to get the profile of the logged-in user
router.get('/profile', protect, getUserProfile);

// Export the router to be used in the main server file
module.exports = router;