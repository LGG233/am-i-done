import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/App.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import RequestData from "./components/request";
import Header from "./components/header";
import LandingPage from "./pages/LandingPage";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

function MainApp({ user, setUser }) {
  const [setRequestData] = useState({ title: "", copy: "", points: "" });
  const [setResponse] = useState("");
  const location = useLocation();

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      document.getElementById("signInDiv").hidden = true;
    }

    const handleCallBackResponse = (response) => {
      const userObject = jwtDecode(response.credential);
      setUser(userObject);
      localStorage.setItem("user", JSON.stringify(userObject));
      document.getElementById("signInDiv").hidden = true;
    };

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
  }, [location.pathname, setUser]);
  const handleRequestData = (data) => setRequestData(data);
  const handleResponse = (response) => setResponse(response);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="brand-title">AmplifAI</h1>
        <p className="brand-tagline">Elevate your message. Expand your influence. Amplify your thought leadership.</p>
        <div id="signInDiv"></div>

        {Object.keys(user).length !== 0 ? (
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
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;