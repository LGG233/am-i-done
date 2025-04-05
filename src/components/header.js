import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/NewLogo.jpg"; // adjust path if needed

export default function Header({ setUser }) {
    function handleSignOut() {
        setUser({});
        localStorage.removeItem("user");
        document.getElementById("signInDiv").hidden = false;
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