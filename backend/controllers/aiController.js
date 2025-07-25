const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate a blog post using AI
// @route POST /api/ai/generate
// @access Private
const generateBlogPost = async (req, res) => {
    try{
        const { title, tone } = req.body;
        
        if (!title || !tone) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fixed: updated model name

        const prompt = `Write a comprehensive markdown-formatted blog post titled "${title}" with a ${tone} tone.Include an introduction, main content with subheadings, and a conclusion. 
        
        Structure:
        - Introduction
        - Main content with subheadings
        - Code examples if relevant
        - Conclusion
        - Make it engaging and informative`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // res.status(200).json({
        //     success: true,
        //     title,
        //     content: text,
        //     tone
        // });
        res.status(200).json(text);

    } catch (error) {
        console.error('Error generating blog post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Function to generate blog post ideas
// @route POST /api/ai/generate-ideas
// @access Private
const generateBlogPostIdeas = async (req, res) => {
    try{
        const { niche, count = 5 } = req.body;

        if (!niche) {
            return res.status(400).json({ message: 'Niche is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fixed: updated model name

        const prompt = `Generate ${count} creative and engaging blog post ideas for the "${niche}" niche.
        
        For each idea, provide:
        - Catchy title
        - Brief description (2-3 sentences)
        - Target audience
        - Suggested keywords`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const ideas = response.text();

        res.status(200).json({
            success: true,
            niche,
            ideas,
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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fixed: updated model name

        const prompt = `Generate a ${tone} and helpful reply to this comment: "${comment}"
        ${context ? `Context: ${context}` : ''}
        
        Make the reply:
        - Professional but ${tone}
        - Helpful and engaging
        - 1-2 sentences long`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text();

        res.status(200).json({
            success: true,
            reply: reply.trim(),
            originalComment: comment,
            tone
        });

    } catch (error) {
        console.error('Error generating comment reply:', error);
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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fixed: updated model name

        const prompt = `Summarize this blog post content in ${maxLength} characters or less:

        "${content}"

        Make the summary:
        - Concise and informative
        - Captures the main points
        - SEO-friendly`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        res.status(200).json({
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
    generateBlogPostIdeas,
    generateCommentReply,
    generateBlogPostSummary
};
