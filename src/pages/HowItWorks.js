import React from "react";

const HowItWorks = () => {
    return (
        <div className="page-container">
            <h1>How It Works</h1>
            <p><strong>Write once. Publish everywhere.</strong></p>
            <p>
                AmplifAI helps lawyers amplify the reach of their thought leadership by generating
                marketing-ready summaries, blurbs, and posts — instantly.
            </p>

            <ol className="how-list">
                <li>
                    <strong>Paste your article:</strong> Drop in your draft — a finished piece or something still in progress.
                </li>
                <li>
                    <strong>Get smarter suggestions:</strong> AmplifAI analyzes your title, tone, and audience to offer
                    alternative titles, suggested takeaways, and promotional angles.
                </li>
                <li>
                    <strong>Generate usable content:</strong> With one click, you can create:
                    <ul>
                        <li>An email-ready synopsis</li>
                        <li>Social media blurbs</li>
                        <li>A LinkedIn-ready post</li>
                        <li>A short website abstract</li>
                    </ul>
                </li>
                <li>
                    <strong>Refine and repeat:</strong> Need to tweak your title or messaging? AmplifAI makes it easy to
                    generate fresh options until you get what you need.
                </li>
            </ol>
        </div>
    );
};

export default HowItWorks;