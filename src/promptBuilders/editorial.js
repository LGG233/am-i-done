// promptBuilders/editorial.js

export const analyzeAudiencePrompt = async (articleCopy, articleTitle, language) => {
  return `You are a law firm Chief Marketing Officer (CMO). Read the legal article below.

Identify ONLY the intended audience based on tone, vocabulary, and subject matter.

- DO NOT summarize or describe the article.
- DO NOT comment on the article's writing quality, clarity, or structure.
- DO NOT explain the article's topic or background.
- Focus ONLY on who the likely readers are.
- Phrase your answer as a short, strategic description.
- Limit to 50–75 words.

Your response must be in "${language}".

\`\`\`
${articleCopy}
\`\`\``;
};

export const keyTakeawaysPrompt = async (articleCopy, articleTitle, language) => {
  return `Review the legal article below and identify its three most important takeaways.

- List each takeaway as a separate numbered item.
- Use line breaks between each item.
- Keep each takeaway to one concise sentence.
- Do not add extra commentary or summary text.

Your response must be in "${language}".

\`\`\`
${articleCopy}
\`\`\``;
};

export const altTitlesPrompt = async (articleCopy, articleTitle, language) => {
  return `You are the CMO of one of the top law firms in the country. You want to guide your lawyers to produce solutions-oriented thought leadership that is clear, concise, and directly relevant to clients.
  
  Please perform the following tasks:
  1. Read the text below: 
  \`\`\`
  ${articleCopy}
  \`\`\`
  2. Infer the intended audience based on tone, vocabulary, and content. Do not discuss the intended audience.
  3. Based on the article's content, tone, and intended audience, propose **three strong titles** that:
     - Clearly imply **who should read** the article
     - Convey **why** it matters
     - Avoid generic terms and overly broad phrasing
  
  Return a **numbered list**, no line breaks between entries.
  
  Your response must be in "${language}".`;
};

export const websiteAbstractPrompt = async (articleCopy, articleTitle, language) => {
  return `You are reviewing legal thought leadership for publication on a law firm website.
  
  Write a concise 70-word abstract that:
  - Focuses on the substance (not the fact it’s an article)
  - Uses clear, neutral tone
  - Does not use first-person or phrases like "this article"
  - Implicitly conveys why it matters
  
  \`\`\`
  ${articleCopy}
  \`\`\`
  
  Your response must be in "${language}".`;
};