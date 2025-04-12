import React, { useState, useEffect } from "react";
import "./AuthForm.css";
import { auth } from "../services/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ user }) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState(""); // ✅ NEW
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showResend, setShowResend] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/app");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            if (isLogin) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (userCredential.user.emailVerified) {
                    navigate("/app");
                } else {
                    setError("Please verify your email address before accessing the app.");
                    setShowResend(true);
                }
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name }); // ✅ Set name
                await sendEmailVerification(userCredential.user);
                setSuccess("Verification email sent. Please check your inbox.");
                setShowResend(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const resendVerification = async () => {
        try {
            await sendEmailVerification(auth.currentUser);
            setSuccess("Verification email resent. Please check your inbox.");
        } catch (err) {
            setError("Failed to resend verification email.");
        }
    };

    return (
        <div className="auth-form">
            <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>

            <p className="auth-info">
                Welcome to AmplifAI. If you're part of our beta testing group, log in or create an account below to get started.
            </p>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="show-password-toggle">
                    <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    <label htmlFor="showPassword">Show Password</label>
                </div>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <button type="submit">{isLogin ? "Log In" : "Create Account"}</button>
            </form>

            {showResend && (
                <p>
                    Didn’t get the email?{" "}
                    <button onClick={resendVerification} className="toggle-btn">
                        Resend Verification
                    </button>
                </p>
            )}

            <p>
                {isLogin ? "Need an account?" : "Already have an account?"}{" "}
                <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
                    {isLogin ? "Sign up" : "Log in"}
                </button>
            </p>
        </div>
    );
}