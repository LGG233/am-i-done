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
  return (
    <div>
      <div className="container-fluid">
        <div className="QueryForm">
          <form className="FormField">
            <label for="totalPoints"># of Salient Points: </label>
            <input
              type="number"
              className="form-control"
              id="totalPoints"
              name="totalPoints"
              // value={this.state.totalPoints}
            />
            <br></br>
            <label for="articleCopy">Content: </label>
            <input
              type="text"
              className="form-control"
              id="articleCopy"
              name="articleCopy"
              // value={this.state.articleCopy}
            />
            <br></br>
            <label for="articleTitle">Title: </label>
            <input
              type="text"
              className="form-control"
              id="articleTitle"
              name="articleTitle"
              // value={this.state.articleTitle}
            />
          </form>
          <button>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Request;
