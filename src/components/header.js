import React from "react";
import { Link } from "react-router-dom";

const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/";
};

const Header = ({ onNewRequest, onSignOut }) => {
    return (
        <header className="amplifai-header">
            <div className="header-inner">
                <div className="amplifai-logo">
                    <Link to="/">AmplifAI</Link>
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
};
export default Header;