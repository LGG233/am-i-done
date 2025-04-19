// === Goal: Inject userProfile context into first request of session ===
// === Only do so if useContextForRequest is true ===
// === Reset injection when starting a new session ===

import React from "react";
import { isProfileIncomplete } from "../utils/profileUtils";
import { toast } from "react-toastify";

export default class RequestData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articleCopy: "",
      title: "",
      useContextForRequest: true,
      hasInjectedUserContext: false,
      showTooltip: false,
    };
  }

  startNewSession = () => {
    this.setState({
      articleCopy: "",
      title: "",
      hasInjectedUserContext: false,
    });
  };

  handlePaste = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  handleAnalyze = async () => {
    const {
      userContext,
      useUserContext,
      profile,
      showEditModal,
      onRequestData,
      onResponse,
      languageToUse,
    } = this.props;

    const {
      articleCopy,
      title,
      useContextForRequest,
      hasInjectedUserContext,
    } = this.state;

    // 🧠 Check if context use is enabled but profile is incomplete
    if (
      useContextForRequest &&
      useUserContext &&
      isProfileIncomplete(profile)
    ) {
      toast.warn("Your profile is incomplete.", {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        render: ({ closeToast }) => (
          <div>
            <p>Your profile is missing key details.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button
                onClick={() => {
                  closeToast();
                  showEditModal();
                }}
                style={{ background: "#ff6b35", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "4px" }}
              >
                Complete Profile
              </button>
              <button
                onClick={() => {
                  closeToast();
                  this.setState({ useContextForRequest: false }, this.handleAnalyze);
                }}
                style={{ background: "#888", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "4px" }}
              >
                Continue Anyway
              </button>
            </div>
          </div>
        ),
      });
      return;
    }

    let prompt = articleCopy;

    // 🧠 Inject user context only once per session
    if (useContextForRequest && useUserContext && !hasInjectedUserContext) {
      prompt = `${userContext}\n\n${articleCopy}`;
      this.setState({ hasInjectedUserContext: true });
    }

    const requestPayload = {
      title,
      body: prompt,
      language: languageToUse || "English", // fallback if not set
    };

    try {
      onRequestData(requestPayload);
      const response = await fetch("/api/titleAnalysisAPI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
      const data = await response.json();
      onResponse(data);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  render() {
    const { languageToUse } = this.props;

    return (
      <div className="QueryForm">
        <div className="language-header">
          <strong>Response Language:</strong>{" "}
          <label>
            <input
              type="radio"
              name="language"
              value="English"
              checked={languageToUse === "English"}
              onChange={() => this.props.setLanguageToUse("English")}
            />{" "}
            English
          </label>
          <label>
            <input
              type="radio"
              name="language"
              value="Original"
              checked={languageToUse === "Original"}
              onChange={() => this.props.setLanguageToUse("Original")}
            />{" "}
            Original
          </label>
          <label>
            <input
              type="radio"
              name="language"
              value="Other"
              checked={languageToUse === "Other"}
              onChange={() => this.props.setLanguageToUse("Other")}
            />{" "}
            Other (▼)
          </label>
        </div>
      </div>
    );
  }
}