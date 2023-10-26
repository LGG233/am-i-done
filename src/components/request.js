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
      generatedResponse1: "",
      generatedResponse2: "",
      generatedResponse3: "",
      generatedResponse4: "",
      generatedResponse5: "",
      generatedResponse6: "",
      loadingMessages: [
        "We're analyzing your audience...",
        "We're extracting key takeaways...",
        "We're drafting alternative titles...",
        "We're writing an abstract...",
        "We're crafting a social media post...",
        "We're generating an executive summary..."
      ],
      currentLoadingMessage: "",
      isLoading: false,
      error: null,
    };
  };

  componentDidMount() {
    this.loadingMessageTimer = setInterval(this.changeLoadingMessage, 5000);
    this.setState({currentLoadingMessage: "We're reviewing your content..."});
    setTimeout(this.changeLoadingMessage, 5000);
  };

  componentWillUnmount() {
    clearInterval(this.loadingMessageTimer);
  };

  changeLoadingMessage = () =>{
    const {loadingMessages} = this.state;
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    const newMessage = loadingMessages[randomIndex];
    this.setState({currentLoadingMessage: newMessage});
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true, questionDisplay: false, responseDisplay: false});
    console.log("sending request...")
    const requestData = {
      title: this.state.articleTitle,
      copy: this.state.articleCopy,
      points: this.state.totalPoints,
    };

    try {
      const response1 = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Based on the languaged and framing of "${requestData.copy}", what are the occupations of the intended audience of the piece as it is written? Provide an answer that is one single sentence`,
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

      console.log(response1);
      console.log("Response Data 1:", response1.data);

      const response2 = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `What are the ${requestData.points} most salient takeaways of "${requestData.copy}"? Please output as a numbered list.`,
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
      console.log(response2);
      console.log("Response Data 2:", response2.data);

      const response3 = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Based on the primary focus of "${requestData.copy}", please provide three alternative titles to "${requestData.title}" that communicate the primary focus of the article to the intended audience. Please provide the output in text format. Please put each individual title into a numbered list.`,
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

      const response4 = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Draft a 25-word synopsis of "${requestData.copy}" that the author can use to present the article.`,
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

      const response5 = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Provide a compelling summary of "${requestData.title}" that can be used to promote the article on Twitter, LinkedIn, and other social media. Include at least three appropriate hashtags. The entire post, including spaces and hashtags, should be no more than 120 characters.`,
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

      const response6 = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Please provide a 200-word abstract of "${requestData.copy}".`,
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

      console.log(response6);
      console.log("Response Data 6:", response6.data);



      console.log(response3);
      console.log("Response Data 3:", response3.data);

      const generatedResponse1 = response1.data.choices[0].message.content;
      const generatedResponse2 = response2.data.choices[0].message.content;
      const generatedResponse3 = response3.data.choices[0].message.content;
      const generatedResponse4 = response4.data.choices[0].message.content;
      const generatedResponse5 = response5.data.choices[0].message.content;
      const generatedResponse6 = response6.data.choices[0].message.content;
      const generatedResponse =
        generatedResponse1 +
        generatedResponse2 +
        generatedResponse3 +
        generatedResponse4 +
        generatedResponse5 +
        generatedResponse6;

      console.log("Generated Responses: ", generatedResponse);
      this.setState({
        isLoading: false,
        responseDisplay: true,
        generatedResponse,
        generatedResponse1,
        generatedResponse2,
        generatedResponse3,
        generatedResponse4,
        generatedResponse5,
        generatedResponse6,
      });

      this.setState({
        isLoading: false,
        questionDisplay: false,
      })
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
    const {currentLoadingMessage} = this.state;
    const {
      generatedResponse1,
      generatedResponse2,
      generatedResponse3,
      generatedResponse4,
      generatedResponse5,
      generatedResponse6,
      isLoading,
      error,
    } = this.state;

    return (
      <div>
        <div className="container-fluid">
          {isLoading && (
            <div className="isLoading">
            <h3>{currentLoadingMessage}</h3>
            </div>
          )}
        </div>
        <div className="container-fluid">
          {this.state.questionDisplay && (
            <div className="QueryForm">
              <form className="FormField">
                <label htmlFor="articleTitle">Proposed Title: </label>
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
                <label htmlFor="articleCopy">Draft Content: </label>
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
                <label htmlFor="totalPoints">
                  Select the Number of Takeaways You'd Like to See:{" "}
                </label>
                <datalist id="totalPoints">
                  <option value="1"></option>
                  <option value="2"></option>
                  <option value="3"></option>
                  <option value="4"></option>
                  <option value="5"></option>
                  <option value="6"></option>
                  <option value="7"></option>
                  <option value="8"></option>
                  <option value="9"></option>
                  <option value="10"></option>
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
              <br></br>
              <button onClick={this.handleSubmit}>Submit</button>
              <br></br>
              <button onClick={this.handleCancel}>Cancel</button>
            </div>
          )}
        </div>
        {this.state.responseDisplay &&
          generatedResponse1 &&
          generatedResponse2 &&
          generatedResponse3 && (
            <div>
              <h4>
                <em>
                  <b>{this.state.articleTitle}</b>
                </em>
              </h4>
              <p>
                <b>Target Audience</b>
                <br />
                {generatedResponse1}
              </p>
              <p>
                <b>Key Takeaways</b>
                <br />
                <ul>
                  {generatedResponse2.split('\n').map((paragraph) => (
                    <li>{paragraph.replace(/^\d+\.\s*/g, '')}</li>
                  ))}
                </ul>
              </p>
              <p>
                <b>Alternative Titles</b>
                <br />
                <ul>
                  {generatedResponse3.split('\n').map((line, index) => (
                    <li key={index}>{line.replace(/^\s*\d+\.\s*/, '')}</li>
                  ))}
                </ul>
              </p>
              <p>
                <b>Executive Summary (under 25 words)</b>
                <br />
                {generatedResponse4} 
              </p>
              <p>
                <b>Abstract (approximately 200 words)</b>
                <br />
                 {generatedResponse6.split('\n').map((paragraph) => (
                    <p>{paragraph.replace(/^\d+\.\s*/g, '')}</p>
                    ))}
                    </p>
              <p>
                <b>Social Media Post (under 120 characters)</b>
                <br />
                {generatedResponse5}
              </p>
              <button onClick={this.handleNewRequest}>New Request</button>
              <button onClick={this.handleSubmit}>Regenerate Reponse</button>
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
