import React, { Component } from "react";

class ResponseDisplayForm extends Component {
  render() {
    const { response } = this.props;
    return (
      <div>
        {response && (
          <div>
            <h2>ChatGPT Response</h2>
            <p>{JSON.stringify(response, null, 2)}</p>
          </div>
        )}
      </div>
    );
  }
}

export default ResponseDisplayForm;
