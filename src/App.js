import React, { Component } from "react";
import "./App.css";
import RequestData from "./components/request";
import ResponseDisplayForm from "./components/response";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestData: {
        title: "",
        copy: "",
        points: "",
      },
      response: "",
    };
  }

  handleRequestData = (data) => {
    this.setState({ requestData: data });
  };

  handleResponse = (response) => {
    this.setState({ response });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Am I Done?</h1>
          <RequestData
            onRequestData={this.handleRequestData}
            onResponse={this.handleResponse}
          />
          <ResponseDisplayForm
            requestData={this.state.requestData}
            response={this.state.response}
          />
        </header>
      </div>
    );
  }
}

export default App;
