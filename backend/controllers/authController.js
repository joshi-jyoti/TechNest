const User = require('../models/User'); // Changed from 'user' to 'User'
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');    

//generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

// Register a new user
const registerUser = async (req, res) => {
    try {
        const {name, email, password, profileImageUrl, bio, adminAccessToken} = req.body;
        // Check if user already exists
        const userExists = await User.findOne({ email }); // Now using User (uppercase)
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // determine the user role: Admin if correct token is provided, otherwise Member
        let role = "member";
        if (
            adminAccessToken &&
            adminAccessToken == process.env.ADMIN_ACCESS_TOKEN
        ) {
            role = "admin"
        }
        const newUser = await User.create({ // Changed variable name to avoid conflict
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            bio,
            role,
        });

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profileImageUrl: newUser.profileImageUrl,
            bio: newUser.bio,
            role: newUser.role,
            token: generateToken(newUser._id),
        });

    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            bio: user.bio,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    registerUser, loginUser, getUserProfile 
};