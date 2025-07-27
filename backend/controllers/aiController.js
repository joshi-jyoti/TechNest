const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
    blogPostIdeasPrompt,
    generateReplyPrompt,
    blogSummaryPrompt,
} = require("../utils/prompts"); // Fixed: Added missing import

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate a blog post using AI
// @route POST /api/ai/generate
// @access Private
const generateBlogPost = async (req, res) => {
    try{
        const { title, tone = 'professional' } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fixed: consistent model

        const prompt = `Write a comprehensive markdown-formatted blog post titled "${title}" with a ${tone} tone. 
        
        Structure:
        - Introduction
        - Main content with subheadings
        - Code examples if relevant
        - Conclusion
        - Make it engaging and informative`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            success: true,
            title,
            content: text,
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
const generateBlogPostIdeas = async (req, res) => {
    try{
        const { topics } = req.body; // Changed to match your frontend

        if (!topics) {
            return res.status(400).json({ message: 'Topics is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Fixed: consistent API usage

        const prompt = blogPostIdeasPrompt(topics); // Now this function is imported

        const result = await model.generateContent(prompt); // Fixed: proper API usage
        const response = await result.response;
        const rawText = response.text();

        try {
            const cleanedText = rawText
                .replace(/^```json\s*/, "") // remove starting ```json
                .replace(/```$/, "") // remove ending ```
                .trim(); // remove any leading/trailing whitespace

            // Parse as JSON
            const data = JSON.parse(cleanedText);
            res.status(200).json(data);
            // res.status(200).json({
            //     success: true,
            //     topics,
            //     ideas: Array.isArray(data) ? data : [data]
            // });

        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            // Fallback response
            res.status(200).json({
                success: true,
                topics,
                ideas: rawText,
                note: "Response was not in JSON format"
            });
        }

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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fixed: consistent model

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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fixed: consistent model

        const prompt = blogSummaryPrompt(content); // Using the imported prompt function

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();

        try {
            const cleanedText = rawText
                .replace(/^```json\s*/, "")
                .replace(/```$/, "")
                .trim();

            const summaryData = JSON.parse(cleanedText);

            res.status(200).json({
                success: true,
                title: summaryData.title,
                summary: summaryData.summary,
                originalLength: content.length,
                summaryLength: summaryData.summary.length
            });

        } catch (parseError) {
            // Fallback if JSON parsing fails
            res.status(200).json({
                success: true,
                summary: rawText.trim(),
                originalLength: content.length,
                summaryLength: rawText.trim().length
            });
        }

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
