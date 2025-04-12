import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/App.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase"; // ✅ adjust if needed
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import RequestData from "./components/request";
import Header from "./components/header";
import LandingPage from "./pages/LandingPage";
import HowItWorks from "./pages/HowItWorks";
import TryItNow from "./pages/TryItNow";
import About from "./pages/About";
import AuthForm from "./components/AuthForm"; // adjust path if needed
import { Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // ⬅️ adjust path if needed

// If we ever need to trigger logic based on the current route, useLocation() is the tool.
// Common uses: route-based UI changes, redirects, logging, conditional headers/footers, etc.
// import { useLocation } from "react-router-dom";

function MainApp({ user, setUser }) {
  const [setRequestData] = useState({ title: "", copy: "", points: "" });
  const [setResponse] = useState("");

  // const location = useLocation(); // 👈 Not used now, but helpful later for route-aware logic.

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleRequestData = (data) => setRequestData(data);
  const handleResponse = (response) => setResponse(response);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="brand-title">AmplifAI</h1>
        <h2 className="brand-subtitle">Your AI Marketing Assistant for Thought Leadership</h2>
        <p className="brand-tagline">
          Elevate your message. Expand your influence. Amplify your thought leadership.
        </p>

        {user && Object.keys(user).length !== 0 ? (
          <RequestData onRequestData={handleRequestData} onResponse={handleResponse} />
        ) : (
          <div className="introText">
            <p><b>AmplifAI</b> ensures clarity, engagement, and maximum impact for your thought leadership:</p>
            <ul>
              <li>Does it speak to the audience you're targeting?</li>
              <li>Do your key takeaways resonate?</li>
              <li>Does the title properly position the content?</li>
            </ul>
            <p><b>AmplifAI</b> can also help you promote your work via email, on social and digital media, and on your firm website with clear, concise language.</p>
            <p>Sign in to <b>AmplifAI</b> your thought leadership.</p>
          </div>
        )}
      </header>
    </div>
  );
}

function App() {
  const [user, setUser] = useState({}); // ✅ Moved to top-level App()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/app" element={<MainApp user={user} setUser={setUser} />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/try" element={<TryItNow />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/login" element={<AuthForm user={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />

      </Routes>
    </Router>
  );
}

export default App;