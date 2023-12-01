import React, { Component } from "react";
import axios from "axios";
import "./css/request.css";

function countWords(generatedResponse) {
  const words = generatedResponse.trim().split(/\s+/);
  return words.length;
}

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
      wordCount: 0,
      characterCount: 0,
      wordsCounted: false,
      showWordCount: false,
      editedResponse: "",
      isEditing: false,
      error: null,
    };
  };

  titleAnalysisAPI = async () => {
    this.clearState()
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

      const headerText = "I've analyzed what appears to be the target audience for your work. If this is not your intended audience or if there are other readers you'd like to reach, consider revising to specificly mention the people who should read your work.";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling titleAnalysisAPI:", error);
    }
  }

  takeawaysAPI = async () => {
    this.clearState()
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

      const headerText = "I've analyzed your content and isolated the top five points. If these aren't the ones you want your audience to remember, consider revising your text to convey your intended takeaways.";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling takeawaysAPI: ", error);
    }
  }

  altTitlesAPI = async () => {
    this.clearState()
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

      const headerText = "For your review: three alternative titles for your piece that you may want to consider:";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error making altTitlesAPI:", error);
    }
  }

  synopsisAPI = async () => {
    this.clearState()
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
      this.setState({ showWordCount: true });

      const headerText = "To share your work via email, copy and paste this language into the body of your message along with the link.";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling synposisAPI:", error);
    }
  }

  socialMediaAPI = async () => {
    this.clearState()
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

      const headerText = "Here are three draft Twitter posts for your consideration.";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling socialMediaAPI:", error);
    }
  }

  linkedInAPI = async () => {
    this.clearState()
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
      this.setState({ showWordCount: true });

      const headerText = "Here's a short post you can use to promote your content on Linkedin:";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling linkedInAPI:", error);
    }
  }

  abstractAPI = async () => {
    this.clearState()
    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Please provide a 150 - word abstract of "${articleCopy} that includes some mention of who should read the piece.`,
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
      this.setState({ showWordCount: true });

      const headerText = "Here's a 120-word synopsis of your work that you can use to promote it on your website:";
      this.setState({ headerText });

    } catch (error) {
      console.error("Error calling abstractAPI:", error);
    }
  }

  classificationAPI = async () => {
    this.clearState()
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

  clearState = (event) => {
    let headerText = "Reviewing your content...";
    let generatedResponse = "";
    this.setState({ headerText, generatedResponse });
    this.setState({ showWordCount: false });
  }

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

  adjustInputHeight = (input) => {
    if (input) {
      input.style.height = "auto";
      input.style.height = input.scrollHeight + "px";
    }
  };

  adjustTextareaSize = () => {
    if (this.generatedResponseTextarea) {
      const generatedResponse = this.state.generatedResponse;
      const numCharacters = generatedResponse.length
      const numRows = Math.ceil((numCharacters / 40) + 2);
      const maxLineLength = Math.max(
        ...generatedResponse.split('\n').map((line) => line.length)
      );
      this.generatedResponseTextarea.value = generatedResponse;
      this.generatedResponseTextarea.rows = numRows;
      this.generatedResponseTextarea.cols = maxLineLength;
    }
  };

  // adjustEditareaSize = () => {
  //   if (this.state.editedResponse) {
  //     const editedResponse = this.state.editedResponse;
  //     const numCharacters = editedResponse.length
  //     const numRows = Math.ceil((numCharacters / 40) + 2);
  //     const maxLineLength = Math.max(
  //       ...editedResponse.split('\n').map((line) => line.length)
  //     );
  //     this.editedResponseTextarea.value = editedResponse;
  //     this.editedResponseTextarea.rows = numRows;
  //     this.editedResponseTextarea.cols = maxLineLength;
  //     console.log("adjustEditareaSize called within the adjustEditareaSize method")
  //   }
  // };
  componentDidMount() {
    this.adjustTextareaSize();
  }

  componentDidUpdate(prevProps, prevState) {
    // this.adjustEditareaSize();
    if (prevState.generatedResponse !== this.state.generatedResponse) {
      console.log("here's the number BEFORE componentDidUpdate is called" + this.state.wordCount);
      this.adjustTextareaSize();
      // this.adjustEditareaSize();
      this.updateWordCount();
      console.log("componentDidUpdate called");
      console.log("here's the number AFTER componentDidUpdate is called" + this.state.wordCount);
      console.log(this.state.wordCount, this.state.characterCount)
    }
  }

  updateWordCountEditing = () => {
    const wordCount = countWords(this.state.editedResponse);
    const characterCount = this.state.editedResponse.length;
    this.setState({
      wordCount,
      characterCount,
    },
      () => {
        console.log("this is the word number when updateWordCount is called" + wordCount)
        console.log("this is the character number when updateWordCount is called" + characterCount)
      }
    );
  }

  updateWordCount = () => {
    const wordCount = countWords(this.state.generatedResponse);
    const characterCount = this.state.generatedResponse.length;
    this.setState({
      wordCount,
      characterCount,
    },
      () => {
        console.log("this is the word number when updateWordCount is called" + wordCount)
        console.log("this is the character number when updateWordCount is called" + characterCount)
      }
    );
  }

  enterEditMode = () => {
    this.setState({
      editedResponse: this.state.generatedResponse,
      isEditing: true,
    }, () => {
      ;
      this.updateWordCount();
    });
  };

  exitEditMode = () => {
    this.setState({
      generatedResponse: this.state.editedResponse,
      isEditing: false,
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
                    ref={(input) => { this.articleTitleInput = input; }}
                    onInput={() => this.adjustInputHeight(this.articleTitleInput)}
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
                    ref={(textarea) => { this.articleCopyTextarea = textarea; }}
                    onInput={() => this.adjustInputHeight(this.articleCopyTextarea)}
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
              {this.state.isEditing ? (
                <div>
                  <p4>EDITING</p4>
                  <textarea
                    value={this.state.editedResponse}
                    onChange={(e) => {
                      this.setState({ editedResponse: e.target.value }, () => {
                        this.updateWordCountEditing();
                      });
                    }}
                    className="api-editing-textbox"
                    ref={(textarea) => {
                      this.editedResponseTextarea = textarea;
                    }}
                  />
                  <button className="button-19" onClick={() => this.copyToClipboard(this.state.editedResponse)}>
                    Copy
                  </button>
                  <button className="button-19" onClick={this.exitEditMode}>
                    Done Editing
                  </button>

                </div>
              ) : (
                <div>
                  {this.state.generatedResponse && (
                    <div>
                      <textarea
                        readOnly
                        value={this.state.generatedResponse}
                        className="api-response-textbox"
                        ref={(textarea) => { this.generatedResponseTextarea = textarea; }}
                      />
                      <button className="button-19" onClick={() => this.copyToClipboard(this.state.generatedResponse)}>
                        Copy
                      </button>
                      <button className="button-19" onClick={this.enterEditMode}>
                        Edit Response
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="showWordCount">
                {this.state.showWordCount && (
                  <div>
                    <p className="counts">Words: {this.state.wordCount}</p>
                    <p className="counts">Characters: {this.state.characterCount}</p>
                  </div>
                )}

              </div>
              <div>
                <h4>
                  <b>Audience and Title Analysis</b>
                </h4>
                <div className="button-container">
                  <button className="button-19" onClick={this.titleAnalysisAPI} title="Am I Done infers the target audience for your content, and then reviews how well the piece and its title speak to that particular audience.">Audience</button>
                  <button className="button-19" onClick={this.takeawaysAPI} title="Am I Done extracts the top five takeaways of your piece as it is written. You can compare them to the takeaways you'd like to leave with readers to ensure you're sending the right message.">Takeaways</button>
                  <button className="button-19" onClick={this.altTitlesAPI} title="Am I Done drafts three alternative titles you may want to consider for your piece, and explains its choice for each.">Alternative Titles</button>
                  <button className="button-19" onClick={this.classificationAPI} title="Am I Done identifies the practice and industry groups you may wish to use for classifying your content.">Practices & Industries</button>
                </div>
              </div>
              <div>
                <h4>
                  <b>Online Promotion</b>
                </h4>
                <div className="button-container">
                  <button className="button-19" onClick={this.synopsisAPI} title="Am I Done drafts a short synopsis of your thought leadership that you can use in an email blast to clients and potential clients.">Email</button>
                  <button className="button-19" onClick={this.socialMediaAPI} title="Am I Done drafts three short posts that you can use for promoting your work on X (formerly Twitter).">Twitter</button>
                  <button className="button-19" onClick={this.linkedInAPI} title="Am I Done drafts a longer post that can be used to promote the piece on LinkedIn.">LinkedIn</button>
                  <button className="button-19" onClick={this.abstractAPI} title="Am I Done provides a short abstract of your thought leadership that you can use to describe the piece and who should read it when posting to your firm website.">Website</button>
                </div>
                <div className="spacer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default RequestData;

