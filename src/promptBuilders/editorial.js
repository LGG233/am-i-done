// promptBuilders/editorial.js

export const analyzeAudiencePrompt = async (articleCopy, articleTitle, language) => {
    return `Please review the following legal article to assess its clarity, audience targeting, and strategic positioning. Provide specific and constructive feedback.
  
  Your response must be in "${language}".
  
  \`\`\`
  ${articleCopy}
  \`\`\``;
};

export const keyTakeawaysPrompt = async (articleCopy, articleTitle, language) => {
    return `Please read the article below and summarize its five most important takeaways. 
  Each takeaway must be one concise sentence. Avoid repetition, elaboration, or combining multiple ideas in one sentence.
  
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
  2. Based on the article's content, tone, and intended audience, propose **three strong titles** that:
     - Clearly imply **who should read** the article
     - Convey **why** it matters
     - Avoid generic terms and overly broad phrasing
  
  3. Format each title as:
     "Proposed Title" -- brief rationale
  
  Return a **numbered list**, no line breaks between entries.
  
  Your response must be in "${language}".`;
};

export const websiteAbstractPrompt = async (articleCopy, articleTitle, language) => {
    return `You are reviewing legal thought leadership for publication on a law firm website.
  
  Write a concise 150-word abstract that:
  - Focuses on the substance (not the fact it’s an article)
  - Uses clear, neutral tone
  - Does not use first-person or phrases like "this article"
  - Implicitly conveys why it matters
  
  \`\`\`
  ${articleCopy}
  \`\`\`
  
  Your response must be in "${language}".`;
};