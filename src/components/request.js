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
      questionDisplay: true,
      responseDisplay: false,
      generatedResponse: "",
      isLoading: false,
      error: null,
    };
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true, questionDisplay: false });
    const requestData = {
      title: this.state.articleTitle,
      copy: this.state.articleCopy,
      points: this.state.totalPoints,
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Please respond to the following questions: 1) Based on the subject and style, who should read the article?,  2) what are the ${requestData.points} most salient takeaways of "${requestData.copy}"?, 3) Based on best SEO practices and the primary focus of the piece, please review the proposed title of "${requestData.title}" and provide three alternative titles that may attract more readers, and 4) draft a 200-word synopsis of the piece in the first person plural with the title: "Draft Synopsis".`,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      console.log(response);
      console.log("Response Data:", response.data);

      const generatedResponse = response.data.choices[0].message.content;

      console.log("Generated Response:", generatedResponse);
      this.setState({ isLoading: false, responseDisplay: true });
      this.setState({ generatedResponse });
    } catch (error) {
      console.error("Error sending request to ChatGPT:", error);
      this.setState({ error, generatedResponse: "" });
    }
  };

  handleChange = (event) => {
    let target = event.target;
    let name = target.name;
    this.setState({
      [name]: event.target.value,
    });
  };

  handleNewRequest = () => {
    this.setState({
      articleTitle: "",
      articleCopy: "",
      totalPoints: "",
      generatedResponse: "",
      error: null,
      questionDisplay: true,
      responseDisplay: false,
    });
  };

  handleCancel = (event) => {
    window.location.replace("./components/request");
  };

  render() {
    const { generatedResponse, error } = this.state;

    return (
      <div>
        <div className="container-fluid">
          {this.state.questionDisplay && (
            <div className="QueryForm">
              <form className="FormField">
                <label htmlFor="articleTitle">Title: </label>
                <input
                  type="text"
                  className="form-control"
                  id="articleTitle"
                  name="articleTitle"
                  placeholder="Title"
                  value={this.state.articleTitle}
                  onChange={this.handleChange}
                />
                <br></br>
                <label htmlFor="articleCopy">Content: </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="articleCopy"
                  name="articleCopy"
                  placeholder="Content"
                  value={this.state.articleCopy}
                  onChange={this.handleChange}
                />
                <br></br>
                <label htmlFor="totalPoints"># of Takeaways: </label>
                <datalist id="totalPoints">
                  <option value="1"></option>
                  <option value="2"></option>
                  <option value="3"></option>
                  <option value="4"></option>
                  <option value="5"></option>
                </datalist>
                <input
                  list="totalPoints"
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
          )}
        </div>
        {this.state.responseDisplay && generatedResponse && (
          <div>
            <h2>
              <em>
                <b>{this.state.articleTitle}</b>
              </em>
            </h2>
            <p>
              {generatedResponse.split("\n\n").map((item, index) => (
                <React.Fragment key={index}>
                  {index === 0 ? (
                    item
                  ) : (
                    <React.Fragment>
                      {(index === 1 || index === 2 || index === 3) && <br />}{" "}
                      {/* Add line break after the first two items */}{" "}
                      {item.replace(
                        /\s*(\d+\.\s*|\-\s|[A-Za-z]+\)\s*)/g,
                        "\n*) "
                      )}
                    </React.Fragment>
                  )}
                  <br />
                </React.Fragment>
              ))}
            </p>
            <button onClick={this.handleNewRequest}>New Request</button>
          </div>
        )}{" "}
        {this.state.error && (
          <div>
            <h2>Error</h2>
            <p>{error.message}</p>
          </div>
        )}
      </div>
    );
  }
}

export default RequestData;
