import { toast } from "react-toastify";

// Define your standard toast messages here
export const toastMessages = {
    // ✅ Authentication
    loginSuccess: "Welcome back!",
    loginError: "Login failed. Please check your email and password.",
    pleaseVerifyEmail: "Please verify your email address to continue.",
    verificationEmailSent: "A verification email has been sent. Please confirm before logging in.",
    signedOut: "Signing out...",

    // 📝 Profile
    profileSaved: "Profile saved successfully.",
    profileError: "Error saving profile.",
    profileUpdated: "Profile updated successfully.",
    loadingProfile: "Loading your profile...",

    // 🚀 Requests
    requestInProgress: "Working on your request...",
    requestCompleted: "Done! Here’s your response.",
    requestFailed: "Something went wrong. Please try again.",
    editingInProgress: "Finish editing before starting a new request.",

    // 📋 Clipboard
    copiedToClipboard: "Copied to clipboard!",
    copiedEditedResponse: "Copied edited response to clipboard!",
    clipboardUnsupported: "Clipboard not supported. Please copy manually.",
    clipboardFailed: "Failed to copy. Try again.",
};

// Reusable toast function
export function showToast(message, options = {}) {
    toast(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...options,
    });
}