import React from "react";
import "./css/Title.css";
import ggheader from "./header.jpg";
import Selectors from "./selectors";

function Title() {
  return (
    <div className="Title">
      <img src={ggheader} alt="Logo" />
      <h2>Am I Done?</h2>
      <h5>Your AI-Powered Content Strategy Assistant</h5>
      {/* <Selectors /> */}
    </div>
  );
}

export default Title;
