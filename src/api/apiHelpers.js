import axios from "axios";

const baseUrl = "https://api.openai.com/v1/chat/completions";

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
};

export const analyzeAudienceApi = async (articleCopy, articleTitle, language) => {
    const content = `You are the Chief Marketing Officer of one of the world's largest law firms. You have deep experience helping lawyers develop thought leadership that resonates with highly specific professional audiences.

Please complete the following tasks:

1. Based on the article below, identify the occupations of the intended audience. Be specific — avoid vague terms like "legal professionals." Use clear, professional job titles (e.g., “general counsel,” “compliance officers,” “policy advisors”). Provide this as a single sentence.

2. Analyze the article’s clarity and positioning for that audience:
   - Does the **title** — "${articleTitle}" — clearly signal who the article is for?
   - Does the **introduction and framing** support the intended audience?
   - If the article is geographically specific, is that clear in the title and body?
   - How could the title and article better target the intended audience?
   - Does the title explain why those people should read the piece?

Write clearly and concisely. Avoid generic filler or repetition. Provide specific, constructive insights.

Here is the article:
\`\`\`
${articleCopy}
\`\`\`

Your response must be provided in "${language}".`;

    const response = await axios.post(
        baseUrl,
        {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "user", content },
            ],
        },
        { headers }
    );

    return response.data.choices[0].message.content;
};

export const keyTakeawaysApi = async (articleCopy, articleTitle, language) => {
    const content = `You are the CMO of one of the top law firms in the country. You are reviewing a draft of legal thought leadership intended for a professional audience.

 Please perform the following tasks:
              
1. Read the text below carefully: 
\`\`\`
${articleCopy}
\`\`\`

2. Identify the **five most important takeaways** — the key points or conclusions the article communicates to its intended audience.

3. **Summarize each takeaway in a single, clear, concise sentence.**

4. Provide your answer as a **numbered list with exactly five items**.

**Important:** Do not repeat or rephrase the same idea. Do not include additional explanation, elaboration, or a second sentence for each item. Each takeaway must be one sentence only.
              
Your response must be provided in "${language}".`;

    const response = await axios.post(
        baseUrl,
        {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "user", content },
            ],
        },
        { headers }
    );

    return response.data.choices[0].message.content;
};

export const altTitlesApi = async (articleCopy, articleTitle, language) => {
    const content = `You are the CMO of one of the top law firms in the country. You want to guide your lawyers to produce solutions-oriented thought leadership that is clear, concise, and directly relevant to clients.

Please perform the following tasks:
              
1. Read the text below: 
\`\`\`
${articleCopy}
\`\`\`

2. Based on the article's content, tone, and intended audience, propose **three strong titles** that meet all of the following criteria:
   - Clearly imply **who should read** the article (e.g., general counsel, compliance officers, investors)
   - Convey **why** it matters to that audience
   - Avoid generic terms like “legal professionals” or “stakeholders”
   - Avoid overly broad or academic phrasing
              
3. Format each title as follows:
   - Enclose the title in quotation marks
   - Add a single sentence explaining why it was proposed
   - Separate the title from the explanation using two hyphens, like this: --
   - Do **not** include line breaks between titles
              
4. Provide the output as a **numbered list**.
              
5. If no title is provided with the article, assume the author is seeking new title suggestions and proceed accordingly.
              
Your response must be provided in "${language}".`;

    const response = await axios.post(
        baseUrl,
        {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "user", content },
            ],
        },
        { headers }
    );

    return response.data.choices[0].message.content;
};

export const emailSynopsisApi = async (articleCopy, articleTitle, language) => {
    const content = `You are the Chief Marketing Officer of a leading law firm. Your role is to review legal thought leadership before publication on the firm’s website.

Write a 150-word abstract for the article below. Your goal is to entice the right audience to click through and read the full piece.
              
Follow these instructions carefully:
1. Use clear, compelling, and professional language suitable for a website.
2. Clearly indicate who the article is for and why that audience should care.
3. Do not include first-person language or phrases like “As the CMO...” — this is not a personal message.
4. Write in the third person.
5. Do not summarize every detail. Focus on what will make the right reader want to click.
              
Here is the article:
\`\`\`
${articleCopy}
\`\`\`

Your response must be provided in "${language}".`

    const response = await axios.post(
        baseUrl,
        {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "user", content },
            ],
        },
        { headers }
    );

    return response.data.choices[0].message.content;
};

