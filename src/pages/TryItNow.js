import React from "react";
import "../css/App.css";

export default function TryItNow() {
    return (
        <div className="try-page">
            <h1 className="page-title">Try AmplifAI Now</h1>
            <p className="page-description">
                AmplifAI is designed to help lawyers and legal marketers maximize the reach and impact of their thought leadership.
                Using AI, it delivers audience insights, key takeaways, alternative titles, and ready-to-use marketing copy.
            </p>

            <h2 className="subheading">What You Can Do</h2>
            <ul className="feature-list">
                <li>📌 Analyze your content to ensure it resonates with your target audience</li>
                <li>🧠 Extract and clarify key takeaways</li>
                <li>🎯 Suggest alternative titles for maximum engagement</li>
                <li>💼 Generate marketing-ready copy for email, LinkedIn, social media, and your website</li>
            </ul>

            <h2 className="subheading">Want to Try It?</h2>
            <p className="page-description">
                AmplifAI is currently in limited beta. If you'd like to be part of our testing group and help shape the product, let us know!
            </p>

            <a href="mailto:hello@amplifaiyourmessage.com?subject=AmplifAI Beta Access" className="beta-button">
                ✉️ Sign Up to Be a Beta Tester
            </a>
        </div>
    );
}