import React from "react";

function Selectors({ selectedOption, handleOptionChange }) {
  return (
    <div className="Selectors">
      <div className="nav-radio-buttons">
        <label>
          <input
            type="radio"
            value="ReviewTitle"
            checked={selectedOption === "ReviewTitle"}
            onChange={handleOptionChange}
          />
          Review Title
        </label>
        <label>
          <input
            type="radio"
            value="AnalyzeAudience"
            checked={selectedOption === "AnalyzeAudience"}
            onChange={handleOptionChange}
          />
          Analyze Audience
        </label>
        <label>
          <input
            type="radio"
            value="ExtractTakeaways"
            checked={selectedOption === "ExtractTakeaways"}
            onChange={handleOptionChange}
          />
          Extract Takeaways
        </label>
        <label>
          <input
            type="radio"
            value="DraftSummary"
            checked={selectedOption === "DraftSummary"}
            onChange={handleOptionChange}
          />
          Draft Summary
        </label>
        <label>
          <input
            type="radio"
            value="CraftEmailLanguage"
            checked={selectedOption === "CraftEmailLanguage"}
            onChange={handleOptionChange}
          />
          Craft Email Language
        </label>
      </div>
    </div>
  );
}

export default Selectors;
