import React, { Component } from "react";

class RequestData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleTitle: "",
      totalPoints: "",
      articleCopy: "",
      data: [],
    };
  }
  handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Submitted Info: ${this.state.articleTitle}`);
    console.log(this.state);
    const requestData = {
      points: this.state.totalPoints,
      title: this.state.articleTitle,
      copy: this.state.articleCopy,
    };
    console.log(requestData);
  };

  handleChange = (event) => {
    let target = event.target;
    let name = target.name;
    this.setState({
      [name]: event.target.value,
    });
  };

  handleCancel = (event) => {
    window.location.replace("./components/request");
  };

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="QueryForm">
            <form className="FormField">
              <label htmlFor="articleTitle">Title: </label>
              <input
                type="text"
                className="form-control"
                id="articleTitle"
                name="articleTitle"
                value={this.state.articleTitle}
                onChange={this.handleChange}
              />
              <br></br>
              <label htmlFor="articleCopy">Content: </label>
              <input
                type="text"
                className="form-control"
                id="articleCopy"
                name="articleCopy"
                value={this.state.articleCopy}
                onChange={this.handleChange}
              />
              <br></br>
              <label htmlFor="totalPoints"># of Takeaways: </label>
              <input
                type="number"
                className="form-control"
                id="totalPoints"
                name="totalPoints"
                value={this.state.totalPoints}
                onChange={this.handleChange}
              />
            </form>
            <button onClick={this.handleSubmit}>Submit</button>
            <br></br>
            <button onClick={this.handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestData;
