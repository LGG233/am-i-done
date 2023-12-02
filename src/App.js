import React, { useState } from "react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import RequestData from "./components/request";
import ResponseDisplayForm from "./components/response";
import Title from "./components/Title";

function App() {
  const [user, setUser] = useState({});

  function handleCallBackResponse(response) {
    const userObject = jwtDecode(response.credential);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "104608056694-gfr93plhim1tharm2j4pu573289p1bkn.apps.googleusercontent.com",
      callback: handleCallBackResponse
    })

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );

    google.accounts.id.prompt();
  }, []);


  const [requestData, setRequestData] = useState({
    title: "",
    copy: "",
    points: "",
  });

  const [response, setResponse] = useState("");

  const handleRequestData = (data) => {
    setRequestData(data);
  };

  const handleResponse = (response) => {
    setResponse(response);
  };
  return (
    <div className="App">
      <header className="App-header">
        <Title />
        <div id="signInDiv"></div>
        {Object.keys(user).length !== 0 ? (
          <>
            <RequestData
              onRequestData={handleRequestData}
              onResponse={handleResponse}
            />
            <ResponseDisplayForm
              requestData={requestData}
              response={response}
            />
          </>
        ) : (
          <div className="introText">
            <p><em><b>Am I Done?</b></em> analyzes your work to see if it is complete:</p>
            <ul>
              <li>Does it speak to the audience you're targeting?</li>
              <li>Do the key takeaways align with the points you want to make?</li>
              <li>Does the title properly position the thought leadership?</li>
            </ul>
            <p>In addition, <em><b>Am I Done?</b></em> drafts language that you can use to promote your work via email, on social and digital media, and on your firm website.</p>
            <p>Please sign in.</p>
          </div >
        )}

        {Object.keys(user).length !== 0 &&
          <button className="button-19" onClick={(e) => handleSignOut(e)}>Sign Out</button>
        }
        {user &&
          <div>
            {/* <img src={user.picture}></img>
            <h3>{user.name}</h3> */}
          </div>}
      </header>
    </div>
  );
}
export default App;
