const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
    try{
        let token=req.headers.authorization;
        if(token && token.startsWith('Bearer ')){
            token = token.split(' ')[1]; // Extract the token from the Bearer string
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password'); // Exclude password from the user object
            next(); // Proceed to the next middleware or route handler
        }else{
            res.status(401).json({ message: 'Not authorized, no token' });
        }
    } catch (error) {
        console.error('Error in authMiddleware:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };