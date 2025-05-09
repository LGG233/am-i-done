import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "./EditProfileModal";
import "../css/ProfileForm.css";
import { buildUserContext } from "../utils/userContextBuilder";

export default function ProfileForm({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
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

    const requiredFields = [
        "practiceFocus",
        "targetAudience",
        "tonePreferences",
        "yearsOfExperience",
    ];

    const [originalProfile, setOriginalProfile] = useState(null);
    const navigate = useNavigate();

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

    const saveProfile = async () => {
        if (!user || !user.uid) return;
        const userDocRef = doc(db, "userProfiles", user.uid);
        try {
            await setDoc(userDocRef, profile, { merge: true });
            setIsEditing(false);
            setOriginalProfile(profile);
            toast.success("Profile saved successfully");

            // 👇 Trigger context rebuild
            const context = buildUserContext(profile);
            localStorage.removeItem("userContext"); // Optional, just to be safe
            window.dispatchEvent(new CustomEvent("userContextUpdated", { detail: context }));
        } catch (err) {
            console.error("Error saving profile:", err);
            toast.error("Error saving profile");
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
        <form className="profile-grid">
            <div className="left-column">
                <div className="identity-block">
                    <h2 className="identity-name">{profile.fullName}</h2>
                    <p className="identity-line">{profile.email}</p>
                    <p className="identity-line">{profile.jobTitle}</p>
                    <p className="identity-line">{profile.firm}</p>
                </div>
                {!isEditing && (
                    <>
                        <button
                            className="edit-button"
                            type="button"
                            onClick={() => setShowModal(true)}
                        >
                            Edit
                        </button>
                        <button
                            className="edit-button"
                            type="button"
                            onClick={() => navigate("/app")}
                        >
                            Close
                        </button>
                    </>
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
                                    onChange={(e) =>
                                        setProfile({ ...profile, userType: e.target.value })
                                    }
                                />
                                Lawyer
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="non-lawyer"
                                    checked={profile.userType === "non-lawyer"}
                                    onChange={(e) =>
                                        setProfile({ ...profile, userType: e.target.value })
                                    }
                                />
                                Legal Marketer / Other
                            </label>
                        </div>
                    ) : (
                        <p className="profile-value">
                            {profile.userType === "lawyer"
                                ? "Lawyer"
                                : "Legal Marketer / Other"}
                        </p>
                    )}
                </div>

                {isEditing && (
                    <div className="button-group">
                        <button type="button" onClick={saveProfile}>
                            Save
                        </button>
                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <EditProfileModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                profile={profile}
                setProfile={setProfile}
                onSave={async () => {
                    await saveProfile();
                    setShowModal(false);
                    toast.success("Profile updated successfully");

                    // 👇 Trigger rebuild of userContext after saving
                    if (typeof window.rebuildUserContext === "function") {
                        window.rebuildUserContext();
                    }
                }}
                requiredFields={requiredFields}
            />
        </form>
    );
}
