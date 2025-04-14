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
                    setOriginalProfile(data); // Save for canceling
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
            console.log("✅ Profile saved to Firestore.");
        } catch (err) {
            console.error("Error saving profile:", err);
            toast.error("❌ Error saving profile.");
        }
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <form className="profile-form" onSubmit={handleSubmit}>
            <h2>User Profile</h2>

            <label>
                Full Name:
                <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    disabled={!isEditing}
                />
            </label>

            <label>
                Email:
                <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                />
            </label>

            <label>
                Job Title:
                <input
                    type="text"
                    value={profile.jobTitle}
                    onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                    disabled={!isEditing}
                />
            </label>

            <label>
                Firm:
                <input
                    type="text"
                    value={profile.firm}
                    onChange={(e) => setProfile({ ...profile, firm: e.target.value })}
                    disabled={!isEditing}
                />
            </label>

            {isEditing ? (
                <label>
                    I am a:
                    <div style={{ display: "flex", gap: "2rem", marginTop: "0.5rem" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                                type="radio"
                                value="lawyer"
                                checked={profile.userType === "lawyer"}
                                onChange={(e) => setProfile({ ...profile, userType: e.target.value })}
                            />
                            Lawyer
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                                type="radio"
                                value="non-lawyer"
                                checked={profile.userType === "non-lawyer"}
                                onChange={(e) => setProfile({ ...profile, userType: e.target.value })}
                            />
                            Legal Marketer / Other
                        </label>
                    </div>
                </label>
            ) : (
                <p><strong>I am a:</strong> {profile.userType === "lawyer" ? "Lawyer" : "Legal Marketer / Other"}</p>
            )}
            <label>
                Practice Focus:
                <textarea
                    value={profile.practiceFocus}
                    onChange={(e) => setProfile({ ...profile, practiceFocus: e.target.value })}
                    disabled={!isEditing}
                />
            </label>

            <label>
                Industry Focus:
                <textarea
                    value={profile.industryFocus}
                    onChange={(e) => setProfile({ ...profile, industryFocus: e.target.value })}
                    disabled={!isEditing}
                />
            </label>

            <label>
                Target Audience:
                <textarea
                    value={profile.targetAudience}
                    onChange={(e) => setProfile({ ...profile, targetAudience: e.target.value })}
                    disabled={!isEditing}
                />
            </label>

            <label>
                Writing Goals:
                <textarea
                    value={profile.writingGoals}
                    onChange={(e) => setProfile({ ...profile, writingGoals: e.target.value })}
                    disabled={!isEditing}
                />
            </label>

            <label>
                Tone Preferences:
                <textarea
                    value={profile.tonePreferences}
                    onChange={(e) => setProfile({ ...profile, tonePreferences: e.target.value })}
                    disabled={!isEditing}
                />
            </label>

            {isEditing ? (
                <div className="button-group">
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
            ) : (
                <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
            )}
        </form>
    );
}