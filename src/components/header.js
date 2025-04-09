import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/NewLogo.jpg"; // adjust path if needed
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";


console.log("Header component loaded");

export default function Header({ user, setUser }) {
    console.log("Header received user:", user); // 👀 Check this in browser console
    function handleSignOut() {
        signOut(auth)
            .then(() => {
                console.log("Signed out");
            })
            .catch((error) => {
                console.error("Sign out error:", error);
            });
    }
    console.log("Header received user:", user);
    return (
        <header className="amplifai-header">
            <div className="header-inner">
                <div className="amplifai-logo">
                    <Link to="/">
                        <img src={logo} alt="AmplifAI logo" className="logo-image" />
                    </Link>
                </div>
                {user && user.name && (
                    <div className="nav-username">Welcome, {user.name.split(" ")[0]}!</div>
                )}
                <nav className="nav-menu">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/how-it-works" className="nav-link">How It Works</Link>
                    <Link to="/try" className="nav-link">Try It Now</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <button className="nav-link" onClick={handleSignOut}>Sign Out</button>
                </nav>
            </div>
        </header>
    );
}