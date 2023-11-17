import React from "react";
import "./css/Title.css";
import squareg from "./SquareG.jpg"

function Title() {
  return (
    <div>
      <div className="Title">
        <img src={squareg} alt="Logo" />
        <h2>Am I Done?</h2>
        <h5>Your AI-Powered Marketing and Editorial Assistant</h5>
      </div>
      <div className="introText">
        <p><em><b>Am I Done?</b></em> analyzes your work to see if it is complete:</p>
        <ul>
          <li>Does it speak to the audience you're targeting?</li>
          <li>Do the key takeaways align with the points you want to make?</li>
          <li>Does the title properly position the thought leadership?</li>
        </ul>
        <p>In addition, <em><b>Am I Done?</b></em> drafts language that you can use to promote your work via email, on social and digital media, and on your firm website.</p>
      </div >
    </div>
  );
}

export default Title;
