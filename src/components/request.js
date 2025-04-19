// === Goal: Restore full render layout and preserve context injection ===

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
      languageToUse: "",
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
      languageToUse: detected === 'und' ? 'unknown' : detected,
    });
  };

  handleLanguageChange = (event) => {
    const selected = event.target.value;
    if (selected === "English") {
      this.setState({ language: selected, languageToUse: "eng" });
    } else if (selected === "Original") {
      const detected = franc(this.state.articleCopy);
      this.setState({
        language: selected,
        languageToUse: detected === 'und' ? 'unknown' : detected,
      });
    } else {
      this.setState({ language: selected });
    }
  };

  render() {
    const { language, languageToUse, detectedLanguage } = this.state;

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
              onToggleLanguageOptions={() => this.setState(prev => ({ showAllLanguages: !prev.showAllLanguages }))}
              onSelectFullLanguage={(code) => this.setState({ language: "Other", languageToUse: code, showAllLanguages: false })}
              onNewRequest={() => this.setState({ articleTitle: "", articleCopy: "" })}
              onSignOut={() => window.location.replace("/login")}
            />
            <div className="container-fluid">
              <div className="QueryForm">
                <div className="context-toggle mb-4">
                  <label className="form-label">
                    <input
                      type="checkbox"
                      checked={this.props.useUserContext}
                      onChange={() => this.props.setUseUserContext(prev => !prev)}
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
                  <label htmlFor="articleTitle">Title:
                    <span className="tooltip-icon"> ⓘ </span>
                  </label>
                  <textarea
                    className="article-title"
                    id="articleTitle"
                    name="articleTitle"
                    placeholder="Title"
                    value={this.state.articleTitle}
                    onChange={this.handleChange}
                  />
                  <br />
                  <br />
                  <label htmlFor="articleCopy">Body:
                    <span className="tooltip-icon"> ⓘ </span>
                  </label>
                  <textarea
                    className="article-body"
                    id="articleCopy"
                    name="articleCopy"
                    placeholder="Content"
                    value={this.state.articleCopy}
                    onChange={this.handleChange}
                    onPaste={this.handleArticlePaste}
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="right-panel">
            <div className="new-request-wrapper">
              <button className="button-19 new-request-button" onClick={() => this.setState({ articleTitle: "", articleCopy: "" })}>
                New Request
              </button>
            </div>
            <h1><b><em>AmplifAI</em> Review</b></h1>
            <div>
              <p>AmplifAI reviews your work to confirm it communicates the right takeaways to the audience you're targeting.</p>
            </div>
            <div className="button-container">
              <button className="button-19">Audience Check</button>
              <button className="button-19">Takeaways</button>
              <button className="button-19">Title Review</button>
              <button className="button-19">Practice Review</button>
            </div>
            <div>
              <br />
              <h4><b>Marketing</b></h4>
              <div className="button-container">
                <button className="button-19">Email</button>
                <button className="button-19">Social Media</button>
                <button className="button-19">LinkedIn</button>
                <button className="button-19">Website</button>
              </div>
              <p><em>AmplifAI</em> can help you promote your work via email, social, and web.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestData;
