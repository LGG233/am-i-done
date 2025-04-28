// promptBuilders/marketing.js

export const emailSynopsisPrompt = async (articleCopy, articleTitle, language) => {
  return `You are the Chief Marketing Officer of a leading law firm. Your role is to review legal thought leadership before publication on the firm’s website.
  
  Write a 100-word abstract to entice the right audience to click through and read the full piece.
  
  1. Use third-person.
  2. Avoid phrases like "This article." 
  3. Focus on the substance and takeaways from the article. 
  4. Style the response as an email, to include 'Dear [______]:' as the opening and 'Please don't hesitate to contact me if you have questions. Thank you.' as the closing.
  5. Write the email in a conversational style, as if you were alterting a business contact to an issue that is critical for their success. 
  6. Do not be overly pedantic, as if you were lecturing the recipient, or expounding on an important issue before a crowd. 

  \`\`\`
  ${articleCopy}
  \`\`\`
  
  Your response must be in "${language}".`;
};

export const socialMediaPrompt = async (articleCopy, articleTitle, language) => {
  return `You are the Chief Marketing Officer of a top-tier law firm. Write three promotional Twitter/X/Bluesky posts for the article below.
  
  Each post must:
  - Capture the article's core insight
  - Be natural, not repetitive
  - Do NOT make reference to the article, as in "Our latest article..." or "Read our latest guide"
  - Use no more than 120 characters
  - Include 3+ relevant hashtags
  - Do not wrap the posts in quotation marks
  
  \`\`\`
  ${articleCopy}
  \`\`\`
  
  Your response must be in "${language}".`;
};

export const linkedInPrompt = async (articleCopy, articleTitle, language) => {
  return `You are the CMO of a top law firm writing a LinkedIn post to promote a legal article. Your objective is to draft a post that will entice people to click the link and read the article, so while the post must provide a single-sentence overview of the article but the goal of the post is to explain to the target audience - without using these words - WHY they should read it.  
  
  1. The post must be 100 words or fewer 
  2. Don't open with "This article"
  3. Communicate why the article is relevant to the inferred audience without using those words
  4. Use 2–3 hashtags
  5. Do not enclose the post in quotation marks. 
  6. Do NOT make reference to the article, as in "Our latest article..." or "Read our latest guide" 
  
  Tone: confident, editorial, informative.
  
  \`\`\`
  ${articleCopy}
  \`\`\`
  
  Your response must be in "${language}".`;
};

export const taggingSuggestionsPrompt = async (articleCopy, articleTitle, language) => {
  return `You are the CMO of a top law firm. Read the article below and identify:
  
  1. Five relevant **Practice Groups**
  2. Five relevant **Industry Groups**
  
Format your response like this:

**Practice Groups:**
1. [Practice Group 1]
2. [Practice Group 2]
3. [Practice Group 3]
4. [Practice Group 4]
5. [Practice Group 5]

**Industry Groups:**
1. [Industry Group 1]
2. [Industry Group 2]
3. [Industry Group 3]
4. [Industry Group 4]
5. [Industry Group 5]

**Important formatting rules:**
- Bold the section headings (**Practice Groups:** and **Industry Groups:**).
- Use numbered lists for the entries (1., 2., 3., etc.).
- Do not use bullet points for section titles.
- Keep the formatting clean and professional.
  
  \`\`\`
  ${articleCopy}
  \`\`\`
  
  Your response must be in "${language}".`;
};