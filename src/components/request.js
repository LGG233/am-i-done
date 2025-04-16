import React, { Component } from "react";
import "../css/request.css";
import LanguageSelectorHeader from './LanguageSelectorHeader';
import { franc } from 'franc-min';
import {
  analyzeAudiencePrompt,
  keyTakeawaysPrompt,
  altTitlesPrompt,
  websiteAbstractPrompt,
} from "../promptBuilders/editorial";
import {
  emailSynopsisPrompt,
  socialMediaPrompt,
  linkedInPrompt,
  taggingSuggestionsPrompt,
} from "../promptBuilders/marketing";
import { sendToOpenAI } from "../utils/openaiClient"; // 👈 at top of file
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
  };

  runPromptRequest = async (promptFunction, includeTitle = false, headerText = "") => {
    if (this.isEditingInProgress()) return;

    const {
      useUserContext,
      userContext,
      hasUsedContext,
      setHasUsedContext,
    } = this.props;

    this.clearState();
    toast.info("Working on your request...", { autoClose: 2500 });

    this.setState({
      headerText: headerText || "Analyzing your content...",
      generatedResponse: "",
    });

    try {
      const {
        articleCopy,
        articleTitle,
        languageToUse
      } = this.state;

      const language = languageToUse || "English";
      const prompt = await promptFunction(articleCopy, articleTitle, language);
      const messages = [];

      if (useUserContext && !hasUsedContext && userContext) {
        messages.push({ role: "system", content: userContext });
        setHasUsedContext(true);
      }

      messages.push({ role: "user", content: prompt });
      const response = await sendToOpenAI(messages);

      this.setState({
        generatedResponse: response,
        responseDisplay: true,
      });

    } catch (error) {
      console.error("API call failed:", error);
      toast.error("Something went wrong. Please try again.");
      this.setState({ error });
    }
  };

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
                <div className="context-toggle mb-4">
                  <label className="form-label">
                    <input
                      type="checkbox"
                      checked={this.state.useContextForRequest}
                      onChange={() =>
                        this.setState((prevState) => ({
                          useContextForRequest: !prevState.useContextForRequest,
                        }))
                      }
                      className="context-checkbox"
                    />
                    Use my profile to personalize responses
                    <span className="tooltip-container">
                      <span className="info-icon">i</span>
                      <span className="tooltip-text">
                        Check this box to let AmplifAI personalize suggestions based on your saved profile details, including tone, target audience, and writing style.
                      </span>
                    </span>
                  </label>
                </div>
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
                  <button
                    className="button-19"
                    onClick={() => {
                      this.runPromptRequest(
                        analyzeAudiencePrompt,
                        false,
                        "Analyzing your audience...",
                      );
                      this.handlePaste();
                    }}
                    title="AmplifAI analyzes your article's clarity, positioning, and the intended audience."
                  >
                    Audience
                  </button>

                  <button
                    className="button-19"
                    onClick={() => {
                      this.runPromptRequest(
                        keyTakeawaysPrompt,
                        false,
                        "Here are the top five takeaways from your article:",
                      );
                      this.handlePaste();
                    }}
                    title="AmplifAI extracts the top five takeaways of your piece as it is written."
                  >
                    Takeaways
                  </button>

                  <button
                    className="button-19"
                    onClick={() => {
                      this.runPromptRequest(
                        altTitlesPrompt,
                        true,
                        "Here are some alternative title suggestions:",
                      );
                      this.handlePaste();
                    }}
                    title="AmplifAI proposes more audience-focused or specific titles."
                  >
                    Titles
                  </button>

                  <button
                    className="button-19"
                    onClick={() => {
                      this.runPromptRequest(
                        taggingSuggestionsPrompt,
                        false,
                        "Here are suggested practice and industry group tags for this article:",
                      );
                      this.handlePaste();
                    }}
                    title="AmplifAI suggests law firm tags based on content: practice groups and industries."
                  >
                    Practices
                  </button>

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
                  <button
                    className="button-19"
                    onClick={() => {
                      this.runPromptRequest(
                        emailSynopsisPrompt,
                        false,
                        "Here’s a 150-word promotional email for this article:",
                      );
                      this.handlePaste();
                    }}
                    title="AmplifAI writes a client-friendly email promoting your article."
                  >
                    Email
                  </button>

                  <button
                    className="button-19"
                    onClick={() => {
                      this.runPromptRequest(
                        socialMediaPrompt,
                        false,
                        "Here are three Twitter/X posts for promoting your article:",
                      );
                      this.handlePaste();
                    }}
                    title="AmplifAI writes three concise social posts with hashtags."
                  >
                    Social Media
                  </button>

                  <button
                    className="button-19"
                    onClick={() => {
                      this.runPromptRequest(
                        linkedInPrompt,
                        false,
                        "Here’s a LinkedIn post you could publish with the article:",
                      );
                      this.handlePaste();
                    }}
                    title="AmplifAI creates a thoughtful LinkedIn post for professional engagement."
                  >
                    LinkedIn
                  </button>

                  <button
                    className="button-19"
                    onClick={() => {
                      this.runPromptRequest(
                        websiteAbstractPrompt,
                        false,
                        "Here’s a 150-word abstract you could use on your website:",
                      );
                      this.handlePaste();
                    }}
                    title="AmplifAI generates a short, objective abstract for your website."
                  >
                    Website
                  </button>

                </div>
                <div>
                  <p><em>AmplifAI</em> draws on the power of AI to draft language you can use to promote your work via email, social and digital media, and on your website.</p>
                </div>
                <div className="spacer"></div>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
}
export default RequestData;
