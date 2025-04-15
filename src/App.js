import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./css/App.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequestData from "./components/request";
import Header from "./components/header";
import LandingPage from "./pages/LandingPage";
import HowItWorks from "./pages/HowItWorks";
import TryItNow from "./pages/TryItNow";
import About from "./pages/About";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";
import { buildUserContext } from "./utils/userContextBuilder";

function MainApp({
  user,
  userContext,
  hasUsedContext,
  setHasUsedContext,
  useUserContext,
}) {
  const [setRequestData] = useState({ title: "", copy: "", points: "" });
  const [setResponse] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="brand-title">AmplifAI</h1>
        <h2 className="brand-subtitle">Your AI Content Marketing Assistant</h2>
        <p className="brand-tagline">
          Elevate your message. Expand your influence. Amplify your thought leadership.
        </p>

        {user ? (
          <RequestData
            onRequestData={(data) => setRequestData(data)}
            onResponse={(response) => setResponse(response)}
            userContext={userContext}
            hasUsedContext={hasUsedContext}
            setHasUsedContext={setHasUsedContext}
            useUserContext={useUserContext}
          />
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
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [userContext, setUserContext] = useState("");
  const [hasUsedContext, setHasUsedContext] = useState(false);
  const [useUserContext] = useState(true);

  // Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user profile and build context
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user.uid) {
        try {
          const userDocRef = doc(db, "userProfiles", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const profileData = docSnap.data();
            setProfile(profileData);

            const context = buildUserContext(profileData);
            setUserContext(context);
            localStorage.setItem("userContext", context);
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };
    fetchProfile();
  }, [user]);

  // if (!user) return <Navigate to="/login" />;

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
      <Header user={user} setUser={setUser} fullName={profile.fullName} />

      <Routes>
        <Route
          path="/app"
          element={
            user ? (
              <MainApp
                user={user}
                userContext={userContext}
                hasUsedContext={hasUsedContext}
                setHasUsedContext={setHasUsedContext}
                useUserContext={useUserContext}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/try" element={<TryItNow />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
