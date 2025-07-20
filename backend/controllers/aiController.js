// const { GoogleGenAI } = require("@google/genai");
// const {
//     blogPostIdeasPrompt,
//     generateReplyPrompt,
//     blogSummaryPrompt,
// } = require("../utils/prompts");

// // Initialize Google GenAI client
// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// });

// // Function to generate a blog post using AI

// // @route POST /api/ai/generate
// // @access Private
// const generateBlogPost = async (req, res) => {
//     try{

//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// // Function to generate blog post ideas
// // @route POST /api/ai/generate-ideas
// // @access Private
// const generatBlogPostIdeas = async (req, res) => {
//     try{

//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };
// // Function to generate a comment reply using AI
// // @route POST /api/ai/generate-reply
// // @access Private
// const generateCommentReply = async (req, res) => {
//     try{

//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };
// // Function to generate a blog post summary using AI
// // @route POST /api/ai/generate-summary
// // @access Private
// const generateBlogPostSummary = async (req, res) => {
//     try{

//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// module.exports = {
//     generateBlogPost,
//     generatBlogPostIdeas,
//     generateCommentReply,
//     generateBlogPostSummary
// };


const { GoogleGenerativeAI } = require("@google/generative-ai"); // Fixed: correct package

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Fixed: correct initialization

// Function to generate a blog post using AI
// @route POST /api/ai/generate
// @access Private
const generateBlogPost = async (req, res) => {
    try{
        const { topic, keywords, tone = 'professional' } = req.body;

        if (!topic) {
            return res.status(400).json({ message: 'Topic is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Write a comprehensive blog post about "${topic}". 
        ${keywords ? `Include these keywords: ${keywords.join(', ')}` : ''}
        Tone: ${tone}
        
        Structure the post with:
        1. Engaging title
        2. Introduction
        3. Main content with subheadings
        4. Conclusion
        5. Suggested tags`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            content: text,
            topic,
            tone
        });

    } catch (error) {
        console.error('Error generating blog post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Function to generate blog post ideas
// @route POST /api/ai/generate-ideas
// @access Private
const generateBlogPostIdeas = async (req, res) => { // Fixed: corrected function name
    try{
        const { niche, count = 5 } = req.body;

        if (!niche) {
            return res.status(400).json({ message: 'Niche is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate ${count} creative blog post ideas for the "${niche}" niche. 
        For each idea, provide:
        - Catchy title
        - Brief description (2-3 sentences)
        - Target audience
        - Suggested keywords`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            niche,
            ideas: text,
            count
        });

    } catch (error) {
        console.error('Error generating blog ideas:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Function to generate a comment reply using AI
// @route POST /api/ai/generate-reply
// @access Private
const generateCommentReply = async (req, res) => {
    try{
        const { comment, tone = 'friendly', context } = req.body;

        if (!comment) {
            return res.status(400).json({ message: 'Comment is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate a ${tone} reply to this comment: "${comment}"
        ${context ? `Context: ${context}` : ''}
        
        Make the reply:
        - Helpful and engaging
        - Professional but ${tone}
        - 1-2 sentences long
        - Encouraging further discussion`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text();

        res.json({
            success: true,
            reply: reply.trim(),
            originalComment: comment,
            tone
        });

    } catch (error) {
        console.error('Error generating reply:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Function to generate a blog post summary using AI
// @route POST /api/ai/generate-summary
// @access Private
const generateBlogPostSummary = async (req, res) => {
    try{
        const { content, maxLength = 200 } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Summarize this blog post content in ${maxLength} characters or less:

        "${content}"

        Make the summary:
        - Concise and informative
        - Capturing key points
        - SEO-friendly
        - Engaging for readers`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        res.json({
            success: true,
            summary: summary.trim(),
            originalLength: content.length,
            summaryLength: summary.trim().length
        });

    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    generateBlogPost,
    generateBlogPostIdeas, // Fixed: corrected export name
    generateCommentReply,
    generateBlogPostSummary
};
