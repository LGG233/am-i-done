import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./css/App.css";
import RequestData from "./components/request";
import Header from "./components/header";
import LandingPage from "./pages/LandingPage";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";

function MainApp() {
  const [user, setUser] = useState({});
  const [setRequestData] = useState({ title: "", copy: "", points: "" });
  const [setResponse] = useState("");
  const location = useLocation();


  function handleCallBackResponse(response) {
    const userObject = jwtDecode(response.credential);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  const handleRequestData = (data) => {
    setRequestData(data);
  };

  const handleResponse = (response) => {
    setResponse(response);
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "104608056694-gfr93plhim1tharm2j4pu573289p1bkn.apps.googleusercontent.com",
      callback: handleCallBackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );

    google.accounts.id.prompt();
  }, [location.pathname]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="brand-title">AmplifAI</h1>
        <p className="brand-tagline">Elevate your message. Expand your influence. Amplify your thought leadership.</p>
        <div id="signInDiv"></div>

        {Object.keys(user).length !== 0 ? (
          <>
            <RequestData onRequestData={handleRequestData} onResponse={handleResponse} />
          </>
        ) : (
          <div className="introText">
            <p>
              <b>AmplifAI</b> ensures clarity, engagement, and maximum impact for your thought leadership:
            </p>
            <ul>
              <li>Does it speak to the audience you're targeting?</li>
              <li>Do your key takeaways resonate?</li>
              <li>Does the title properly position the content?</li>
            </ul>
            <p>
              <b>AmplifAI</b> can also help you promote your work via email, on social and digital media, and on your firm website with clear, concise language.
            </p>
            <p>Sign in to <b>AmplifAI</b> your thought leadership.</p>
          </div>
        )}
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/app" element={<MainApp />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </Router>
  );
}
export default App;
