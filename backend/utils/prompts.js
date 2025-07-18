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
    const authorName = comment.author?.name || "User";
    const content = comment.content;
    return `You are replying to a blog comment by ${authorName}. The comment is: "${content}".
    Write a thoughtful, concise reply to this comment.`;
}

const blogSummaryPrompt = (blogPost) => (`
    
    `)
