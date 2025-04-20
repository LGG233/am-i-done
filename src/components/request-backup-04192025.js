// === request.js — Fully restored version with all features merged ===

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
            generatedResponse: "",
            editedResponse: "",
            headerText: "",
            wordCount: 0,
            characterCount: 0,
            showWordCount: false,
            showEditButton: false,
            isEditing: false,
            detectedLanguage: "",
            language: "English",
            languageToUse: "eng",
            showAllLanguages: false,
        };
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleArticlePaste = (event) => {
        const pastedText = event.clipboardData.getData("text");
        const detected = franc(pastedText);
        this.setState({
            articleCopy: pastedText,
            detectedLanguage: detected,
            language: detected === "eng" ? "English" : "Original Language",
            languageToUse: detected === "und" ? "unknown" : detected,
        }, () => {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                if (this.articleCopyRef) {
                    this.articleCopyRef.scrollTop = 0;
                    this.articleCopyRef.selectionStart = 0;
                    this.articleCopyRef.selectionEnd = 0;
                    this.articleCopyRef.focus();
                }
            }, 100);
        });
    };

    handleLanguageChange = (event) => {
        const selected = event.target.value;
        if (selected === "English") {
            this.setState({ language: selected, languageToUse: "eng" });
        } else if (selected === "Original Language") {
            const { articleCopy } = this.state;
            const detected = franc(articleCopy);
            this.setState({
                language: selected,
                languageToUse: detected === "und" ? "unknown" : detected,
            });
        }
    };

    runPromptRequest = async (promptFunction, includeTitle = false, headerText = "") => {
        if (this.state.isEditing) {
            alert("Please click 'Done Editing' before continuing.");
            return;
        }

        const { articleCopy, articleTitle, languageToUse } = this.state;
        const { useUserContext, userContext, onRequestData, onResponse } = this.props;

        toast.info("Working on your request...", { autoClose: 2500 });
        this.setState({
            headerText: headerText || "Analyzing your content...",
            generatedResponse: "",
            showWordCount: false,
            showEditButton: false,
        });

        let modifiedCopy = articleCopy;
        if (useUserContext && userContext) {
            modifiedCopy = `${userContext.trim()}\n\n${articleCopy}`;
        }

        const prompt = await promptFunction(modifiedCopy, articleTitle, languageToUse);
        onRequestData({ title: articleTitle, body: prompt, language: languageToUse });

        try {
            const response = await sendToOpenAI([{ role: "user", content: prompt }]);
            this.setState({
                generatedResponse: response,
                showWordCount: true,
                showEditButton: true,
                headerText,
            });
            onResponse(response);
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
            console.error(err);
        }
    };

    enterEditMode = () => {
        this.setState({
            isEditing: true,
            editedResponse: this.state.generatedResponse,
        }, this.updateWordCount);
    };

    exitEditMode = () => {
        this.setState({
            generatedResponse: this.state.editedResponse,
            isEditing: false,
        });
    };

    updateWordCount = () => {
        const text = this.state.isEditing ? this.state.editedResponse : this.state.generatedResponse;
        const words = text.trim().split(/\s+/);
        this.setState({
            wordCount: words.length,
            characterCount: text.length,
        });
    };

    copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success("Copied to clipboard!");
        }).catch(() => {
            toast.error("Failed to copy. Try again.");
        });
    };

    render() {
        const {
            articleTitle, articleCopy, language, detectedLanguage,
            generatedResponse, editedResponse, isEditing,
            wordCount, characterCount, showWordCount,
            showEditButton, headerText
        } = this.state;
        const { useUserContext, setUseUserContext } = this.props;

        return (
            <div className="split-screen">
                <div className="left-panel">
                    <br />
                    <LanguageSelectorHeader
                        language={language}
                        detectedLanguage={detectedLanguage}
                        showAllLanguages={this.state.showAllLanguages}
                        onLanguageChange={this.handleLanguageChange}
                        onToggleLanguageOptions={() =>
                            this.setState((prev) => ({ showAllLanguages: !prev.showAllLanguages }))}
                        onSelectFullLanguage={(code) =>
                            this.setState({ language: "Other", languageToUse: code, showAllLanguages: false })}
                        onNewRequest={() =>
                            this.setState({ articleTitle: "", articleCopy: "" })}
                        onSignOut={() => window.location.replace("/login")}
                    />

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
                            </label>
                        </div>

                        <form className="FormField">
                            <p className="form-instruction">
                                Paste your article title and body below, then choose a tool to enhance your content.
                            </p>
                            <label htmlFor="articleTitle">Title:</label>
                            <textarea
                                className="article-title"
                                id="articleTitle"
                                name="articleTitle"
                                placeholder="Title"
                                value={articleTitle}
                                onChange={this.handleChange}
                                onPaste={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            />

                            <label htmlFor="articleCopy">Body:</label>
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

                <div className="right-panel">
                    <div className="new-request-wrapper">
                        <button className="button-19 new-request-button"
                            onClick={() => this.setState({ articleTitle: "", articleCopy: "", generatedResponse: "" })}>
                            New Request
                        </button>
                    </div>

                    <h1><b><em>AmplifAI</em> Review</b></h1>
                    <p>{headerText}</p>

                    {isEditing ? (
                        <div>
                            <textarea
                                value={editedResponse}
                                onChange={(e) => this.setState({ editedResponse: e.target.value }, this.updateWordCount)}
                                className="api-editing-textbox"
                            />
                            <button className="button-19" onClick={() => this.copyToClipboard(editedResponse)}>Copy</button>
                            <button className="button-19" onClick={this.exitEditMode}>Done Editing</button>
                        </div>
                    ) : (
                        <div>
                            {generatedResponse && (
                                <>
                                    <textarea
                                        readOnly
                                        value={generatedResponse}
                                        className="api-response-textbox"
                                    />
                                    <button className="button-19" onClick={() => this.copyToClipboard(generatedResponse)}>Copy</button>
                                    {showEditButton && <button className="button-19" onClick={this.enterEditMode}>Edit</button>}
                                </>
                            )}
                        </div>
                    )}

                    {showWordCount && (
                        <div className="showWordCount">
                            <p className="counts">Words: {wordCount}</p>
                            <p className="counts">Characters: {characterCount}</p>
                        </div>
                    )}

                    <h4><b>Editorial</b></h4>
                    <div className="button-container">
                        <button className="button-19" onClick={() => this.runPromptRequest(analyzeAudiencePrompt, false, "Analyzing your audience...")}>Audience Check</button>
                        <button className="button-19" onClick={() => this.runPromptRequest(keyTakeawaysPrompt, false, "Here are the top five takeaways from your article:")}>Takeaways</button>
                        <button className="button-19" onClick={() => this.runPromptRequest(altTitlesPrompt, true, "Here are some alternative title suggestions:")}>Title Review</button>
                        <button className="button-19" onClick={() => this.runPromptRequest(taggingSuggestionsPrompt, false, "Here are suggested practice and industry group tags for this article:")}>Practice Review</button>
                    </div>

                    <h4><b>Marketing</b></h4>
                    <div className="button-container">
                        <button className="button-19" onClick={() => this.runPromptRequest(emailSynopsisPrompt, false, "Here’s a 150-word promotional email for this article:")}>Email</button>
                        <button className="button-19" onClick={() => this.runPromptRequest(socialMediaPrompt, false, "Here are three Twitter/X posts for promoting your article:")}>Social Media</button>
                        <button className="button-19" onClick={() => this.runPromptRequest(linkedInPrompt, false, "Here’s a LinkedIn post you could publish with the article:")}>LinkedIn</button>
                        <button className="button-19" onClick={() => this.runPromptRequest(websiteAbstractPrompt, false, "Here’s a 150-word abstract you could use on your website:")}>Website</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default RequestData;
