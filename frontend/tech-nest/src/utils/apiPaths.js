export const BASE_URL = 'http://localhost:8000';
export const API_PATHS = {
    AUTH: {
        REGISTER: '/api/auth/register', // Register a new user
        LOGIN: '/api/auth/login', // Authenticate user & return JWT token
        GET_PROFILE: '/api/auth/profile', // Get user profile, logged in user details
    },
    IMAGE: {
        UPLOAD_IMAGE: '/api/image/upload-image', // Upload an image
    },
    DASHBOARD: {
        GET_DASHBOARD_DATA: '/api/dashboard-summary', // Get dashboard data
    },  
    AI: {
        GENERATE_BLOG_POST: '/api/ai/generate', // Generate a blog post
        GENERATE_BLOG_IDEAS: '/api/ai/generate-ideas', // Generate blog post ideas
        GENERATE_COMMENT_REPLY: '/api/ai/generate-reply', // Generate a comment reply
        GENERATE_BLOG_SUMMARY: '/api/ai/generate-summary', // Generate a blog post summary
    },
    POSTS:{
        CREATE : '/api/posts', // Create a new blog post (ADMIN only)
        GET_ALL: '/api/posts', // Get all blog posts
        GET_TRENDING_POSTS: '/api/posts/trending', // Get trending blog posts
        GET_BY_SLUG: (slug) => `/api/posts/slug/${slug}`, // Get a blog post by slug
        UPDATE: (id) => `/api/posts/${id}`, // Update a blog post by ID
        DELETE: (id) => `/api/posts/${id}`, // Delete a blog post by ID
        GET_BY_TAG : (tag) => `/api/posts/tag/${tag}`, // Get blog posts by tag
        SEARCH: '/api/posts/search', // Search blog posts by title or content
        INCREMENT_VIEWS: (id) => `/api/posts/${id}/views`, // Increment views for a blog post
        LIKE: (id) => `/api/posts/${id}/like`, // Like a blog post
    },
    COMMENTS: {
        ADD: (postId) => `/api/comments/${postId}`, // Add a comment to a blog post
        GET_ALL: '/api/comments', // Get all comments
        GET_ALL_BY_POST: (postId) => `/api/comments/${postId}`, // Get all comments for a blog post
        DELETE: (commentId) => `/api/comments/${commentId}`, // Delete a comment by ID
    },
};