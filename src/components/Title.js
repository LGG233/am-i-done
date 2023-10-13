import React from "react";
import "./css/Title.css";
import ggheader from "./header.jpg";
import Selectors from "./selectors";

function Title() {
  return (
    <div className="Title">
      <img src={ggheader} alt="Logo" />
      <h1>Am I Done?</h1>
      <h4>Your Virtual Content Strategy Assistant</h4>
      <Selectors />
    </div>
  );
}

export default Title;
