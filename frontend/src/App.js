import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

// Use an environment variable for the API URL
const apiUrl = process.env.REACT_APP_API_URL || "";

function App() {
  const [message, setMessage] = useState("");
  console.log(`${apiUrl}/healthy`);
  useEffect(() => {
    fetch(`${apiUrl}/healthy`)
      .then((res) => res.json())
      .then((res) => setMessage(res.status))
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          REACT TEST BACKEND CONNECTION: {message}
        </a>
      </header>
    </div>
  );
}

export default App;
