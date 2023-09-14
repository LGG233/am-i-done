import React, { Component } from "react";

class RequestData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      points: "",
      title: "",
      copy: "",
      data: [],
    };
  }
}

const Request = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Submitted Info: ${this.state.articleTitle}`);
  };

  const handleChange = (event) => {
    let target = event.target;
    let name = target.name;
    this.setState({
      [name]: event.target.value,
    });
  };

  const handleCancel = (event) => {
    window.location.replace("./components/request");
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="QueryForm">
          <form className="FormField">
            <label for="articleTitle">Title: </label>
            <input
              type="text"
              className="form-control"
              id="articleTitle"
              name="articleTitle"
              value={this.state.articleTitle}
              onChange={this.handleChange}
            />
          </form>
          <button onClick={handleSubmit}>Submit</button>
          <br></br>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Request;
