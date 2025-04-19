import React from "react";
import Modal from "react-modal";
import "../css/ProfileForm.css"; // Reuse existing styles

Modal.setAppElement("#root");

export default function EditProfileModal({
    isOpen,
    onClose,
    profile,
    setProfile,
    onSave,
    requiredFields = [],
}) {
    // const handleChange = (key, value) => {
    //     setProfile((prev) => ({ ...prev, [key]: value }));
    // };

    // const isSaveDisabled = requiredFields.some((key) => !profile[key]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="profile-modal"
            overlayClassName="modal-overlay"
        >
            <div className="modal-header">
                <h2 className="modal-title">Complete Your Profile</h2>
                <p className="modal-subtext">Please fill in the required fields to continue:</p>
            </div>

            <div className="modal-body">
                {Object.entries(profile).map(([key, value]) => (
                    <div key={key} className="profile-field">
                        <label className="profile-label">{`My ${key.replace(/([A-Z])/g, " $1")}`}</label>
                        <input
                            type="text"
                            value={value || ""}
                            onChange={(e) => setProfile((prev) => ({ ...prev, [key]: e.target.value }))}
                        />
                    </div>
                ))}
            </div>

            <div className="modal-footer button-group">
                <button onClick={onSave}>Save</button>
                <button onClick={onClose} type="button">Cancel</button>
            </div>
        </Modal>
    );
}