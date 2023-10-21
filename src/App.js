import React, { Component } from "react";
import "./App.css";
import RequestData from "./components/request";
import ResponseDisplayForm from "./components/response";
import Title from "./components/Title";
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
          <Title />
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
