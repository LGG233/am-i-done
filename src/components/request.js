import React, { Component } from "react";
import axios from "axios";
import "./css/request.css";
import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";

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
      generatedResponse: "",
      generatedResponse1: "",
      generatedResponse2: "",
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({ generatedResponse });

      const headerText = "I've analyzed the perceived audience of your content. If this is not your intended audience or if it is incomplete, please revise the text to contain specific references to the readers you would like to target.";
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({ generatedResponse });

      const headerText = "I've analyzed your content and found five key takeaways. If these aren't the points you want your audience to remember, consider revising your text to convey your intended takeaways.";
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({ generatedResponse });

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
              content: `Draft a 25 - word synopsis of "${articleCopy}" for presenting the article that entices people to read it.`,
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({ generatedResponse });

      const headerText = "To share your work via email, copy and paste this language into the body of your message along with the link.";
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({ generatedResponse });

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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({ generatedResponse });

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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({ generatedResponse });

      const headerText = "I've drafted a 120-word abstract of your content that you can use to promote it on your website:";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling abstractAPI:", error);
    }
  }

  classificationAPI = async () => {
    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `What's the list of law firm industry and practice groups that ${articleCopy} should fall under?.`,
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({ generatedResponse });

      const headerText = "Based on its content and subject matter, this thought leadership piece could be linked to the following industry and practice groups:";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling classificationAPI:", error);
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
      headerText: "",
    });
  };

  handleCancel = (event) => {
    window.location.replace("./components/request");
  };

  copyToClipboard(generatedResponse) {
    if (!navigator.clipboard) {
      // Clipboard API not supported, provide fallback
      alert("Clipboard API not supported in this browser. You can manually copy the text.");
      return;
    }
    navigator.clipboard.writeText(generatedResponse)
      .then(() => {
        alert("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Unable to copy text: ", err);
        alert("Failed to copy text to clipboard. You can manually copy the text.");
      });
  }

  render() {
    return (
      <div>
        <button className="button-19" onClick={this.handleNewRequest}>New Request</button>
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
              <b><em>Am I Done</em> Review</b>
            </h4>
            <div>
              <p>
                {this.state.headerText}
              </p>
            </div>
            <div>
              {this.state.generatedResponse && (
                <div>
                  <textarea
                    readOnly
                    value={this.state.generatedResponse}
                    className="api-response-textbox"
                  />
                  <button className="button-19" onClick={() => this.copyToClipboard(this.state.generatedResponse)}>
                    Copy
                  </button>
                </div>
              )}
            </div>
            <div>
              <h4>
                <b>Audience and Title Analysis</b>
              </h4>
              <div className="button-container">
                <button className="button-19" onClick={this.titleAnalysisAPI}>Audience</button>
                <button className="button-19" onClick={this.takeawaysAPI}>Takeaways</button>
                <button className="button-19" onClick={this.altTitlesAPI}>Alternative Titles</button>
                <button className="button-19" onClick={this.classificationAPI}>Practices / Industries</button>
              </div>
            </div>
            <div>
              <h4>
                <b>Online Promotion</b>
              </h4>
              <div className="button-container">
                <button className="button-19" onClick={this.synopsisAPI}>Email</button>
                <button className="button-19" onClick={this.socialMediaAPI}>Twitter</button>
                <button className="button-19" onClick={this.linkedInAPI}>LinkedIn</button>
                <button className="button-19" onClick={this.abstractAPI}>Website</button>
              </div>
              <div className="spacer"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default RequestData;
