import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/NewLogo.jpg"; // adjust path if needed
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

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
    return (
        <header className="amplifai-header">
            <div className="header-inner">
                <div className="amplifai-logo">
                    <Link to="/">
                        <img src={logo} alt="AmplifAI logo" className="logo-image" />
                    </Link>
                </div>
                {/* {user && user.displayName && (
                    <div className="nav-username">Welcome, {user.displayName.split(" ")[0]}!</div>
                )} */}
                <nav className="nav-menu">
                    {user && user.displayName && (
                        <div className="nav-username">Welcome, {user.displayName.split(" ")[0]}!</div>
                    )}
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/how-it-works" className="nav-link">How It Works</Link>
                    <Link to="/try" className="nav-link">Try It Now</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    {user && (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <button className="nav-button" onClick={handleSignOut}>Sign Out</button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}