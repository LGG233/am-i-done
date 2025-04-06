import React from "react";

const HowItWorks = () => {
    return (
        <div className="how-it-works-page">
            <h1 className="page-title">How AmplifAI Works</h1>

            <section className="feature-section">
                <h2 className="feature-title">Audience</h2>
                <p className="feature-description">
                    AmplifAI analyzes your content and identifies the audience it's most likely to resonate with. This helps you quickly check alignment between your message and your intended readers — and can surface unexpected insights about tone, focus, or framing.
                </p>
            </section>

            <section className="feature-section">
                <h2 className="feature-title">Takeaways</h2>
                <p className="feature-description">
                    AmplifAI distills your article into 3–5 clear takeaways. More than just a summary, this feature acts as a mirror: it helps you compare what you <em>meant</em> to say with what the content actually conveys. It’s a fast and effective way to gauge clarity and coherence.
                </p>
            </section>

            <section className="feature-section">
                <h2 className="feature-title">Alternative Titles</h2>
                <p className="feature-description">
                    AmplifAI suggests fresh, attention-grabbing titles for your article. Whether you're seeking something more concise, more compelling, or just different, these options can sharpen your messaging or give you a creative nudge.
                </p>
            </section>

            <section className="feature-section">
                <h2 className="feature-title">Services</h2>
                <p className="feature-description">
                    AmplifAI recommends relevant Practice Areas and Industries based on the article’s content. These tags help categorize your thought leadership and make it easier for marketing teams to organize and promote across the firm’s platforms.
                </p>
            </section>

            <section className="feature-section">
                <h2 className="feature-title">Marketing Tools</h2>
                <p className="feature-description">
                    AmplifAI creates short-form copy for four key marketing channels:
                </p>
                <ul className="feature-list">
                    <li><strong>Email</strong> – A crisp subject line and body text designed for newsletters or client alerts.</li>
                    <li><strong>Social Media</strong> – A concise, engaging post you can drop into platforms like Twitter/X or Threads.</li>
                    <li><strong>LinkedIn</strong> – A slightly longer format, crafted to sound professional while encouraging engagement.</li>
                    <li><strong>Website</strong> – A short intro or blurb ideal for firm websites or blog landing pages.</li>
                </ul>
                <p className="feature-description">
                    Each tool is designed to reduce friction and help you get your insights in front of the right audience, faster.
                </p>
            </section>
        </div>
    );
};

export default HowItWorks;