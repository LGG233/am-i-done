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
      requestData: [],
      questionDisplay: false,
      responseDisplay: true,
      generatedResponse1: "",
      generatedResponse2: "",
      response1: false,
      response2: false,
      headerText: "",
      error: null,
    };
  };

  titleAnalysisAPI = async () => {
    try {
      const { articleCopy, articleTitle } = this.state;
      console.log("Title: ", articleTitle)
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Based on the language and framing of "${articleCopy}", what are the occupations of the intended audience of the piece as it is written? Provide an answer to that question in a single sentence. Then answer these questions: "How well does the piece position itself to reach its target audience? Is it clear in the title "${articleTitle}", the introduction, and the framing that the article is for that audience? If the piece relates to a specific geographical region, do the article and title make that geography evident? How could the article and title do a better job to frame the content for the target audience? Does the title clearly convey who should read the article? Does it communicate why those people should read it? How? `,
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
      console.log("Response Data: ", response.data);

      const generatedResponse1 = response.data.choices[0].message.content;
      this.setState({ generatedResponse1, response1: true, response2: false });

      const headerText = "I've analyzed the audience that comes through in your content. If this is not your intended audience, or if it is incomplete, please revise the text to explicity mention the people it is written for.";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling titleAnalysisAPI:", error);
    }
  }

  takeawaysAPI = async () => {
    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `What are the five most salient takeaways of "${articleCopy}"? Each takeaway must be summarized in a single sentence. Please output as a numbered list.`,
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
      console.log("Response Data: ", response.data);

      const generatedResponse1 = response.data.choices[0].message.content;
      this.setState({ generatedResponse1, response1: true, response2: false });

      const headerText = "I have read and analyzed your content and identified five key takeaways that come out of your written work. If these are not the most salient takeaways you'd like to give your audience, please consider revising your text to ensure that you are communicating the key information you want readers to retain.";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling takeawaysAPI: ", error);
    }
  }

  altTitlesAPI = async () => {
    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Please provide three alternative titles for "${articleCopy}" that reference the intended audience and articuiate why they should read it. Enclose each alternative title in quotation marks. Please explain each alternative title and why it was chosen in a single sentence that follows the alternative title using a hyphen to separate them. Do not include line breaks between alternative titles in the output string. Please provide the output in a numbered list`,
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
      console.log("Response Data: ", response.data);

      const generatedResponse1 = response.data.choices[0].message.content;
      this.setState({ generatedResponse1, response1: true, response2: false });

      const headerText = "I have drafted three alternative titles that you may want to consider:";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error making altTitlesAPI:", error);
    }
  }

  synopsisAPI = async () => {
    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Draft a 25 - word synopsis of "${articleCopy}" that the author can use to present the article.`,
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
      console.log("Response Data: ", response.data);

      const generatedResponse2 = response.data.choices[0].message.content;
      this.setState({ generatedResponse2, response1: false, response2: true });

      const headerText = "To share your work via email, copy and paste this synopsis into the body of your message along with the link.";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling synposisAPI:", error);
    }
  }

  socialMediaAPI = async () => {
    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Provide three compelling summaries of "${articleCopy}" that can be used to promote the article on Twitter.Include at least three appropriate hashtags.The entire post, including spaces and hashtags, should be no more than 120 characters. Please provide the output in a numbered list`,
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
      console.log("Response Data: ", response.data);

      const generatedResponse2 = response.data.choices[0].message.content;
      this.setState({ generatedResponse2, response1: false, response2: true });

      const headerText = "I have drafted three Twitter posts you may wish to use for promoting your content.";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling socialMediaAPI:", error);
    }
  }

  linkedInAPI = async () => {
    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Please provide a 150 - word abstract of "${articleCopy} that can be used to promote the article on LinkedIn. Include two or three professional hashtags`,
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
      console.log("Response Data: ", response.data);

      const generatedResponse2 = response.data.choices[0].message.content;
      this.setState({ generatedResponse2, response1: false, response2: true });

      const headerText = "I have drafted a short post you can use to promote your content on Linkedin:";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling linkedInAPI:", error);
    }
  }

  abstractAPI = async () => {
    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Please provide a 150 - word abstract of "${articleCopy} .`,
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
      console.log("Response Data: ", response.data);

      const generatedResponse2 = response.data.choices[0].message.content;
      this.setState({ generatedResponse2, response1: false, response2: true });

      const headerText = "I've drafted a 120-word abstract of your content that you can use to promote it on your website:";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling abstractAPI:", error);
    }
  }


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
    return (
      <div>
        <div className="split-screen">
          <div className="left-panel">
            <h4>
              <b>Content</b>
            </h4>
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
                  <br />
                  <label htmlFor="articleCopy">Body: </label>
                  <textarea
                    type="text"
                    className="article-body"
                    id="articleCopy"
                    name="articleCopy"
                    placeholder="Content"
                    value={this.state.articleCopy}
                    onChange={this.handleChange}
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="right-panel">
            <h4>
              <b>Am I Done Analysis</b>
            </h4>
            <div>
              <button className="button-19" onClick={this.titleAnalysisAPI}>Audience</button>
              <button className="button-19" onClick={this.takeawaysAPI}>Takeaways</button>
              <button className="button-19" onClick={this.altTitlesAPI}>Alternative Titles</button>
            </div>
            <br />
            <div className="response1">
              {this.state.response1 && (
                <p>
                  <em>{this.state.headerText}</em>
                </p>
              )}
            </div>
            <div>
              {this.state.response1 && (
                <textarea
                  readOnly
                  value={this.state.generatedResponse1}
                  className="api-response-textbox"
                />
              )}
            </div>
            <br />
            <div>
              <h4>
                <b>Promotion</b>
              </h4>
              <button className="button-19" onClick={this.synopsisAPI}>Email</button>
              <button className="button-19" onClick={this.socialMediaAPI}>Twitter</button>
              <button className="button-19" onClick={this.linkedInAPI}>LinkedIn</button>
              <button className="button-19" onClick={this.abstractAPI}>Website</button>

              <div className="spacer"></div>
              <div className="response2">
                {this.state.response2 && (
                  <p>
                    <em>{this.state.headerText}</em>
                  </p>
                )}
              </div>
              <div>
                {this.state.response2 && (
                  <textarea
                    readOnly
                    value={this.state.generatedResponse2}
                    className="api-response-textbox"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <button onClick={this.handleNewRequest}>New Request</button>
      </div>
    )
  }
}
export default RequestData;
