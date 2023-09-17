import React, { Component } from "react";

class ResponseDisplayForm extends Component {
  render() {
    const { response } = this.props;

    return (
      <div>
        {response && (
          <div>
            <h2>ChatGPT Response</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    );
  }
}

export default ResponseDisplayForm;
