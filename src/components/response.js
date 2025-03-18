import React, { Component } from "react";
import "./css/response.css"; // New CSS file for better styling

class ResponseDisplayForm extends Component {
  render() {
    const { response } = this.props;

    return (
      <div className="response-container">
        {response && (
          <div className="response-box">
            <h2 className="response-title">AI Analysis</h2>
            <div className="response-content">
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ResponseDisplayForm;