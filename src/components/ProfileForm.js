import React, { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "../css/ProfileForm.css";

export default function ProfileForm({ user }) {
    const [isEditing, setIsEditing] = useState(false);
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
    const [originalProfile, setOriginalProfile] = useState(null);

    // Load profile data on mount
    useEffect(() => {
        const loadUserProfile = async () => {
            if (!auth.currentUser) return;

            const userDocRef = doc(db, "userProfiles", auth.currentUser.uid);
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfile(data);
                    setOriginalProfile(data); // <-- Save a snapshot
                }
            } catch (err) {
                console.error("Error loading profile:", err);
            }
        };
        loadUserProfile();
    }, []);

    // Save profile to Firestore
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDocRef = doc(db, "userProfiles", auth.currentUser.uid);
        try {
            await setDoc(userDocRef, profile);
            setOriginalProfile(profile); // ✅ update the snapshot
            setIsEditing(false);         // ✅ exit edit mode
        } catch (err) {
            console.error("Error saving profile:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    if (!isEditing) {
        return (
            <div className="profile-container">
                <h2 className="section-heading">Contact Info</h2>
                <div className="profile-section-content">
                    <div>{profile.fullName}</div>
                    <div>{profile.email}</div>
                    <div>{profile.jobTitle}</div>
                    <div>{profile.firm}</div>
                </div>

                <h2 className="section-heading">Content Strategy</h2>
                <div className="profile-section-content">
                    <div className="profile-field">
                        <strong>Focus Areas:  </strong>{profile.focusAreas}<br />
                    </div>
                    <div className="profile-field">
                        <strong>Target Audience:  </strong>{profile.targetAudience}<br />
                    </div>
                    <div className="profile-field">
                        <strong>Writing Goals:  </strong>{profile.writingGoals}<br />
                    </div>
                    <div className="profile-field">
                        <strong>Tone Preferences:  </strong>{profile.tonePreferences}<br />
                    </div>
                </div>
                <br />
                <button className="edit-button" onClick={() => setIsEditing(true)}>
                    Edit Profile
                </button>
            </div>
        );
    }

    return (
        <form className="profile-form" onSubmit={handleSubmit}>
            <label>
                Full Name
                <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    readOnly
                />
            </label>

            <label>
                Email Address
                <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    readOnly
                />
            </label>

            <label>
                Job Title
                <input
                    type="text"
                    name="jobTitle"
                    value={profile.jobTitle}
                    onChange={handleChange}
                />
            </label>

            <label>
                Firm / Organization
                <input
                    type="text"
                    name="firm"
                    value={profile.firm}
                    onChange={handleChange}
                />
            </label>

            <label>
                Focus Areas (e.g., M&A, Data Privacy, Litigation)
                <input
                    type="text"
                    name="focusAreas"
                    value={profile.focusAreas}
                    onChange={handleChange}
                />
            </label>

            <label>
                Target Audience
                <input
                    type="text"
                    name="targetAudience"
                    value={profile.targetAudience}
                    onChange={handleChange}
                />
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
            <button
                type="button"
                className="cancel-button"
                onClick={() => {
                    setProfile(originalProfile); // Revert to last saved version
                    setIsEditing(false); // Exit edit mode
                }}
            >
                Cancel
            </button>
        </form>
    );
}
