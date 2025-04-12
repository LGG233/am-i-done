import React from "react";
import "../css/Dashboard.css"; // Create this CSS file as needed

export default function Dashboard({ user }) {
    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            <p>
                Logged in as: <strong>{user?.email}</strong>
            </p>

            <div className="dashboard-section">
                <h2>Recent Activity</h2>
                <p>Coming soon: summaries of your most recent analyses.</p>
            </div>

            <div className="dashboard-section">
                <h2>Account Info</h2>
                <ul>
                    <li>Email: {user?.email}</li>
                    <li>Email Verified: {user?.emailVerified ? "Yes" : "No"}</li>
                    <li>User ID: {user?.uid}</li>
                </ul>
            </div>

            <div className="dashboard-section">
                <h2>Preferences</h2>
                <p>Feature coming soon: customize your AmplifAI experience.</p>
            </div>
        </div>
    );
}
