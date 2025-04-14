import axios from "axios";

export const sendToOpenAI = async (messages) => {
    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-4",
            messages,
            temperature: 0.7,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            },
        }
    );

    return response.data.choices[0].message.content.trim();
};