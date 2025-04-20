// promptBuilders/marketing.js

export const emailSynopsisPrompt = async (articleCopy, articleTitle, language) => {
  return `You are the Chief Marketing Officer of a leading law firm. Your role is to review legal thought leadership before publication on the firm’s website.
  
  Write a 150-word abstract to entice the right audience to click through and read the full piece.
  
  Use third-person, avoid phrases like "This article," and focus on substance. Style the response as an email, to include 'Dear ______:' as the opening and 'Please don't hesitate to contact me if you have questions. Thank you.' as the closing.

  \`\`\`
  ${articleCopy}
  \`\`\`
  
  Your response must be in "${language}".`;
};

export const socialMediaPrompt = async (articleCopy, articleTitle, language) => {
  return `You are the Chief Marketing Officer of a top-tier law firm. Write three promotional Twitter/X posts for the article below.
  
  Each post must:
  - Capture the article's core insight
  - Be natural, not repetitive
  - Use no more than 120 characters
  - Include 3+ relevant hashtags
  
  \`\`\`
  ${articleCopy}
  \`\`\`
  
  Your response must be in "${language}".`;
};

export const linkedInPrompt = async (articleCopy, articleTitle, language) => {
  return `You are the CMO of a top law firm writing a LinkedIn post to promote a legal article.
  
  1. Summarize the content (≤150 words)
  2. Don't open with "This article"
  3. Identify the article's relevance and audience
  4. Use 2–3 hashtags
  
  Tone: confident, editorial, informative.
  
  \`\`\`
  ${articleCopy}
  \`\`\`
  
  Your response must be in "${language}".`;
};

export const taggingSuggestionsPrompt = async (articleCopy, articleTitle, language) => {
  return `You are the CMO of a top law firm. Read the article below and identify:
  
  1. Five relevant **practice groups**
  2. Five relevant **industry groups**
  
  Format as two lists:
  - Practice Groups — e.g., M&A, Data Privacy
  - Industry Groups — e.g., Healthcare, Tech
  
  \`\`\`
  ${articleCopy}
  \`\`\`
  
  Your response must be in "${language}".`;
};