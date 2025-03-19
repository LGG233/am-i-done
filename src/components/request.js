import React, { Component } from "react";
import axios from "axios";
import "./css/request.css";
import { franc } from 'franc-min';

class RequestData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleTitle: "",
      articleCopy: "",
      altTitles: "",
      data: [],
      requestData: [],
      responseDisplay: true,
      generatedResponse: "",
      headerText: "",
      wordCount: 0,
      characterCount: 0,
      wordsCounted: false,
      showWordCount: false,
      showEditButton: false,
      editedResponse: "",
      detectedLanguage: "",
      language: "",
      languageToUse: "",
      isEditing: false,
      error: null,
    };

    this.baseUrl = "https://api.openai.com/v1/chat/completions";
  };

  handleError = (methodName, error) => {
    console.error(`Error calling ${methodName}:`, error);
  }

  titleAnalysisAPI = async () => {
    if (this.isEditingInProgress()) {
      return;
    }
    this.clearState()

    const languageToUse = this.state.language === "English" ? "English" : this.state.detectedLanguage;

    try {
      const { articleCopy, articleTitle } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `Based on the language and framing of "${articleCopy}", what are the occupations of the intended audience of the piece as it is written? Provide an answer to that question in a single sentence. Do not include 'legal professionals' in the list of occupations. Then answer these questions in additional paragraphs: "How well does the piece position itself to reach its target audience? Is it clear in the title "${articleTitle}", the introduction, and the framing that the article is for that audience? If the piece relates to a specific geographical region, do the article and title make that geography evident? How could the article and title do a better job to frame the content for the target audience? Does the title clearly convey who should read the article? Does it communicate why those people should read it? How? The response must be provided in "${languageToUse}".`,
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({
        generatedResponse,
        showWordCount: false,
        showEditButton: false,
      });

      const headerText = "I've analyzed what appears to be the target audience for your work. If this is not your intended audience or if there are other readers you'd like to reach, consider revising to specificly mention the people who should read your work.";
      this.setState({ headerText });

      console.log("The article is written in ", this.state.detectedLanguage);

    } catch (error) {
      this.handleError("titleAnalysisAPI:", error);
    }
  }

  takeawaysAPI = async () => {
    if (this.isEditingInProgress()) {
      return;
    }
    this.clearState()

    const languageToUse = this.state.language === "English" ? "English" : this.state.detectedLanguage;

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `What are the five most salient takeaways of "${articleCopy}"? Each takeaway must be summarized in a single sentence. Please output as a numbered list. The response must be provided in "${languageToUse}".`,
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({
        generatedResponse,
        showWordCount: false,
        showEditButton: false,
      });

      const headerText = "I've analyzed your content and isolated the top five points. If these aren't the ones you want your audience to remember, consider revising your text to convey your intended takeaways.";
      this.setState({ headerText });

    } catch (error) {
      this.handleError("takeawaysAPI:", error);
    }
  }

  altTitlesAPI = async () => {
    if (this.isEditingInProgress()) {
      return;
    }
    this.clearState()

    const languageToUse = this.state.language === "English" ? "English" : this.state.detectedLanguage;

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `Please provide three alternative titles for "${articleCopy}" that reference the intended audience and articuiate why they should read it. Enclose each alternative title in quotation marks. Please explain each alternative title and why it was chosen in a single sentence that follows the alternative title using a hyphen to separate them. Do not include line breaks between alternative titles in the output string. Please provide the output in a numbered list. The response must be provided in "${languageToUse}".`,
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({
        generatedResponse,
        showWordCount: false,
        showEditButton: false,
      });

      const headerText = "For your review: three alternative titles for your piece that you may want to consider:";
      this.setState({ headerText });

    } catch (error) {
      this.handleError("altTitlesAPI:", error);
    }
  }

  synopsisAPI = async () => {
    if (this.isEditingInProgress()) {
      return;
    }
    this.clearState()

    const languageToUse = this.state.language === "English" ? "English" : this.state.detectedLanguage;

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `Draft a 25 - word synopsis of "${articleCopy}" for presenting the article that entices people to read it. The response must be provided in "${languageToUse}".`,
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({
        generatedResponse,
        showWordCount: true,
        showEditButton: true,
      });

      const headerText = "To share your work via email, copy and paste this language into the body of your message along with the link.";
      this.setState({ headerText });

    } catch (error) {
      this.handleError("synposisAPI:", error);
    }
  }

  socialMediaAPI = async () => {
    if (this.isEditingInProgress()) {
      return;
    }
    this.clearState()

    const languageToUse = this.state.language === "English" ? "English" : this.state.detectedLanguage;

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `Provide three compelling summaries of "${articleCopy}" that can be used to promote the article on Twitter.Include at least three appropriate hashtags.The entire post, including spaces and hashtags, should be no more than 120 characters. Please provide the output in a numbered list. The response must be provided in "${languageToUse}".`,
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({
        generatedResponse,
        showWordCount: true,
        showEditButton: true,
      });

      const headerText = "Here are three draft Twitter posts for your consideration.";
      this.setState({ headerText });

    } catch (error) {
      this.handleError("socialMediaAPI:", error);
    }
  }

  linkedInAPI = async () => {
    if (this.isEditingInProgress()) {
      return;
    }
    this.clearState()

    const languageToUse = this.state.language === "English" ? "English" : this.state.detectedLanguage;

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `Please provide a 150 - word abstract of "${articleCopy} that can be used to promote the article on LinkedIn. Include two or three professional hashtags. The response must be provided in "${languageToUse}".`,
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({
        generatedResponse,
        showWordCount: true,
        showEditButton: true,
      });

      const headerText = "Here's a short post you can use to promote your content on Linkedin:";
      this.setState({ headerText });

    } catch (error) {
      this.handleError("linkedInAPI:", error);
    }
  }

  abstractAPI = async () => {
    if (this.isEditingInProgress()) {
      return;
    }
    this.clearState()

    const languageToUse = this.state.language === "English" ? "English" : this.state.detectedLanguage;

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `Please provide a 150 - word abstract of "${articleCopy} that includes some mention of who should read the piece. The response must be provided in "${languageToUse}".`,
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({
        generatedResponse,
        showWordCount: true,
        showEditButton: true,
      });

      const headerText = "Here's a brief synopsis of your work that you can use to promote it on your website:";
      this.setState({ headerText });

    } catch (error) {
      this.handleError("abstractAPI:", error);
    }
  }

  classificationAPI = async () => {
    if (this.isEditingInProgress()) {
      return;
    }
    this.clearState()

    const languageToUse = this.state.language === "English" ? "English" : this.state.detectedLanguage;

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `What's the list of law firm industry and practice groups that ${articleCopy} should fall under?. The response must be provided in "${languageToUse}".`,
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

      const generatedResponse = response.data.choices[0].message.content;
      this.setState({
        generatedResponse,
        showWordCount: false,
        showEditButton: false,
      });

      const headerText = "Based on its content and subject matter, this thought leadership piece could be linked to the following industry and practice groups:";
      this.setState({ headerText });

    } catch (error) {
      this.handleError("classificationAPI:", error);
    }
  }

  handleChange = (event) => {
    let target = event.target;
    let name = target.name;
    this.setState({
      [name]: event.target.value,
    });
    this.getLanguage();
  };

  clearState = (event) => {
    let headerText = "Reviewing your content...";
    let generatedResponse = "";
    this.setState({
      headerText,
      generatedResponse,
      showWordCount: false
    });
  }

  handleNewRequest = () => {
    this.setState({
      articleTitle: "",
      articleCopy: "",
      generatedResponse: "",
      showWordCount: false,
      showEditButton: false,
      error: null,
      responseDisplay: false,
      headerText: "",
    });
  };

  handleCancel = (event) => {
    window.location.replace("./components/request");
  };

  copyToClipboard(generatedResponse) {
    if (!navigator.clipboard) {
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

  componentDidMount() {
    console.log("Request Data Component Mounted!");
    this.adjustTextareaSize();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.generatedResponse !== this.state.generatedResponse) {
      this.adjustTextareaSize();
      this.updateWordCount();
    }
  }

  updateWordCountEditing = () => {
    const editedResponse = this.state.editedResponse;
    const wordCount = editedResponse.split(/\s+/).filter(Boolean).length;
    const characterCount = editedResponse.length;
    this.setState({ wordCount, characterCount });
  }

  updateWordCount = () => {
    const generatedResponse = this.state.generatedResponse;
    const words = generatedResponse.trim().split(/\s+/);
    const wordCount = words.length;
    const characterCount = generatedResponse.length;
    this.setState({ wordCount, characterCount });
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

  isEditingInProgress = () => {
    if (this.state.isEditing) {
      alert("Please click 'Done Editing' before continuing.");
      return true;
    }
    return false;
  }

  getLanguage = () => {
    const detectedLanguage = franc(this.state.articleCopy);
    this.setState({ detectedLanguage });
  };

  handleLanguageChange = (event) => {
    this.setState({ language: event.target.value }, () => {
      if (this.state.language === "English") {
        this.setState({ detectedLanguage: "English" });
      } else {
        this.getLanguage();
      }
    });
  };

  render() {
    return (
      <div>
        <div className="split-screen">
          <div className="left-panel">
            <h1>
              <b>Your Content</b>
            </h1>
            <div>
              Response Language:
              <label className="language-button">
                <input
                  type="radio"
                  name="language"
                  value="English"
                  checked={this.state.language === "English"}
                  onChange={this.handleLanguageChange}
                />
                English
              </label>
              <label className="language-button">
                <input
                  type="radio"
                  name="language"
                  value="Original Language"
                  checked={this.state.language === "Original Language"}
                  onChange={this.handleLanguageChange}
                />
                Original Language
              </label>
            </div>
            <br />
            <div className="container-fluid">
              <div className="QueryForm">
                <form className="FormField">
                  <label htmlFor="articleTitle">Title: </label>
                  <textarea
                    className="article-title"
                    id="articleTitle"
                    name="articleTitle"
                    placeholder="Title"
                    value={this.state.articleTitle}
                    onChange={this.handleChange}
                    ref={(input) => { this.articleTitleInput = input; }}
                    onInput={() => this.adjustInputHeight(this.articleTitleInput)}
                  />
                  <br />
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
            <h1>
              <b><em>Amplify</em> AI Review</b>
            </h1>
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
                      {this.state.showEditButton ? (
                        <button className="button-19" onClick={this.enterEditMode}>
                          Edit Response
                        </button>
                      ) : null}
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
                  <b>Editorial</b>
                </h4>
                <div className="button-container">
                  <button className="button-19" onClick={this.titleAnalysisAPI} title="Amplify infers the target audience for your content, and then reviews how well the piece and its title speak to that particular audience.">Audience</button>
                  <button className="button-19" onClick={this.takeawaysAPI} title="Amplify extracts the top five takeaways of your piece as it is written. You can compare them to the takeaways you'd like to leave with readers to ensure you're sending the right message.">Takeaways</button>
                  <button className="button-19" onClick={this.altTitlesAPI} title="Amplify drafts three alternative titles you may want to consider for your piece, and explains its choice for each.">Alt Titles</button>
                  {/* <button className="button-19" onClick={this.classificationAPI} title="Amplify identifies the practice and industry groups you may wish to use for classifying your content.">Services</button> */}
                </div>
                <div>
                  <p><em>Amplify</em> reviews your work to confirm it communicates the right takeaways to the audience you're targeting. We also can suggest alternative titles for your consideration. </p>
                </div>
              </div>
              <div>
                <br />
                <h4>
                  <b>Marketing</b>
                </h4>

                <div className="button-container">
                  <button className="button-19" onClick={this.synopsisAPI} title="Amplify drafts a short synopsis of your thought leadership that you can use in an email blast to clients and potential clients.">Email</button>
                  <button className="button-19" onClick={this.socialMediaAPI} title="Amplify drafts three short posts that you can use for promoting your work on X (formerly Twitter).">Twitter</button>
                  <button className="button-19" onClick={this.linkedInAPI} title="Amplify drafts a longer post that can be used to promote the piece on LinkedIn.">LinkedIn</button>
                  <button className="button-19" onClick={this.abstractAPI} title="Amplify provides a short abstract of your thought leadership that you can use to describe the piece and who should read it when posting to your firm website.">Website</button>
                </div>
                <div>
                  <p><em>Amplify</em> draws on the power of AI to draft language you can use to promote your work via email, social and digital media, and on your website.</p>
                </div>
                <div className="spacer"></div>
              </div>
            </div>
          </div>
        </div>
        <button className="button-19" onClick={this.handleNewRequest}>New Request</button>
      </div>
    )
  }
}
export default RequestData;

