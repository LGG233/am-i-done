import React, { useState } from "react";
import "../css/ProfileForm.css";
import { db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function ProfileForm({ user }) {
    const [profile, setProfile] = useState({
        fullName: user.displayName || "",
        email: user.email || "",
        jobTitle: "",
        firm: "",
        focusAreas: "",
        targetAudience: "",
        writingGoals: "",
        tonePreferences: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userDoc = doc(db, "users", user.uid); // 👈 Collection: 'users', Doc ID: uid
            await setDoc(userDoc, profile, { merge: true }); // 👈 Merge avoids overwriting name/email
            console.log("✅ Profile saved to Firestore:", profile);
        } catch (err) {
            console.error("🔥 Error saving profile:", err);
        }
    };

    return (
        <form className="profile-form" onSubmit={handleSubmit}>
            <label>
                Full Name
                <input type="text" name="fullName" value={profile.fullName} readOnly />
            </label>

            <label>
                Email Address
                <input type="email" name="email" value={profile.email} readOnly />
            </label>

            <label>
                Job Title
                <input type="text" name="jobTitle" value={profile.jobTitle} onChange={handleChange} />
            </label>

            <label>
                Firm / Organization
                <input type="text" name="firm" value={profile.firm} onChange={handleChange} />
            </label>

            <label>
                Focus Areas (e.g., M&A, Data Privacy, Litigation)
                <input type="text" name="focusAreas" value={profile.focusAreas} onChange={handleChange} />
            </label>

            <label>
                Target Audience
                <input type="text" name="targetAudience" value={profile.targetAudience} onChange={handleChange} />
            </label>

            <label>
                Writing Goals
                <textarea
                    name="writingGoals"
                    value={profile.writingGoals}
                    onChange={handleChange}
                    placeholder="e.g., Build reputation, attract clients, support speaking invitations"
                />
            </label>

            <label>
                Tone & Style Preferences
                <textarea
                    name="tonePreferences"
                    value={profile.tonePreferences}
                    onChange={handleChange}
                    placeholder="e.g., Professional but conversational, concise, practical"
                />
            </label>

            <button type="submit">Save Profile</button>
        </form>
    );
}