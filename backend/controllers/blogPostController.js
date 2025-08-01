const BlogPost = require('../models/BlogPost');
const mongoose = require('mongoose');

// Function to create a new blog post
// @route POST /api/posts
// @desc Create a new blog post
const createPost = async (req, res) => {
    try{
        const { title, content, coverImageUrl, tags, isDraft, generatedByAI } = req.body;

        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const newPost = new BlogPost({
            title,
            slug,
            content,
            coverImageUrl,
            tags,
            author: req.user._id, // Assuming req.user is populated with the authenticated user's info
            isDraft,
            generatedByAI,
        });
        await newPost.save();
        res.status(201).json({
            message: 'Post created successfully',
            post: newPost,
        });

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to update an existing blog post
// @route PUT /api/posts/:id
// @desc Update a blog post by ID
const updatePost = async (req, res) => {
    try{
        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if( post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }
        const updatedData = req.body;
        if (updatedData.title) {
            updatedData.slug = updatedData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json(updatedPost);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to delete a blog post
// @route DELETE /api/posts/:id
// @desc Delete a blog post by ID
const deletePost = async (req, res) => {
    try{
        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get all blog posts
// @route GET /api/posts?status=published|draft|all&page=1
//@access Public
const getAllPosts = async (req, res) => {
    try{
        const status = req.query.status || 'published';
        const page = parseInt(req.query.page) || 1;
        const limit = 5; // Number of posts per page
        const skip = (page - 1) * limit;

        //determine the filter for main posts responsee
        let filter = {};
        if (status === 'published') {
            filter.isDraft = false;
        }
        else if (status === 'draft') {
            filter.isDraft = true;
        }
        // fetch paginated posts
        const posts = await BlogPost.find(filter)
        .populate("author", "name profileImageUrl")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);
        // count total posts for pagination
        const [totalCount, allCount, publishedCount, draftCount] = await Promise.all([
            BlogPost.countDocuments(filter),
            BlogPost.countDocuments(),
            BlogPost.countDocuments({ isDraft: false }),
            BlogPost.countDocuments({ isDraft: true }),
        ]);
        res.json({
            posts,
            page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            counts: {
                all: allCount,
                published: publishedCount,
                draft: draftCount,
            },
        });


    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get a blog post by its slug
// @route GET /api/posts/slug/:slug
const getPostBySlug = async (req, res) => {
    try{
        const post = await BlogPost.findOne({ slug: req.params.slug })
            .populate("author", "name profileImageUrl");
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // respond with the post data
        res.json(post);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get blog posts by tag
// @route GET /api/posts/tag/:tag
const getPostsByTag = async (req, res) => {
    try{
        const posts = await BlogPost.find({ tags: req.params.tag, isDraft: false })
            .populate("author", "name profileImageUrl")
            .sort({ createdAt: -1 });
        
        res.json(posts); // Fixed: moved this line outside the query chain
        
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to search blog posts
// @route GET /api/posts/search?q=searchTerm
const searchPosts = async (req, res) => {
    const q= req.query.q || '';
    const posts = await BlogPost.find({
        isDraft: false,
        $or: [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } },
            { tags: { $regex: q, $options: 'i' } }
        ],
    })
    .populate("author", "name profileImageUrl");
    res.json(posts);
    try{

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Function to increment views of a blog post
// @route POST /api/posts/:id/view
const incrementView = async (req, res) => {
    try{
        await BlogPost.findByIdAndUpdate(req.params.id, 
            { $inc: { views: 1 } });
        res.json({ message: 'View incremented successfully' });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Function to like a blog post 
// @route POST /api/posts/:id/like
const likePost = async (req, res) => {
    try{
        await BlogPost.findByIdAndUpdate(req.params.id, {$inc: { likes: 1 } });
        res.json({ message: 'Post liked successfully' });
           
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Function to get top trending blog posts
// @route GET /api/posts/trending
//@access private
const getTopPosts = async (req, res) => { 
    try{
        const posts = await BlogPost.find({ isDraft: false })
            .sort({ views: -1, likes: -1 }) // Sort by views and likes
            .limit(5) // Limit to top 10 posts
            .populate("author", "name profileImageUrl");
        
        res.json(posts);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    } 
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostBySlug,
    getPostsByTag,
    searchPosts,
    incrementView,
    likePost,
    getTopPosts
};