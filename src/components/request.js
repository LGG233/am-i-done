import React, { Component } from "react";
import axios from "axios";
import "./css/request.css";

class RequestData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleTitle: "",
      articleCopy: "",
      totalPoints: "",
      altTitles: "",
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
        "We're preparing alternative titles...",
        "We're drafting an abstract...",
        "We're writing a social media post...",
        "We're generating an executive summary..."
      ],
      currentLoadingMessage: "",
      isLoading: false,
      error: null,
    };
  };

  componentDidMount() {
    this.setState({ currentLoadingMessage: "We're reviewing your content..." });
    this.loadingMessageTimer = setInterval(this.changeLoadingMessage, 10000);
    setTimeout(this.changeLoadingMessage, 10000);
  };

  componentWillUnmount() {
    clearInterval(this.loadingMessageTimer);
  };

  changeLoadingMessage = () => {
    const { loadingMessages } = this.state;
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    const newMessage = loadingMessages[randomIndex];
    this.setState({ currentLoadingMessage: newMessage });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true, questionDisplay: false, responseDisplay: false, currentLoadingMessage: "We're reviewing your content..." });
    console.log("sending request...")
    const requestData = {
      title: this.state.articleTitle,
      copy: this.state.articleCopy,
      points: this.state.totalPoints,
      altTitles: this.state.altTitles,
    };

    try {
      const response1 = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Based on the language and framing of "${requestData.copy}", what are the occupations of the intended audience of the piece as it is written? Provide an answer to that question in a single sentence. Then answer these questions: "How well does the piece position itself to reach its target audience? Is it clear in the title "${requestData.title}", the introduction, and the framing that the article is for that audience? If the piece relates to a specific geographical region, do the article and title make that geography evident? How could the article and title do a better job to frame the content for the target audience? Does the title clearly convey who should read the article? Does it communicate why those people should read it? How? `,
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
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `What are the ${requestData.points} most salient takeaways of "${requestData.copy}"? Each takeaway must be summarized in a single sentence. Please output as a numbered list.`,
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
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Please provide "${requestData.altTitles}" alternative titles for "${requestData.copy}" that reference the intended audience and articuiate why they should read it. Enclose each alternative title in quotation marks. Please explain each alternative title and why it was chosen in a single sentence that follows the alternative title using a hyphen to separate them. Do not include line breaks between alternative titles in the output string. Please provide the output in a numbered list`,
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
      console.log(response3);
      console.log("Response Data 3:", response3.data);
      const response4 = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Draft a 25 - word synopsis of "${requestData.copy}" that the author can use to present the article.`,
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
      console.log(response4);
      console.log("Response Data 4:", response4.data);
      const response5 = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Provide a compelling summary of "${requestData.title}" that can be used to promote the article on Twitter, LinkedIn, and other social media.Include at least three appropriate hashtags.The entire post, including spaces and hashtags, should be no more than 120 characters.`,
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
      console.log(response5);
      console.log("Response Data 5:", response5.data);
      const response6 = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Please provide a 150 - word abstract of "${requestData.copy}".`,
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
    const { currentLoadingMessage } = this.state;
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
                <br></br>
                <label htmlFor="altTitles">
                  Select the Number of Alternative Titles You'd Like to See:{" "}
                </label>
                <datalist id="altTitles">
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
                  list="altTitles"
                  className="form-control"
                  id="altTitles"
                  name="altTitles"
                  value={this.state.altTitles}
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
              <div className="article-title">
                <h4>
                  <em>
                    <b>{this.state.articleTitle}</b></em>
                </h4>
              </div>
              <div className="split-screen">
                <div className="right-panel">
                  <h4>
                    <b>Original Content</b>
                  </h4><em>
                    {this.state.articleCopy.split('\n').map((paragraph, index) => (
                      <p key={index}>
                        {paragraph.match(/^\d+\.\s*/) ? paragraph.replace(/^\d+\.\s*/, '') : paragraph}
                      </p>
                    ))}
                  </em>
                </div>
                <div className="left-panel">
                  <div>
                    <h4><em>Am I Done?</em> Analysis</h4>
                    <p>
                      <b>Target Audience</b>
                      <br />
                      {generatedResponse1.split('\n').map((paragraph) => (
                        <p>{paragraph.replace(/^\d+\.\s*/g, '')}</p>
                      ))}
                    </p>
                    <br />
                    <p>
                      <b>Alternative Titles</b>
                    </p>
                    <ul>
                      {generatedResponse3.split('\n').map((line, index) => (
                        <li key={index} style={{ margin: '0', padding: '0' }}>{line.replace(/^\s*\d+\.\s*/, '')}</li>
                      ))}
                    </ul>
                    <br />
                    <p>
                      <b>Key Takeaways</b>
                    </p>
                    <ul>
                      {generatedResponse2.split('\n').map((line, index) => (
                        <li key={index} style={{ margin: '0', padding: '0' }}>{line.replace(/^\s*\d+\.\s*/, '')}</li>
                      ))}
                    </ul>
                    <br />
                    <p>
                      <b>Executive Summary</b>
                      <br />
                      <br />
                      {generatedResponse4}
                    </p>
                    <br />
                    <p>
                      <b>Social Media Post</b>
                      <br />
                      <br />
                      {generatedResponse5}
                    </p>
                    <br />
                    <p>
                      <b>Abstract</b>
                      <br />
                      {generatedResponse6.split('\n').map((paragraph) => (
                        <p>{paragraph.replace(/^\d+\.\s*/g, '')}</p>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
              <button onClick={this.handleNewRequest}>New Request</button>
              <br />
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
