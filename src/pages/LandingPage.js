import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className="hero">
                <h1>refine your writing. <b>Amplify</b> your impact.</h1>
                <p>Enhance clarity, engagement, and influence with AI-powered insights.</p>
                <button className="cta-button" onClick={() => navigate("/app")}>
                    Get Started
                </button>
            </section>

            {/* Feature Highlights */}
            <section className="features">
                <div className="feature-card">
                    <h3>AI-Powered Analysis</h3>
                    <p>Receive actionable feedback to improve clarity and impact.</p>
                </div>
                <div className="feature-card">
                    <h3>Clarity Checker</h3>
                    <p>Ensure your message is concise, structured, and audience-ready.</p>
                </div>
                <div className="feature-card">
                    <h3>Title Refinement</h3>
                    <p>Optimize your titles for engagement and effectiveness.</p>
                </div>
            </section>

            {/* Preview/Demo Section */}
            <section className="demo">
                <h2>Before & After</h2>
                <div className="demo-content">
                    <div className="before">
                        <h4>Before:</h4>
                        <p>"This article explores various leadership techniques..."</p>
                    </div>
                    <div className="after">
                        <h4>After:</h4>
                        <p>"Master the art of leadership with proven techniques that drive results."</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

