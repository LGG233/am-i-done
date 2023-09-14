import React from "react";

const ResponseDisplayForm = ({ requestData, response }) => {
  return (
    <div>
      <h2>User Input Data</h2>
      <p>Title: {requestData.title}</p>
      <p>Copy: {requestData.copy}</p>
      <p>Takeaways: {requestData.points}</p>

      {response && (
        <div>
          <h2>ChatGPT Response</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplayForm;
