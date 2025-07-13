const express = require("express");
const router = express.Router();
const{
    addComment,
    getCommentsByPost,
    deleteComment,
    getAllComments,
} = require("../controllers/commentController");
// Middleware to protect routes
const { protect } = require("../middlewares/authMiddleware");
// Route to add a comment to a blog post
// @route POST /api/comments/:postId    
router.post("/:postId", protect, addComment);
// Route to get all comments for a blog post
// @route GET /api/comments/:postId
router.get("/:postId", getCommentsByPost);
// router to get all comments
// @route GET /api/comments
router.get("/", protect, getAllComments);
// Route to delete a comment
// @route DELETE /api/comments/:id
router.delete("/:commentid", protect, deleteComment);

module.exports = router;