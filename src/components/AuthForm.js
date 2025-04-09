import React, { useState } from "react";
import "./AuthForm.css";
import { auth } from "../services/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ user }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true); // toggle between login & signup
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/app");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (isLogin) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                if (!user.emailVerified) {
                    setError("Please verify your email before logging in.");
                    await auth.signOut(); // prevent access until verified
                    return;
                }

                navigate("/app"); // 👈 Redirect only if verified
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                setError("Verification email sent. Please check your inbox.");
                // Do NOT navigate until verified
            }
        } catch (err) {
            setError(err.message);
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

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button type="submit">{isLogin ? "Log In" : "Create Account"}</button>
            </form>

            <p>
                {isLogin ? "Need an account?" : "Already have an account?"}{" "}
                <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
                    {isLogin ? "Sign up" : "Log in"}
                </button>
            </p>
        </div>
    );
}