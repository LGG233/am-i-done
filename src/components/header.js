import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/NewLogo.jpg"; // adjust path if needed
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Header({ user, setUser, fullName }) {
    console.log("Header received user:", user); // 👀 Check this in browser console
    const navigate = useNavigate();

    function handleSignOut() {
        signOut(auth)
            .then(() => {
                console.log("Signed out");
                navigate("/login");
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

                <nav className="nav-menu">
                    {user && (
                        <div className="nav-username">
                            {`Welcome, ${user.displayName
                                ? user.displayName.split(" ")[0]
                                : fullName
                                    ? fullName.split(" ")[0]
                                    : user.email?.split("@")[0]
                                }!`}
                        </div>
                    )}
                    <Link to="/app" className="nav-link">Home</Link>
                    <Link to="/" className="nav-link">Why AmplifAI?</Link>
                    <Link to="/how-it-works" className="nav-link">How It Works</Link>
                    <Link to="/try" className="nav-link">Try It Now</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    {user && (
                        <>
                            <Link to="/dashboard" className="nav-link">Profile</Link>
                            <button className="nav-button" onClick={handleSignOut}>Sign Out</button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}