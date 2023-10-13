async function fetchResponses(requestDataArray) {
  const apiPromises = requestDataArray.map(async (requestData, index) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Please respond to the following questions using bullet points and spaces to separate the individual answers: 1) Based on the languaged and framing of the subject, who is the intended audience of the piece as it is written? Provide an answer that is one single sentence, prefaced with "1. Target Audience:";  2) what are the ${requestData.points} most salient takeaways of "${requestData.copy}"?. Please preface this section with "2. Key Takeaways:"; 3) Based on the primary focus of the piece, please review the proposed title of "${requestData.title}". On a scale of 1 - 5, how well does title convey that it is targeting the audience identified in question 1? If '5', please respond with "The chosen title frames the audience well." If less than 5, please provide three alternative titles that may better articulate who should read the article, prefaced with “3. Potential Alternate Titles:”; 4) draft a 25-word synopsis of the piece with the title that the author can use to introduce the article in an email communication. Use the heading "4. Email Ready Synopsis:"; 5) please sum up the piece in a single sentence that will compel the target audience to read it with the header "5. Article Summary:";`,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      console.log(`Response ${index}:`, response);
      console.log(`Response Data ${index}:`, response.data);

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(`Error sending request ${index} to ChatGPT:`, error);
      return ""; // Return an empty string or handle the error as needed
    }
  });

  const responses = await Promise.all(apiPromises);

  return responses;
}

// Usage
const requestDataArray = [
  // Array of requestData objects
  {
    title: "Title 1",
    copy: "Copy 1",
    points: 3,
  },
  {
    title: "Title 2",
    copy: "Copy 2",
    points: 4,
  },
  // Add more requestData objects as needed
];

fetchResponses(requestDataArray)
  .then((responses) => {
    // Now you have an array of responses
    console.log("All Responses:", responses);

    // Update your component's state or render the responses in the DOM
  })
  .catch((error) => {
    console.error("Error fetching responses:", error);
  });
