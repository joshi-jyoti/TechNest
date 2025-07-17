const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { generateBlogPost, generatedBlogPostIdeas, generateCommentReply, generatePostSummary } = require("../controllers/aiController");
const { route } = require("./authRoutes");

router.post("/generate", protect, generateBlogPost);
router.post("/generate-ideas", protect, generatedBlogPostIdeas);
router.post("/generate-reply", protect, generateCommentReply);
router.post("/generate-summary", protect, generatePostSummary);
module.exports = router;