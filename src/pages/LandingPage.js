import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/LandingPage.css";
import FeatureCarousel from "../components/FeatureCarousel";

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className="hero">
                <h1>Refine your writing. <b>AmplifAI</b> your impact.</h1>
                <p>Enhance clarity, engagement, and influence with AI-powered insights.</p>
                <button className="cta-button" onClick={() => navigate("/app")}>
                    Get Started
                </button>
            </section>

            {/* Before/After Comparison */}
            <section className="demo">
                <h2>Sharpen Your Message</h2>
                <div className="demo-content">
                    <div className="before">
                        <h4>Your First Draft:</h4>
                        <p>
                            “This article outlines key considerations for businesses navigating new data privacy regulations. It explores potential compliance risks and offers insights into emerging best practices. As privacy laws continue to evolve, organizations should stay informed and adaptable.”
                        </p>
                    </div>
                    <div className="after">
                        <h4>AmplifAI Insight:</h4>
                        <p>
                            This content is broadly written and lacks a clear target audience — it could apply to anyone. Based on the tone and subject matter, the intended reader seems to be in-house legal counsel. To improve, make the audience explicit and frame the piece as strategic guidance tailored to GCs dealing with the business impact of shifting privacy laws. Use more direct language that highlights urgency, practical outcomes, and your authority on the issue.
                        </p>
                    </div>
                </div>
            </section>
            <div className="carousel-wrapper">
                <FeatureCarousel />
            </div>
        </div>
    );
};

export default LandingPage;