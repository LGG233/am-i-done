import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import RequestData from "./components/request";
// import ResponseDisplayForm from "./components/response";
// import Title from "./components/Title";
import LandingPage from "./pages/LandingPage"; // Import the new landing page

function MainApp() {
  const [user, setUser] = useState({});
  const [requestData, setRequestData] = useState({ title: "", copy: "", points: "" });
  const [response, setResponse] = useState("");
  const location = useLocation(); // Detects when the route changes

  function handleCallBackResponse(response) {
    const userObject = jwtDecode(response.credential);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut() {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
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
  }, [location.pathname]); // Re-run this when the route changes

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="brand-title">AmplifAI</h1>
        <p className="brand-tagline">Elevate your message. Expand your influence.</p>
        {/* <Title /> */}
        <div id="signInDiv"></div>

        {Object.keys(user).length !== 0 ? (
          <>
            <RequestData onRequestData={handleRequestData} onResponse={handleResponse} />
            {/* <ResponseDisplayForm requestData={requestData} response={response} /> */}
            <button className="button-19" onClick={handleSignOut}>
              Sign Out
            </button>
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

        {/* Ensure Sign-Out Button Appears When Logged In
        {Object.keys(user).length !== 0 && (
          <button className="button-19" onClick={handleSignOut}>
            Sign Out
          </button>
        )} */}
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/app"
          element={
            <>
              {(() => {
                try {
                  return <MainApp />;
                } catch (error) {
                  console.error("Error rendering MainApp:", error);
                  return <p>Something went wrong! Check the console for details.</p>;
                }
              })()}
            </>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
