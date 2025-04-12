import React, { useState, useEffect } from "react";
import { auth, db } from "../services/firebase"; // ✅ Fixes the 'auth is not defined' error
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "../css/ProfileForm.css";

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

    useEffect(() => {
        const loadUserProfile = async () => {
            if (!auth.currentUser) return;

            const userDocRef = doc(db, "userProfiles", auth.currentUser.uid);
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                }
            } catch (err) {
                console.error("Error loading profile:", err);
            }
        };

        loadUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (!user) {
                toast.error("No user found.");
                return;
            }

            const userDocRef = doc(db, "userProfiles", user.uid);
            await setDoc(userDocRef, profile);
            toast.success("Profile saved successfully!");
        } catch (err) {
            console.error("Error saving profile:", err);
            toast.error("Something went wrong. Please try again.");
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