export const socialMediaPostApi = async (articleCopy, articleTitle, language) => {
    const content = `You are the Chief Marketing Officer of a top-tier law firm. You are writing three promotional posts for Twitter/X to accompany a piece of legal thought leadership.

Each post must:
1. Clearly convey the **core insight or value** of the article in professional, compelling language.
2. Be phrased naturally — avoid repeating phrases like "Stay informed" or "Learn how" across posts.
3. Avoid directly addressing the audience (e.g., no “you,” “general counsel,” or “compliance officers”).
4. Use no more than **120 characters total**, including hashtags.
5. Include at least **three relevant professional hashtags** (e.g., #CFTC, #Compliance, #FraudPrevention).
6. Return the output as a **numbered list** (1, 2, 3), with no intro or closing lines.

Here is the article:
\`\`\`
${articleCopy}
\`\`\`

Your response must be provided in "${language}".`;

    const response = await axios.post(
        baseUrl,
        {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "user", content },
            ],
        },
        { headers }
    );

    return response.data.choices[0].message.content;
};

export const linkedInPostApi = async (articleCopy, articleTitle, language) => {
    const content = `You are the Chief Marketing Officer of a leading law firm. You are preparing a LinkedIn post to promote a piece of legal thought leadership written for a professional audience.

Follow these instructions carefully:

1. Write a clear and substantive summary of the article, no more than 150 words.
2. Do not begin with phrases like “This article” or “Discover.” Instead, focus directly on the content.
3. Convey what the article covers, using precise, informative language.
4. Avoid salesy phrasing such as “Gain insight” or “Stay informed.”
5. Include who the article is relevant for, based on the content.
6. End with 2-3 professional hashtags.

The content should be informative, confident, and editorial in tone — not promotional or conversational.

Here is the article:
\`\`\`
${articleCopy}
\`\`\`

Your response must be provided in "${language}".`;

    const response = await axios.post(
        baseUrl,
        {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "user", content },
            ],
        },
        { headers }
    );

    return response.data.choices[0].message.content;
};

export const websiteAbstractApi = async (articleCopy, articleTitle, language) => {
    const content = `You are the Chief Marketing Officer of a leading law firm, reviewing legal thought leadership for publication on the firm’s website.

Write a clear, professional 150-word abstract that summarizes the substance of the article below. Follow these instructions carefully:

1. Focus on **what the article says** — not what “the article” *is*. Do not begin with phrases like “This article discusses…” or “The article covers…”.
2. Do **not** reference the article itself at all. Just convey the content directly, as if you are reporting the facts or explaining the topic to a colleague.
3. Use a neutral, informative tone — not promotional or salesy.
4. Include relevant legal, regulatory, or policy details as needed, but keep it concise and digestible.
5. Convey why the topic matters implicitly through substance, not by directly saying "this is important" or "you should read this."

Here is the article:
\`\`\`
${articleCopy}
\`\`\`

Your response must be provided in "${language}".`;

    const response = await axios.post(
        baseUrl,
        {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "user", content },
            ],
        },
        { headers }
    );

    return response.data.choices[0].message.content;
};

export const taggingSuggestionsApi = async (articleCopy, articleTitle, language) => {
    const content = `You are the Chief Marketing Officer of one of the world’s largest law firms. You are reviewing the following article to determine how it should be categorized for marketing, website tagging, and CRM purposes.

Follow these instructions:
              
1. Read the article and identify the five most relevant law firm **practice groups**.
2. Identify the five most relevant **industry groups**.
3. Provide your response in two clearly labeled lists:
   - Practice Groups — e.g., Litigation, Mergers & Acquisitions, Data Privacy
   - Industry Groups — e.g., Healthcare, Financial Services, Technology
              
Here is the article:
\`\`\`
${articleCopy}
\`\`\`

Your response must be provided in "${language}".`;

    const response = await axios.post(
        baseUrl,
        {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "user", content },
            ],
        },
        { headers }
    );

    return response.data.choices[0].message.content;
};
