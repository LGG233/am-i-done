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
import { sendToOpenAI } from "../utils/openaiClient";
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
  }

  runPromptRequest = async (promptFunction, includeTitle = false, headerText = "") => {
    if (this.isEditingInProgress()) return;

    const {
      useUserContext,
      userContext,
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

      if (useUserContext && userContext) {
        console.log("✅ userContext prepended to prompt:", userContext);
        messages.push({ role: "system", content: userContext });
      } else {
        console.log("🚫 userContext not used — either disabled or missing.");
      }

      messages.push({ role: "user", content: prompt });

      const result = await sendToOpenAI(messages);
      this.setState({ generatedResponse: result, showEditButton: true });
    } catch (error) {
      this.handleError("runPromptRequest", error);
    }
  };

  clearState = () => {
    this.setState({
      generatedResponse: "",
      headerText: "",
      altTitles: "",
      showEditButton: false,
      isEditing: false,
      editedResponse: "",
    });
  };

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
    const langCode = franc(pastedText);
    const finalLang = langCode === 'und' ? 'unknown' : langCode;

    this.setState(
      {
        articleCopy: pastedText,
        detectedLanguage: finalLang,
        language: "Original Language",
        languageToUse: finalLang,
        showAllLanguages: false
      },
      () => {
        this.adjustInputHeight(this.articleCopyTextarea);
        this.handlePaste();
      }
    );
  };

  adjustInputHeight = (input) => {
    if (input) {
      input.style.height = "auto";
      input.style.height = input.scrollHeight + "px";
    }
  };

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


  handleError = (methodName, error) => {
    console.error(`Error calling ${methodName}:`, error);
    toast.error("Something went wrong. Please try again.");
  };

  isEditingInProgress = () => {
    if (this.state.isEditing) {
      toast.warn("Finish editing before starting a new request.");
      return true;
    }
    return false;
  };

  handleCopy = () => {
    const text = this.state.generatedResponse;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  handleEditToggle = () => {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
      editedResponse: prevState.generatedResponse,
    }));
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
      this.adjustInputHeight(this.articleCopyTextarea)
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


  handleSaveEdit = () => {
    this.setState((prevState) => ({
      isEditing: false,
      generatedResponse: prevState.editedResponse,
    }));
    toast.success("Edit saved.");
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.handlePaste();
    this.setState({ [name]: value });

    if (name === "articleCopy") {
      const wordCount = value.trim().split(/\s+/).length;
      const characterCount = value.length;
      this.setState({ wordCount, characterCount, showWordCount: true });
    }
  };

  detectLanguage = (text) => {
    const langCode = franc(text);
    this.setState({ detectedLanguage: langCode });
  };

  // Restore advanced copy to clipboard with error handling
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

  // Resize API response textarea after render
  adjustTextareaSize = () => {
    if (this.generatedResponseTextarea) {
      const textarea = this.generatedResponseTextarea;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 20}px`;
    }
  };

  // Update word and character count for main response
  updateWordCount = () => {
    const generatedResponse = this.state.generatedResponse;
    const words = generatedResponse.trim().split(/\s+/);
    const wordCount = words.length;
    const characterCount = generatedResponse.length;
    this.setState({ wordCount, characterCount });
  };

  // Enter edit mode for generatedResponse
  enterEditMode = () => {
    this.setState({
      editedResponse: this.state.generatedResponse,
      isEditing: true,
    }, () => {
      this.updateWordCount();
      this.adjustEditingTextareaSize();
    });
  };

  // Exit edit mode and save edits
  exitEditMode = () => {
    this.setState({
      generatedResponse: this.state.editedResponse,
      isEditing: false,
    });
  };

  // Get detected language based on articleCopy
  getLanguage = () => {
    const langCode = franc(this.state.articleCopy);
    this.setState({
      detectedLanguage: langCode,
      languageToUse: langCode // if dropdown should switch to detected
    });
  }

  handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    if (selectedLanguage === "English") {
      this.setState({
        language: selectedLanguage,
        languageToUse: "eng",
        showAllLanguages: false
      });
    } else if (selectedLanguage === "Original Language") {
      const { articleCopy } = this.state;
      const detected = franc(articleCopy);
      const finalLang = detected === 'und' ? 'unknown' : detected;

      this.setState({
        language: selectedLanguage,
        languageToUse: finalLang,
        showAllLanguages: false
      });
    } else if (selectedLanguage === "Other") {
      this.setState({
        language: selectedLanguage,
        showAllLanguages: true // 🔥 This is what was missing
      });
    }
  };

  // Toggle dropdown to show all languages
  toggleLanguageOptions = () => {
    this.setState((prevState) => ({
      showAllLanguages: !prevState.showAllLanguages,
    }));
  };

  // Handle manual selection of language code (e.g., "fra")
  handleFullLanguageSelection = (code) => {
    this.setState({
      language: "Other",
      languageToUse: code,
      showAllLanguages: false
    });
  };

  render() {
    const {
      articleTitle,
      articleCopy,
      generatedResponse,
      headerText,
      wordCount,
      characterCount,
      showWordCount,
      isEditing,
      editedResponse,
    } = this.state;

    return (
      <div className="split-screen">
        <div className="left-panel">
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
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={this.props.useUserContext}
                onChange={() =>
                  this.props.setUseUserContext(!this.props.useUserContext)
                }
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
                  value={articleTitle}
                  onChange={this.handleInputChange}
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
                  value={articleCopy}
                  onChange={this.handleInputChange}
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
              {headerText}
            </p>
          </div>
          <div>
            {isEditing ? (
              <div>
                <p4>EDITING</p4>
                <textarea
                  value={editedResponse}
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
                {generatedResponse && (
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
            {(generatedResponse || isEditing) && showWordCount && (
              <div className="word-count">
                Words: {wordCount} | Characters: {characterCount}
              </div>
            )}            <div>
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
                  Audience Check
                </button>

                <button
                  className="button-19"
                  onClick={() => {
                    this.runPromptRequest(
                      keyTakeawaysPrompt,
                      false,
                      "Top five takeaways from your article, according to AmplifAI:",
                    );
                    this.handlePaste();
                  }}
                  title="AmplifAI extracts the top five takeaways of your piece as it is written."
                >
                  AI Takeaways
                </button>

                <button
                  className="button-19"
                  onClick={() => {
                    this.runPromptRequest(
                      altTitlesPrompt,
                      true,
                      "AI-suggested alternative titles:",
                    );
                    this.handlePaste();
                  }}
                  title="AmplifAI proposes more audience-focused or specific titles."
                >
                  Alternate Titles
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
                  Practice Focus
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
      </div >
    )
  }
}
export default RequestData;
