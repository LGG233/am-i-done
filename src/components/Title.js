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
        <p><em>Am I Done?</em> analyzes your work to see if it is complete:</p>
        <ul>
          <li>Does it speak directly to the audience you hope to reach?</li>
          <li>Do the key takeaways align with the points you want to make?</li>
          <li>Does the title properly position the article to resonate with your intended audience?</li>
        </ul>
        <p>In addition, <em>Am I Done?</em> drafts material that you can use to promote your work via email, on social and digital media, and on your firm website.</p>
      </div >
    </div>
  );
}

export default Title;
