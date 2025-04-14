import React, { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "../css/ProfileForm.css";

export default function ProfileForm({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        fullName: user?.displayName || "",
        email: user?.email || "",
        jobTitle: "",
        firm: "",
        userType: "lawyer",
        practiceFocus: "",
        industryFocus: "",
        targetAudience: "",
        writingGoals: "",
        tonePreferences: "",
        yearsOfExperience: "",
        jurisdiction: "",
        notableWork: "",
    });
    const [originalProfile, setOriginalProfile] = useState(null);

    useEffect(() => {
        if (!user || !user.uid) return;
        const loadUserProfile = async () => {
            const userDocRef = doc(db, "userProfiles", user.uid);
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfile((prev) => ({ ...prev, ...data }));
                    setOriginalProfile(data);
                }
            } catch (err) {
                console.error("Error loading profile:", err);
            }
        };
        loadUserProfile();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDocRef = doc(db, "userProfiles", auth.currentUser.uid);
        try {
            await setDoc(userDocRef, profile);
            setIsEditing(false);
            setOriginalProfile(profile);
            toast.success("✅ Profile saved successfully!", { autoClose: 2000 });

            // Delay redirect to give time for toast to show
            setTimeout(() => {
                window.location.href = "/app";
            }, 1500);
        } catch (err) {
            console.error("Error saving profile:", err);
            toast.error("❌ Error saving profile.");
        }
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
    };

    const renderField = (label, key, isTextarea = false) => (
        <div className="profile-field">
            <h4 className="profile-label">My {label}</h4>
            {isEditing ? (
                isTextarea ? (
                    <textarea
                        value={profile[key]}
                        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                    />
                ) : (
                    <input
                        type="text"
                        value={profile[key]}
                        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                    />
                )
            ) : (
                <p className="profile-value">{profile[key]}</p>
            )}
        </div>
    );

    return (
        <form className="profile-grid" onSubmit={handleSubmit}>
            <div className="left-column">
                <div className="identity-block">
                    <h2 className="identity-name">{profile.fullName}</h2>
                    <p className="identity-line">{profile.email}</p>
                    <p className="identity-line">{profile.jobTitle}</p>
                    <p className="identity-line">{profile.firm}</p>
                </div>
                {!isEditing && (
                    <button
                        className="edit-button"
                        type="button"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                )}
            </div>

            <div className="right-column">
                {renderField("Years of Experience", "yearsOfExperience")}
                {renderField("Jurisdiction", "jurisdiction")}
                {renderField("Practice Focus", "practiceFocus", true)}
                {renderField("Industry Focus", "industryFocus", true)}
                {renderField("Target Audience", "targetAudience", true)}
                {renderField("Writing Goals", "writingGoals", true)}
                {renderField("Tone Preferences", "tonePreferences", true)}
                {renderField("Notable Work", "notableWork", true)}

                <div className="profile-field">
                    <h4 className="profile-label">My Role</h4>
                    {isEditing ? (
                        <div className="role-radio-group">
                            <label>
                                <input
                                    type="radio"
                                    value="lawyer"
                                    checked={profile.userType === "lawyer"}
                                    onChange={(e) => setProfile({ ...profile, userType: e.target.value })}
                                />
                                Lawyer
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="non-lawyer"
                                    checked={profile.userType === "non-lawyer"}
                                    onChange={(e) => setProfile({ ...profile, userType: e.target.value })}
                                />
                                Legal Marketer / Other
                            </label>
                        </div>
                    ) : (
                        <p className="profile-value">
                            {profile.userType === "lawyer" ? "Lawyer" : "Legal Marketer / Other"}
                        </p>
                    )}
                </div>

                {isEditing && (
                    <div className="button-group">
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                )}
            </div>
        </form>
    );
}