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
    };
  }

  handleRequestData = (data) => {
    this.setState({ requestData: data });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Am I Done?</h1>
        </header>
        <RequestData onRequestData={this.handleRequestData} />
        <ResponseDisplayForm requestData={this.state.requestData} />
      </div>
    );
  }
}

export default App;
