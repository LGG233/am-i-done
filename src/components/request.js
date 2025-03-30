import React, { Component } from "react";
import axios from "axios";
import "./css/request.css";
import { franc } from 'franc-min';

const languageNamesForPrompt = {
  eng: "English",
  fra: "French",
  spa: "Spanish",
  deu: "German",
  zho: "Chinese",
  cmn: "Chinese (Simplified)",
  jpn: "Japanese",
  kor: "Korean",
  por: "Portuguese",
  rus: "Russian",
  ara: "Arabic",
  ita: "Italian",
  nld: "Dutch",
  swe: "Swedish",
  tur: "Turkish",
  heb: "Hebrew",
  pol: "Polish",
  dan: "Danish",
  fin: "Finnish",
  hun: "Hungarian",
  ron: "Romanian",
  ell: "Greek",
  nor: "Norwegian",
  tha: "Thai",
  hin: "Hindi"
};

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



  handleError = (methodName, error) => {
    console.error(`Error calling ${methodName}:`, error);
  }

  titleAnalysisAPI = async () => {
    if (this.isEditingInProgress()) {
      return;
    }
    this.clearState()

    const languageToUse = languageNamesForPrompt[this.state.languageToUse] || "English";

    try {
      const { articleCopy, articleTitle } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `You are the Chief Marketing Officer (CMO) of one of the world's largest law firms. You have deep experience in both the legal profession and marketing legal services to corporate and institutional clients. 

              Based on the language and framing of the following article:
              "${articleCopy}"
              
              1. In a single sentence, list the likely occupations of the intended audience. Do not include generic terms like "legal professionals."
              
              2. Then evaluate how well the piece positions itself to reach that audience. Consider the clarity of the introduction, the focus of the content, and any regional relevance.
              
              3. Assess whether the title "${articleTitle}" clearly identifies the audience and conveys why they should read the piece. If a title is not provided, or if the title fails to effectively position the article, propose three strong alternative titles. For each proposed title, briefly explain why it works.
              
              Respond in "${languageToUse}".`
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

    const languageToUse = languageNamesForPrompt[this.state.languageToUse] || "English";

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `You are the CMO of one of the top law firms in the country. You are reviewing a draft of legal thought leadership intended for a professional audience.

              Please perform the following tasks:
              
              1. Read the text below carefully:
              "${articleCopy}"
              
              2. Identify the five most salient takeaways — the key points or conclusions the article communicates to its intended audience.
              
              3. Summarize each takeaway clearly and concisely in a single sentence.
              
              4. Provide the takeaways in a numbered list.
              
              The response must be provided in "${languageToUse}".`
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

    const languageToUse = languageNamesForPrompt[this.state.languageToUse] || "English";

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `You are the CMO of one of the top law firms in the country. You want to guide your lawyers to produce solutions-oriented thought leadership that is clear, concise, and directly relevant to clients.

              Please perform the following tasks:
              
              1. Read the text below:
              "${articleCopy}"
              
              2. Based on the content and intended audience, propose **three potential titles** for the piece. The titles should:
                 - Communicate who should read it
                 - Convey why it matters
                 - Avoid overt references to the intended audience
              
              3. Format each title as follows:
                 - Enclose the title in quotation marks
                 - Add a single sentence explaining why it was proposed
                 - Separate the title from the explanation using two hyphens, like this: --
                 - Do **not** include line breaks between titles
              
              4. Provide the output as a **numbered list**.
              
              5. If no title is provided with the article, assume the author is seeking new title suggestions and proceed accordingly.
              
              The response must be provided in "${languageToUse}".`
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

    const languageToUse = languageNamesForPrompt[this.state.languageToUse] || "English";

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `You are the Chief Marketing Officer of a leading law firm. Your role is to review legal thought leadership before publication on the firm’s website.

              Write a 150-word abstract for the article below. Your goal is to entice the right audience to click through and read the full piece.
              
              Follow these instructions carefully:
              1. Use clear, compelling, and professional language suitable for a website.
              2. Clearly indicate who the article is for and why that audience should care.
              3. Do not include first-person language or phrases like “As the CMO...” — this is not a personal message.
              4. Write in the third person.
              5. Do not summarize every detail. Focus on what will make the right reader want to click.
              
              Here is the article: "${articleCopy}"
              
              Your response must be provided in "${languageToUse}".`,
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

    const languageToUse = languageNamesForPrompt[this.state.languageToUse] || "English";

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `You are the Chief Marketing Officer of a top-tier law firm, preparing social media copy to promote a new piece of legal thought leadership.

              Your task is to write **three Twitter/X posts** that meet the following criteria:
              1. Each post must clearly communicate **who should read the article** and **why it matters** to that audience.
              2. Use clear, concise, and compelling language — **no more than 120 characters** total (including spaces and hashtags).
              3. Include at least **three relevant professional hashtags** in each post.
              4. Return your response as a **numbered list** (1, 2, 3).
              
              Here is the article: "${articleCopy}"
              
              Your response must be provided in "${languageToUse}".`,
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

      const headerText = "Here are three draft X (Twitter) posts for your consideration.";
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

    const languageToUse = languageNamesForPrompt[this.state.languageToUse] || "English";

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `You are the Chief Marketing Officer of a leading law firm, preparing a LinkedIn post to promote the thought leadership article below.

              Follow these instructions carefully:
              
              1. Write a clear and compelling abstract of the article, no longer than 150 words.
              2. The tone should be professional, informative, and engaging.
              3. Make it obvious:
                 - Who the article is for (intended audience)
                 - Why they should care (value or insight the piece offers)
              4. End with 2–3 relevant professional hashtags.
              5. Do not write in the first person. This is a firm-branded post, not a personal one.
              
              Here is the article: "${articleCopy}"
              
              Your response must be provided in "${languageToUse}".`,
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

    const languageToUse = languageNamesForPrompt[this.state.languageToUse] || "English";

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `You are the Chief Marketing Officer of a leading law firm, reviewing legal thought leadership for publication on the firm’s website.

              Follow these instructions carefully:
              
              1. Write a 150-word abstract summarizing the article below.
              2. Use clear and compelling language to encourage the right audience to read more.
              3. Make sure the abstract answers:
                 - Who should read this article?
                 - Why is it important for them to do so?
              4. Write in the voice of the firm — not in the first person. Do not include language like “As the CMO…”
              
              Here is the article: "${articleCopy}"
              
              Your response must be provided in "${languageToUse}".`,
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

      const headerText = "Here's a brief overview of your thought leadership that you can use to promote it on your website:";
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

    const languageToUse = languageNamesForPrompt[this.state.languageToUse] || "English";

    try {
      const { articleCopy } = this.state;
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "user",
              content: `You are the Chief Marketing Officer of one of the world’s largest law firms. You are reviewing the following article to determine how it should be categorized for marketing, website tagging, and CRM purposes.

              Follow these instructions:
              
              1. Read the article and identify the five most relevant law firm **practice groups**.
              2. Identify the five most relevant **industry groups**.
              3. Provide your response in two clearly labeled lists:
                 - Practice Groups — e.g., Litigation, Mergers & Acquisitions, Data Privacy
                 - Industry Groups — e.g., Healthcare, Financial Services, Technology
              
              Here is the article: "${articleCopy}"
              
              Your response must be provided in "${languageToUse}".`,
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
    console.log("Detected language from pasted article:", franc(pastedText));
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
    console.log("Language selected:", selectedLanguage);

    if (selectedLanguage === "English") {
      this.setState({
        language: selectedLanguage,
        languageToUse: "eng" // ISO code
      }, () => {
        console.log("Set languageToUse to:", this.state.languageToUse);
      });
    } else if (selectedLanguage === "Original Language") {
      const { articleCopy } = this.state;
      const detected = franc(articleCopy);
      const finalLang = detected === 'und' ? 'unknown' : detected;

      this.setState({
        language: selectedLanguage,
        languageToUse: finalLang
      }, () => {
        console.log("Set languageToUse to:", this.state.languageToUse);
      });
    }
  };

  toggleLanguageOptions = () => {
    this.setState((prevState) => ({
      showAllLanguages: !prevState.showAllLanguages,
    }));
  };

  handleFullLanguageSelection = (code) => {
    console.log("Language selected from 'Other':", code);
    this.setState({
      language: "Other",
      languageToUse: code,
      showAllLanguages: false
    }, () => {
      console.log("Set languageToUse to:", this.state.languageToUse);
    });
  };

  render() {
    const languageAutonyms = {
      eng: "English",
      fra: "Français",
      spa: "Español",
      deu: "Deutsch",
      zho: "中文",
      cmn: "中文",      // cmn = Mandarin Chinese
      jpn: "日本語",
      kor: "한국어",
      por: "Português",
      rus: "Русский",
      ara: "العربية",
      ita: "Italiano",
      nld: "Nederlands",
      swe: "Svenska",
      tur: "Türkçe",
      heb: "עברית",
      pol: "Polski",
      dan: "Dansk",
      fin: "Suomi",
      hun: "Magyar",
      ron: "Română",
      ell: "Ελληνικά",
      nor: "Norsk",
      tha: "ไทย",
      hin: "हिन्दी"
    };

    const autonym = this.state.detectedLanguage
      ? `Original (${languageAutonyms[this.state.detectedLanguage] || "Language"})`
      : "Original";

    return (
      <div>
        <div className="split-screen">
          <div className="left-panel">
            <h1>
              <b>Your Content</b>
            </h1>
            <div className="language-select-buttons">
              <p><strong>Response Language:</strong></p>

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
                {autonym}
              </label>

              <label className="language-button" style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  name="language"
                  value="Other"
                  onClick={this.toggleLanguageOptions}
                  checked={this.state.language !== "English" && this.state.language !== "Original Language"}
                  readOnly
                />
                {this.state.showAllLanguages
                  ? "Hide ▲"
                  : `Other (${languageAutonyms[this.state.language] || "▼"})`}
              </label>
              {this.state.showAllLanguages && (
                <div className="language-dropdown">
                  {Object.entries(languageAutonyms).map(([code, label]) => (
                    <div
                      key={code}
                      className="language-option"
                      onClick={() => this.handleFullLanguageSelection(code)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>            <br />
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
                    onPaste={(e) => this.handleArticlePaste(e)}
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="right-panel">
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
                  <button className="button-19" onClick={() => { this.titleAnalysisAPI(); this.handlePaste(); }} title="AmplifAI infers the target audience for your content, and then reviews how well the piece and its title speak to that particular audience.">Audience</button>
                  <button className="button-19" onClick={() => { this.takeawaysAPI(); this.handlePaste(); }} title="AmplifAI extracts the top five takeaways of your piece as it is written. You can compare them to the takeaways you'd like to leave with readers to ensure you're sending the right message.">Takeaways</button>
                  <button className="button-19" onClick={() => { this.altTitlesAPI(); this.handlePaste(); }} title="AmplifAI proposes three titles - or alternative titles, if you provide one - that you may want to consider for your piece, and explains its choice for each.">Titles</button>
                  <button className="button-19" onClick={() => { this.classificationAPI(); this.handlePaste(); }} title="AmplifAI identifies practice and industry groups you may wish to use for classifying your content.">Services</button>
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
                  <button className="button-19" onClick={() => { this.synopsisAPI(); this.handlePaste(); }} title="AmplifAI drafts a short synopsis of your thought leadership that you can use in an email blast to clients and potential clients.">Email</button>
                  <button className="button-19" onClick={() => { this.socialMediaAPI(); this.handlePaste(); }} title="AmplifAI drafts three short posts that you can use for promoting your work on X (formerly Twitter).">Twitter</button>
                  <button className="button-19" onClick={() => { this.linkedInAPI(); this.handlePaste(); }} title="AmplifAI drafts a longer post that can be used to promote the piece on LinkedIn.">LinkedIn</button>
                  <button className="button-19" onClick={() => { this.abstractAPI(); this.handlePaste(); }} title="AmplifAI provides a short abstract of your thought leadership that you can use to describe the piece and who should read it when posting to your firm website.">Synopsis</button>
                </div>
                <div>
                  <p><em>AmplifAI</em> draws on the power of AI to draft language you can use to promote your work via email, social and digital media, and on your website.</p>
                </div>
                <div className="spacer"></div>
              </div>
            </div>
          </div>
        </div>
        <button className="button-19" onClick={() => { this.handleNewRequest(); this.handlePaste(); }} >New Request</button>
      </div>
    )
  }
}
export default RequestData;
