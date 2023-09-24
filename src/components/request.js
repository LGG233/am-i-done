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
      generatedResponse: "",
      isLoading: false,
      error: null,
    };
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
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
              content: `Please respond to the following questions: 1) Based on the subject and style, who should read the article?,  2) what are the ${requestData.points} most salient takeaways of "${requestData.copy}"?, and 3) Based on best SEO practices and the primary focus of the piece, please review the proposed title of "${requestData.title}" and provide three alternative titles that may attract more readers.`,
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
      this.setState({ isLoading: false });

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

  handleCancel = (event) => {
    window.location.replace("./components/request");
  };

  render() {
    const { generatedResponse, error } = this.state;

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
        {/* Display the response or error */}
        {generatedResponse && (
          <div>
            <h2>ChatGPT Response</h2>
            <p>
              {generatedResponse.split("\n\n").map((item, index) => (
                <React.Fragment key={index}>
                  {index === 0 ? (
                    item
                  ) : (
                    <React.Fragment>
                      {(index === 1 || index === 2) && <br />}{" "}
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
          </div>
        )}{" "}
        {error && (
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
