import React, { Component } from "react";
import "../css/request.css";
import LanguageSelectorHeader from './LanguageSelectorHeader';
import { franc } from 'franc-min';
import {
  analyzeAudienceApi,
  keyTakeawaysApi,
  altTitlesApi,
  emailSynopsisApi,
  socialMediaPostApi,
  linkedInPostApi,
  websiteAbstractApi,
  taggingSuggestionsApi
} from "../api/apiHelpers";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

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
      language: "English",
      showAllLanguages: false,
      languageToUse: "",
      isEditing: false,
      error: null,
    };

    this.baseUrl = "https://api.openai.com/v1/chat/completions";
  };

  runApiCall = async (apiFunction, includeTitle = false, headerText = "") => {
    if (this.isEditingInProgress()) return;

    this.clearState();
    toast.info("Working on your request...", { autoClose: 2500 });
    this.setState({
      headerText: "Analyzing your content...",
      generatedResponse: "",
      showWordCount: false,
      showEditButton: false
    });

    const articleCopy = this.state.articleCopy;
    const articleTitle = this.state.articleTitle;
    const language = this.state.languageToUse;

    try {
      const response = includeTitle
        ? await apiFunction(articleCopy, articleTitle, language)
        : await apiFunction(articleCopy, language);

      this.setState({
        generatedResponse: response,
        showWordCount: true,
        showEditButton: true,
        headerText,
      });
    } catch (error) {
      this.handleError(apiFunction.name, error);
    }
  }

  handleError = (methodName, error) => {
    console.error(`Error calling ${methodName}:`, error);
  }

  handlePaste = () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  handleArticlePaste = (event) => {
    const pastedText = event.clipboardData.getData('text');
    this.setState(
      { articleCopy: pastedText, detectedLanguage: franc(pastedText) },
      () => {
        this.adjustInputHeight(this.articleCopyTextarea);
        this.handlePaste(); // Optional scroll-to-top if needed
      }
    );
  };

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
      toast.error("Clipboard not supported. Please copy manually.");
      return;
    }

    navigator.clipboard.writeText(generatedResponse)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Clipboard error:", err);
        toast.error("Failed to copy. Try again.");
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
      const textarea = this.generatedResponseTextarea;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 20}px`;
    }
  };

  adjustEditingTextareaSize = () => {
    if (this.editedResponseTextarea) {
      this.editedResponseTextarea.style.height = "auto";
      this.editedResponseTextarea.style.height = this.editedResponseTextarea.scrollHeight + 16 + "px"; // add 16px buffer
    }
  };

  componentDidMount() {
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
      this.updateWordCount();
      this.adjustEditingTextareaSize(); // <-- add this
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
    const selectedLanguage = event.target.value;

    if (selectedLanguage === "English") {
      this.setState({
        language: selectedLanguage,
        languageToUse: "eng"
      }, () => {
      });
    } else if (selectedLanguage === "Original Language") {
      const { articleCopy } = this.state;
      const detected = franc(articleCopy);
      const finalLang = detected === 'und' ? 'unknown' : detected;

      this.setState({
        language: selectedLanguage,
        languageToUse: finalLang
      }, () => {
      });
    }
  };

  toggleLanguageOptions = () => {
    this.setState((prevState) => ({
      showAllLanguages: !prevState.showAllLanguages,
    }));
  };

  handleFullLanguageSelection = (code) => {
    this.setState({
      language: "Other",
      languageToUse: code,
      showAllLanguages: false
    }, () => {
    });
  };


  render() {
    return (
      <div>
        <div className="split-screen">
          <div className="left-panel">
            <br />
            <LanguageSelectorHeader
              language={this.state.language}
              detectedLanguage={this.state.detectedLanguage}
              showAllLanguages={this.state.showAllLanguages}
              onLanguageChange={this.handleLanguageChange}
              onToggleLanguageOptions={this.toggleLanguageOptions}
              onSelectFullLanguage={this.handleFullLanguageSelection}
              onNewRequest={this.handleNewRequest}
              onSignOut={this.handleCancel}
            />
            <div className="container-fluid">

              <div className="QueryForm">
                <form className="FormField">
                  <p className="form-instruction">
                    Paste your article title and body below, then choose a tool to enhance your content.
                  </p>
                  <label htmlFor="articleTitle">Title:
                    <span className="tooltip-icon" aria-label="Enter the title of your article."> ⓘ </span>
                  </label>
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
                  <label htmlFor="articleCopy">Body:
                    <span className="tooltip-icon" aria-label="Paste the full body of your article here, including all text you want AmplifAI to analyze and enhance. Avoid footnotes, citations, or formatting artifacts if possible."> ⓘ </span>
                  </label>
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
                    onPaste={(e) => this.handleArticlePaste(e)}
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="right-panel">
            <div className="new-request-wrapper">
              <button className="button-19 new-request-button" onClick={this.handleNewRequest}>
                New Request
              </button>
            </div>
            <h1>
              <b><em>AmplifAI</em> Review</b>
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
                        this.adjustEditingTextareaSize();
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
                          Edit
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
                  <button className="button-19" onClick={() => { this.runApiCall(analyzeAudienceApi, true, "Here's a review of your content and how well it speaks to its intended audience:"); this.handlePaste(); }} title="AmplifAI infers the target audience for your content, and then reviews how well the piece (and its title) speak to that particular audience.">Audience</button>
                  <button className="button-19" onClick={() => { this.runApiCall(keyTakeawaysApi, false, "Here are the top five takeaways from your article as currently written:"); this.handlePaste(); }} title="AmplifAI extracts the top five takeaways of your piece as it is written. You can compare them to the takeaways you'd like to leave with readers to ensure you're sending the right message.">Takeaways</button>
                  <button className="button-19" onClick={() => { this.runApiCall(altTitlesApi, true, "Here are three title suggestions (or alternatives) for your article, with reasoning:"); this.handlePaste(); }} title="AmplifAI proposes three titles - or alternative titles, if you provide one - that you may want to consider for your piece, and explains its choice for each.">Titles</button>
                  <button className="button-19" onClick={() => { this.runApiCall(taggingSuggestionsApi, false, "Here are the practice and industry groups that best match your article:"); this.handlePaste(); }} title="AmplifAI identifies practice and industry groups you may wish to use for classifying your content.">Services</button>
                </div>
                <div>
                  <p><em>AmplifAI</em> reviews your work to confirm it communicates the right takeaways to the audience you're targeting. We also can suggest alternative titles for your consideration. </p>
                </div>
              </div>
              <div>
                <br />
                <h4>
                  <b>Marketing</b>
                </h4>

                <div className="button-container">
                  <button className="button-19" onClick={() => { this.runApiCall(emailSynopsisApi, false, "Here's a short summary of your article that you can use in a marketing email:"); this.handlePaste(); }} title="AmplifAI drafts a short synopsis of your thought leadership that you can use in an email blast to clients and potential clients.">Email</button>
                  <button className="button-19" onClick={() => { this.runApiCall(socialMediaPostApi, false, "Here are three short posts you can use to promote your article on X (formerly Twitter) or other social media platforms:"); this.handlePaste(); }} title="AmplifAI drafts three short posts that you can use for promoting your work on X (formerly Twitter) or other social media platforms.">Social Media</button>
                  <button className="button-19" onClick={() => { this.runApiCall(linkedInPostApi, false, "Here's a short post you can use to promote your article on LinkedIn:"); this.handlePaste(); }} title="AmplifAI drafts a longer post that can be used to promote the piece on LinkedIn.">LinkedIn</button>
                  <button className="button-19" onClick={() => { this.runApiCall(websiteAbstractApi, false, "Here's a brief overview of your thought leadership that you can use to promote it on your website:"); this.handlePaste(); }} title="AmplifAI provides a short abstract of your thought leadership that you can use to describe the piece - and who should read it - when posting to your firm website.">Website</button>
                </div>
                <div>
                  <p><em>AmplifAI</em> draws on the power of AI to draft language you can use to promote your work via email, social and digital media, and on your website.</p>
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
