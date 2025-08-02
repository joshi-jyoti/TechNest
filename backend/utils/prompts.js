const blogPostIdeasPrompt = (topic) =>`
    Generate 5 unique blog post ideas based on the topic: ${topic}.
For each blog post idea return the following details:
1. Title: A catchy and engaging title for the blog post.
2. Description: A brief description of the blog post content.
3. Keywords: A list of relevant keywords for SEO optimization.
4. the tone: The tone of the blog post (e.g., technical,casual, beginner-friendly, etc.)
5. Target Audience: The intended audience for the blog post (e.g., developers, marketers, etc.).

Return the ideas in JSON format with the following structure:

[
    {
        "title": "",
        "description": "",
        "keywords": [],
        "tone": "",
        "targetAudience": ""
    }
]
Important: Do NOT add any extra text outside the JSON format. Only  return  VAILD JSON.
`;

function generateReplyPrompt(comment) {
    // Extract author name safely
    let authorName = "Reader";
    
    if (comment.author) {
        if (typeof comment.author === 'string') {
            authorName = comment.author;
        } else if (comment.author.name) {
            authorName = comment.author.name;
        }
    }
    
    const content = comment.content.toLowerCase();
    
    // Check if user is requesting content creation
    const contentRequests = [
        'create a post', 'write a post', 'make a post', 'can you create', 'can you write', 
        'write about', 'create about', 'post on', 'post about', 'blog about', 'blog on'
    ];
    
    const isContentRequest = contentRequests.some(request => content.includes(request));
    
    if (isContentRequest) {
        // Extract the topic from the request
        let topic = comment.content
            .replace(/can you |could you |please |write |create |make |a post |about |on |the |topic |blog /gi, '')
            .trim();
        
        // Simplified response for content requests
        return `Write a brief, friendly reply to ${authorName} who requested a post about "${topic}". 
        
        The reply should:
        - Start with "Hi ${authorName},"
        - Acknowledge it's a great suggestion
        - Briefly explain what ${topic} is in simple terms (4-5 sentences)
        - Say you'll consider creating content on this topic
        - Thank them for the idea
        - Keep it conversational and natural
        - show basic details, commands related to the topic 
        - NO markdown formatting, NO code snippets, NO technical symbols
        - Write in plain text only
        
        Keep the entire response to 4-5 sentences maximum.`;
    }
    
    // Regular comment reply
    return `You are replying to a blog comment by ${authorName}. The comment is: "${comment.content}".
    
    Write a thoughtful, friendly reply that:
    - Starts with "Hi ${authorName},"
    - Addresses the comment content specifically
    - Is professional but warm
    - Is concise (1-2 sentences)
    - Encourages further engagement
    
    Return ONLY the reply text without any JSON formatting, quotes, or extra structure.`;
}

const blogSummaryPrompt = (blogContent) => (`
    You are an AI assistant that summarizes blog posts.

    Instructions:
     - Read the blog post content below.
     - Generate a short , catchy ,SEO-friendly title (max 15 words).
     - Write a clear engaging summary  of about 300 words.
     - At the end of the summary, add a markdown section titled **## What You'll Learn**.
     - Under that heading, list 3-5 keys takeaways or skills that reader will learn in **bullet points** using markdown (\`-\`).

     Return the result in **valid JSON format** with the following structure:
     {
        "title": "Short SEO-friendly title",
        "summary": "300-word summary with a markdown section for what You'll Learn"
     }

     only return valid JSON. Do not include markdown or code blocks around the JSON.
        Blog Post Content: ${blogContent}
`);

module.exports = {
    blogPostIdeasPrompt,
    generateReplyPrompt,
    blogSummaryPrompt
};
