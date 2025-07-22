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
        Blog Post Content: ${blogContent}
`);
module.exports = {
    blogPostIdeasPrompt,
    generateReplyPrompt,
    blogSummaryPrompt
};
