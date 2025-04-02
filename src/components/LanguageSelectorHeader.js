import React from "react";

const LanguageSelectorHeader = ({ language, detectedLanguage, showAllLanguages, onLanguageChange, onToggleLanguages, onFullLanguageSelect, onNewRequest, onSignOut }) => {
    const languageAutonyms = {
        eng: "English",
        fra: "Français",
        spa: "Español",
        deu: "Deutsch",
        zho: "中文",
        cmn: "中文",
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

    const autonym = detectedLanguage
        ? `Original (${languageAutonyms[detectedLanguage] || "Language"})`
        : "Original";

    return (
        <div className="header-controls">
            {/* <div className="session-buttons">
                <button className="button-19" onClick={onNewRequest}>New Request</button>
                <button className="button-19" onClick={onSignOut}>Sign Out</button>
            </div> */}

            <div className="language-select">
                <strong>Response Language:</strong>
                <label>
                    <input
                        type="radio"
                        name="language"
                        value="English"
                        checked={language === "English"}
                        onChange={onLanguageChange}
                    />
                    English
                </label>

                <label>
                    <input
                        type="radio"
                        name="language"
                        value="Original Language"
                        checked={language === "Original Language"}
                        onChange={onLanguageChange}
                    />
                    {autonym}
                </label>

                <label>
                    <input
                        type="radio"
                        name="language"
                        value="Other"
                        checked={language !== "English" && language !== "Original Language"}
                        onClick={onToggleLanguages}
                        readOnly
                    />
                    {showAllLanguages ? "Hide ▲" : `Other (${languageAutonyms[language] || "▼"})`}
                </label>

                {showAllLanguages && (
                    <div className="language-dropdown">
                        {Object.entries(languageAutonyms).map(([code, label]) => (
                            <div
                                key={code}
                                className="language-option"
                                onClick={() => onFullLanguageSelect(code)}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default LanguageSelectorHeader;
