// === request.js: Full version with preserved features and language detection fix ===

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
      language: "English",
      languageToUse: "eng",
      detectedLanguage: "",
      showAllLanguages: false,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleArticlePaste = (event) => {
    const pastedText = event.clipboardData.getData('text');
    const detected = franc(pastedText);
    this.setState({
      articleCopy: pastedText,
      detectedLanguage: detected,
      language: detected === 'eng' ? "English" : "Original Language"
    }, () => {
      console.log("Scroll to top triggered after paste");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
      // Scroll the textarea
      setTimeout(() => {
        if (this.articleCopyRef) {
          this.articleCopyRef.scrollTop = 0;
          this.articleCopyRef.selectionStart = 0;
          this.articleCopyRef.selectionEnd = 0;
          this.articleCopyRef.focus();
        }
      }, 150); // slight delay to allow rendering
    });
  };

  getLanguageName = (code) => {
    try {
      return new Intl.DisplayNames(["en"], { type: "language" }).of(code);
    } catch {
      return "Unknown";
    }
  }

  handleLanguageChange = (event) => {
    const selected = event.target.value;
    if (selected === "English") {
      this.setState({ language: selected, languageToUse: "eng" });
    } else if (selected === "Original") {
      const { articleCopy } = this.state;
      const detected = franc(articleCopy);
      this.setState({
        language: selected,
        languageToUse: detected === "und" ? "unknown" : detected,
      });
    } else {
      this.setState({ language: selected });
    }
  };

  runPromptRequest = async (promptFunction, includeTitle = false, headerText = "") => {
    const {
      articleTitle,
      articleCopy,
      languageToUse
    } = this.state;

    const { useUserContext, userContext, onRequestData, onResponse } = this.props;

    const prompt = await promptFunction(articleCopy, articleTitle, languageToUse);
    const messages = [];

    if (useUserContext && userContext) {
      messages.push({ role: "system", content: userContext });
    }

    messages.push({ role: "user", content: prompt });
    onRequestData({ title: articleTitle, body: prompt, language: languageToUse });

    try {
      const response = await sendToOpenAI(messages);
      onResponse(response);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  render() {
    const {
      articleTitle,
      articleCopy,
      language,
      detectedLanguage,
    } = this.state;
    const { setUseUserContext, useUserContext } = this.props;

    return (
      <div>
        <div className="split-screen">
          <div className="left-panel">
            <br />
            <LanguageSelectorHeader
              language={language}
              detectedLanguage={detectedLanguage}
              showAllLanguages={this.state.showAllLanguages}
              onLanguageChange={this.handleLanguageChange}
              onToggleLanguageOptions={() =>
                this.setState((prev) => ({
                  showAllLanguages: !prev.showAllLanguages,
                }))
              }
              onSelectFullLanguage={(code) =>
                this.setState({
                  language: "Other",
                  languageToUse: code,
                  showAllLanguages: false,
                })
              }
              onNewRequest={() =>
                this.setState({ articleTitle: "", articleCopy: "" })
              }
              onSignOut={() => window.location.replace("/login")}
            />
            <div className="container-fluid">
              <div className="QueryForm">
                <div className="context-toggle mb-4">
                  <label className="form-label">
                    <input
                      type="checkbox"
                      checked={useUserContext}
                      onChange={() => setUseUserContext((prev) => !prev)}
                      className="context-checkbox"
                    />
                    Use my profile to personalize responses
                    <span className="tooltip-container">
                      <span className="info-icon">i</span>
                      <span className="tooltip-text">
                        Check this box to let AmplifAI personalize suggestions based on your saved profile details.
                      </span>
                    </span>
                  </label>
                </div>
                <form className="FormField">
                  <p className="form-instruction">
                    Paste your article title and body below, then choose a tool to enhance your content.
                  </p>
                  <label htmlFor="articleTitle">
                    Title: <span className="tooltip-icon"> ⓘ </span>
                  </label>
                  <textarea
                    className="article-title"
                    id="articleTitle"
                    name="articleTitle"
                    placeholder="Title"
                    value={articleTitle}
                    onChange={this.handleChange}
                    onPaste={(e) => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                  <br />
                  <br />
                  <label htmlFor="articleCopy">
                    Body: <span className="tooltip-icon"> ⓘ </span>
                  </label>
                  <textarea
                    className="article-body"
                    id="articleCopy"
                    name="articleCopy"
                    placeholder="Content"
                    value={articleCopy}
                    onChange={this.handleChange}
                    onPaste={this.handleArticlePaste}
                    ref={(el) => { this.articleCopyRef = el; }}
                  />
                </form>
              </div>
            </div>
          </div>

          <div className="right-panel">
            <div className="new-request-wrapper">
              <button
                className="button-19 new-request-button"
                onClick={() => this.setState({ articleTitle: "", articleCopy: "" })}
              >
                New Request
              </button>
            </div>
            <h1><b><em>AmplifAI</em> Review</b></h1>
            <div>
              <p>AmplifAI reviews your work to confirm it communicates the right takeaways to the audience you're targeting.</p>
            </div>
            <div className="button-container">
              <button
                className="button-19"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  this.runPromptRequest(analyzeAudiencePrompt, false, "Analyzing your audience...");
                }}
              >
                Audience Check
              </button>
              <button className="button-19"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  this.runPromptRequest(keyTakeawaysPrompt, false, "Here are the top five takeaways from your article:");
                }}
              >
                Takeaways
              </button>
              <button className="button-19" onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                this.runPromptRequest(altTitlesPrompt, true, "Here are some alternative title suggestions:");
              }}
              >
                Title Review
              </button>
              <button className="button-19" onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                this.runPromptRequest(taggingSuggestionsPrompt, false, "Here are suggested practice and industry group tags for this article:");
              }}
              >
                Practice Review
              </button>
            </div>
            <div>
              <br />
              <h4><b>Marketing</b></h4>
              <div className="button-container">
                <button className="button-19"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    this.runPromptRequest(emailSynopsisPrompt, false, "Here’s a 150-word promotional email for this article:");
                  }}
                >Email
                </button>
                <button className="button-19" onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  this.runPromptRequest(socialMediaPrompt, false, "Here are three Twitter/X posts for promoting your article:");
                }}
                >
                  Social Media
                </button>
                <button className="button-19"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    this.runPromptRequest(linkedInPrompt, false, "Here’s a LinkedIn post you could publish with the article:");
                  }}
                >
                  LinkedIn
                </button>
                <button className="button-19"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    this.runPromptRequest(websiteAbstractPrompt, false, "Here’s a 150-word abstract you could use on your website:");
                  }}
                >
                  Website
                </button>
              </div>
              <p><em>AmplifAI</em> can help you promote your work via email, social, and web.</p>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default RequestData;
