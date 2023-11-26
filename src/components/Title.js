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
    </div>
  );
}

export default Title;
