import React from "react";

const ResponseDisplayForm = ({ requestData }) => {
  return (
    <div>
      <h2>User Input Data</h2>
      <p>Title: {requestData.title}</p>
      <p>Copy: {requestData.copy}</p>
      <p>Takeaways: {requestData.points}</p>
    </div>
  );
};

export default ResponseDisplayForm;
