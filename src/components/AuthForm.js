import React, { useState } from "react";
import "./AuthForm.css";
import { auth } from "../services/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
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
                await signInWithEmailAndPassword(auth, email, password);
                navigate("/app"); // 👈 Redirect after login
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                navigate("/app"); // 👈 Redirect after signup
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-form">
            <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>
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