const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getDashboardSummary } = require('../controllers/dashboardController');

//Admin only Middleware 
const adminOnly  = (req, res, next) => {
    if(req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

// Route to get dashboard summary
router.get('/', protect, adminOnly, getDashboardSummary);
module.exports = router;