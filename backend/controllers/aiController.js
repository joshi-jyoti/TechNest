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
        const { topics } = req.body;

        if (!topics) {
            return res.status(400).json({ message: 'Topics is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fixed: consistent model

        const prompt = blogPostIdeasPrompt(topics);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();

        try {
            const cleanedText = rawText
                .replace(/^```json\s*/, "")
                .replace(/```$/, "")
                .trim();

            const data = JSON.parse(cleanedText);
            res.status(200).json(data);

        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
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
        const { author, content } = req.body;
        if(!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // Extract the author name properly
        let authorName;
        if (typeof author === 'string') {
            authorName = author;
        } else if (author && author.name) {
            authorName = author.name;
        } else {
            authorName = "Reader";
        }
        
        // Create comment object with extracted name
        const comment = {
            author: { name: authorName },
            content: content
        };
        
        const prompt = generateReplyPrompt(comment);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();
        
        // Return plain text without JSON wrapping
        res.status(200).send(rawText.trim());

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
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const prompt = blogSummaryPrompt(content);
        const result = await genAI.getGenerativeModel({ model: "gemini-2.5-flash" }).generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();
        
        const cleanedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim();
            
        // Attempt to parse the cleaned text as JSON
        const data = JSON.parse(cleanedText);
        res.status(200).json(data);
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
