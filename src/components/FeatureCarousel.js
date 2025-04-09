// FeatureCarousel.jsx
import React, { useState, useEffect } from "react";
import "../css/LandingPage.css";

const features = [
    { title: "AI-Powered Analysis", description: "Receive actionable feedback to improve clarity and impact." },
    { title: "Clarity Checker", description: "Ensure your message is concise, structured, and audience-ready." },
    { title: "Title Refinement", description: "Optimize your titles for engagement and effectiveness." },
    { title: "Voice & Tone Enhancer", description: "Adapt your language to match audience expectations and platform context." },
    { title: "Professional Polish", description: "Make your writing sound confident, credible, and client-ready." },
    { title: "One-Click Marketing Copy", description: "Instantly generate compelling content for email, LinkedIn, social media, and more." },
    { title: "Audience Alignment", description: "Tailor your message to resonate with the right decision-makers." },
    { title: "Content Strategy Support", description: "Surface core themes, takeaways, and potential marketing hooks." },
];

export default function FeatureCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Rotate every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 2) % features.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const visibleFeatures = [
        features[currentIndex],
        features[(currentIndex + 1) % features.length],
    ];

    return (
        <section className="feature-carousel-section">
            <h2 className="section-heading">What AmplifAI Can Do</h2>
            <div className="fade-carousel">
                {visibleFeatures.map((feature, idx) => (
                    <div className="fade-card" key={idx}>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}