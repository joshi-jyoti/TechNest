const comment = require("../models/Comment");
const BlogPost = require("../models/BlogPost");

// Function to add a comment to a blog post
// @route POST /api/comments/:postId
// access private
const addComment = async (req, res) => {
    try{

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Function to get all comments for a blog post
// @route GET /api/comments
// access public
const getAllComments = async (req, res) => {
    // try{

    // } catch (error) {
    //     console.error('Server Error:', error);
    //     res.status(500).json({ message: 'Server error' });
    // }
};
// Function to get comments by post ID
// @route GET /api/comments/:postId 
const getCommentsByPost = async (req, res) => {
    // try{
    //     const comments = await comment.find({ postId: req.params.postId })
    //         .populate("author", "name profileImageUrl")
    //         .sort({ createdAt: -1 });
    //     res.json(comments);
    // } catch (error) {
    //     console.error('Server Error:', error);
    //     res.status(500).json({ message: 'Server error' });
    // }
};

// Function to delete a comment
// @route DELETE /api/comments/:commentid
const deleteComment = async (req, res) => {
};

module.exports = {
    addComment,
    getCommentsByPost,
    deleteComment,
    getAllComments,
};