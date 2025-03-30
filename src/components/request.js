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
              content: `You are the CMO of one of the world's largest law firms with significant understand of both the legal profession and the ways to market legal services. Based on the language and framing of "${articleCopy}", what are the occupations of the intended audience of the piece as it is written? Provide an answer to that question in a single sentence. Do not include 'legal professionals' in the list of occupations. Then answer these questions in additional paragraphs: "How well does the piece position itself to reach its target audience? Is it clear in the title "${articleTitle}", the introduction, and the framing that the article is for that audience? If the piece relates to a specific geographical region, do the article and title make that geography evident? How could the article and title do a better job to frame the content for the target audience? Does the title clearly convey who should read the article? Does it communicate why those people should read it? How? The response must be provided in "${languageToUse}".`,
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
              content: `You are the CMO of one of the top law firms in the country. You want to guide your lawyers to produce solutions-oriented thought leadership that is clear, concise, and most of all directly relevant to clients. You have been asked to read "${articleCopy}" to identiffy the five most salient takeaways to ensure that the key issues laid out in the article are in fact the points that the author wants to make? Please summarize Each takeaway in a single sentence and provide them as a numbered list. The response must be provided in "${languageToUse}".`,
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
              content: `You are the CMO of one of the top law firms in the country. You want to guide your lawyers to produce solutions-oriented thought leadership that is clear, concise, and most of all directly relevant to clients. A big part of that comes from properly positioning their thought leadership with a title that communicates who should read it and why they should read it. Accordingly, please provide three potential titles for "${articleCopy}" that achieve those objectives without overt references to the intended audience. Enclose each alternative title in quotation marks. Please explain in a single sentence each alternative title and why it was proposed, separating the title from the description using spaces and two hyphens. Do not include line breaks between alternative titles in the output string. Please provide the output in a numbered list. The response must be provided in "${languageToUse}".. Add two line breaks at the of the title`,
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
              content: `You are the CMO of one of the top law firms in the country. You want to write, in clear and compelling language, a 25-word synopsis of "${articleCopy}" that you include in an email that entices people to read it. It's critical to articulate in your synopsis who should read the article and why they should read it. The response must be provided in "${languageToUse}".`,
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
              content: `You are the CMO of one of the top law firms in the country. You want to write, in clear and compelling language, three compelling descriptions of "${articleCopy}" to promote the article on Twitter that communicate who should read the thought leadership and why they should read it. Include at least three appropriate hashtags.The entire post, including spaces and hashtags, should be no more than 120 characters. Please provide the output in a numbered list. The response must be provided in "${languageToUse}".`,
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
              content: `You are the CMO of one of the top law firms in the country. You want to write, in clear and compelling language, a 150-word abstract of "${articleCopy}" that you can use to promote the article on LinkedIn. It's critical to communicate, using clear and concise language, who should read the article and why it's important for them to read it. Include two or three professional hashtags at the end of the abstract. The response must be provided in "${languageToUse}".`,
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
              content: `You are the CMO of one of the top law firms in the country. You want to write, in clear and compelling language, a 150-word abstract of "${articleCopy}" that you can use to promote the thought leadership on your firm's website in a way that entices people to click through and read it. It's critical to articulate in your synopsis who should read the article and why they should read it. The response must be provided in "${languageToUse}".`,
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
              content: `You are the CMO of one of the largest law firms in the world. Using your knowledge of law firm services, what are the five most relevant practice groups and industry groups that should be associated with ${articleCopy} for marketing, website tagging, and CRM purposes? Please provide your answer in "${languageToUse}" in two separate lists: 1.	Practice Groups – e.g., Litigation, M&A, Data Privacy, and 2.	Industry Groups – e.g., Healthcare, Financial Services, Technology.`,
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
