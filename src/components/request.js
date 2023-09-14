import React, { Component } from "react";
import axios from "axios";

class RequestData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleTitle: "",
      articleCopy: "",
      totalPoints: "",
      data: [],
    };
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`Submitted Title: ${this.state.articleTitle}`);
    console.log(this.state);
    const requestData = {
      title: this.state.articleTitle,
      copy: this.state.articleCopy,
      points: this.state.totalPoints,
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/davince/completions", // MUST MODIFY TO GET CORRECT ENDPOINT. ALSO FIGURE OUT TOKENS IN PROMPT AND COMPLETION...
        {
          prompt: `Please respond to the following questions: 1) who should read the following article, 2) what are the ${requestData.points} most salient takeaways of the piece? ${requestData.copy}`,
          max_tokens: 50, // Adjust as needed
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      const generatedResponse = response.data.choices[0].text;

      console.log("Generated Response:", generatedResponse);
    } catch (error) {
      console.error("Error sending request to ChatGPT:", error);
    }
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
