const user = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');    

//generate JWT token
const generateToken = (userID) => {
    return jwt.sign({ id:userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

// Register a new user
const registerUser = async (req, res) => {
    try {

    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login a user
const loginUser = async (req, res) => {};