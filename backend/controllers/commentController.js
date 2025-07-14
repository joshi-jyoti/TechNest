const Comment = require("../models/Comment");
const BlogPost = require("../models/BlogPost");

// Function to add a comment to a blog post
// @route POST /api/comments/:postId
// access private
const addComment = async (req, res) => {
    try{
        const { postId } = req.params;
        const { content, parentComment } = req.body;
        
        // Validate required fields
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }
        
        //ensure blog post exists
        const post = await BlogPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        
        const comment = await Comment.create({
            post: postId,
            author: req.user._id,
            content,
            parentComment: parentComment || null,
        });
        
        await comment.populate("author", "name profileImageUrl");
        res.status(201).json(comment);
        
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: "Failed to add comment", error: error.message });
    }
};
// Function to get all comments for a blog post
// @route GET /api/comments
// access public
const getAllComments = async (req, res) => {
    
    try{
        const comments = await Comment.find()
        .populate("author", "name profileImageUrl")
        .populate("post", "title coverImageUrl")
        .sort({ createdAt: 1 })

        //create a map for commentId -> comment object
        const commentMap = {};
        comments.forEach(comment => {
            comment = comment.toObject(); // Convert Mongoose document to plain object
            comment.replies = []; // Initialize replies array
            commentMap[comment._id] = comment; // Map comment by ID
        });

        // nest replies under their parent comments
        // GET api/comments
        const nestedComments = [];
        comments.forEach(comment => {
            if (comment.parentComment){
                const parent = commentMap[comment.parentComment];
                if (parent) {
                    parent.replies.push(commentMap[comment._id]); // Add comment to parent's replies
                }
            } else{
                nestedComments.push(commentMap[comment._id]); // Top-level comment
            }
        });
            res.json(nestedComments);
        
    } catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch all comments", error: error.message });
    }
};
// Function to get comments by post ID
// @route GET /api/comments/:postId 
const getCommentsByPost = async (req, res) => {
    try{

    } catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch all comments", error: error.message });
    }
};

// Function to delete a comment
// @route DELETE /api/comments/:commentid
const deleteComment = async (req, res) => {
    try{

    } catch (error) {
        res
            .status(500)
            .json({ message: "Failed to delete all comment", error: error.message });
    }
};

module.exports = {
    addComment,
    getCommentsByPost,
    deleteComment,
    getAllComments,
};