const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { 
    generateBlogPost, 
    generateBlogPostIdeas,    // Fixed: was "generatedBlogPostIdeas" 
    generateCommentReply, 
    generateBlogPostSummary   // Fixed: was "generatePostSummary"
} = require("../controllers/aiController");

router.post("/generate", protect, generateBlogPost);
router.post("/generate-ideas", protect, generateBlogPostIdeas);    // Fixed: function name
router.post("/generate-reply", protect, generateCommentReply);
router.post("/generate-summary", protect, generateBlogPostSummary); // Fixed: function name

module.exports = router;


