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
            .sort({ createdAt: 1 });

        //create a map for commentId -> comment object
        const commentMap = {};
        comments.forEach(comment => {
            const commentObj = comment.toObject(); // Fixed: use a new variable
            commentObj.replies = []; // Initialize replies array
            commentMap[commentObj._id] = commentObj; // Map comment by ID
        });

        // nest replies under their parent comments
        const nestedComments = [];
        comments.forEach(comment => {
            const commentObj = comment.toObject(); // Fixed: convert to object again
            if (commentObj.parentComment){
                const parent = commentMap[commentObj.parentComment];
                if (parent) {
                    parent.replies.push(commentMap[commentObj._id]); // Add comment to parent's replies
                }
            } else{
                nestedComments.push(commentMap[commentObj._id]); // Top-level comment
            }
        });
        
        res.json(nestedComments);
        
    } catch (error) {
        console.error('Error fetching all comments:', error);
        res.status(500).json({ message: "Failed to fetch all comments", error: error.message });
    }
};
// Function to get comments by post ID
// @route GET /api/comments/:postId 
const getCommentsByPost = async (req, res) => {
    try{
        const { postId } = req.params;
        
        // Verify post exists
        const post = await BlogPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        
        const comments = await Comment.find({ post: postId })
            .populate("author", "name profileImageUrl")
            .populate("post", "title coverImageUrl")
            .sort({ createdAt: 1 });
            
        //create a map for commentId -> comment object
        const commentMap = {};
        comments.forEach(comment => {
            const commentObj = comment.toObject(); // Convert Mongoose document to plain object
            commentObj.replies = []; // Initialize replies array
            commentMap[commentObj._id] = commentObj; // Map comment by ID
        });
        
        // nest replies under their parent comments
        const nestedComments = [];
        comments.forEach(comment => {
            const commentObj = comment.toObject();
            if (commentObj.parentComment) {
                const parent = commentMap[commentObj.parentComment];
                if (parent) {
                    parent.replies.push(commentMap[commentObj._id]); // Add comment to parent's replies
                }
            } else {
                nestedComments.push(commentMap[commentObj._id]); // Top-level comment
            }
        });
        
        res.json(nestedComments); // Fixed: Added missing response
        
    } catch (error) {
        console.error('Error fetching comments by post:', error);
        res.status(500).json({ message: "Failed to fetch comments", error: error.message });
    }
};

// Function to delete a comment
// @route DELETE /api/comments/:commentId  // Fixed: changed to commentId
const deleteComment = async (req, res) => {
    try{
        const { commentId } = req.params; // This should match the route parameter
        
        console.log('Comment ID to delete:', commentId); // Debug log
        
        // Verify comment exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        
        // Check if user is authorized to delete this comment
        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }
        
        //delete comment
        await Comment.deleteOne({ _id: commentId });
        //delete all replies to this comment
        await Comment.deleteMany({ parentComment: commentId });
        res.status(200).json({ message: "Comment deleted successfully" });
        
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: "Failed to delete comment", error: error.message });
    }
};

module.exports = {
    addComment,
    getCommentsByPost,
    deleteComment,
    getAllComments,
};