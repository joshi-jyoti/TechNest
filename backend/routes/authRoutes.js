const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);
// Route to login a user
router.post('/login', loginUser);
// Route to get the profile of the logged-in user
router.get('/profile', protect, getUserProfile);

// Fixed: Changed from router.get to router.post and added missing semicolon
router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
}); // Added missing semicolon here

// Export the router to be used in the main server file
module.exports = router;