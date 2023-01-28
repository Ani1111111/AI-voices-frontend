import "./App.css";
import Voices from "./components/voices/voices";
import svg from "./assests/home/voice.png";
import React, { useState, useEffect } from "react";

function App() {
  const [voices, setVoices] = useState(false);
  const [grayedout, setGrayedOut] = useState(false);

  const clseModal = () => {
    if (voices) {
      let appElement = document.querySelector(".App");
      appElement.classList.remove("grayedout");
      setGrayedOut(false);
      setVoices(false);
    } else {
      setVoices(true);
    }
  };

  useEffect(() => {
    let voicesDiv = document.querySelector(".voices_div");
    if (grayedout && voicesDiv) {
      voicesDiv.style.zIndex = "1";
    }
  });

  const getVoices = () => {
    setVoices(true);
    let appElement = document.querySelector(".App");
    appElement.classList.add("grayedout");
    setGrayedOut(true);
  };
  return (
    <>
      {voices ? <Voices closeModel={clseModal} /> : ""}
      <div className="App">
        <img src={svg} alt="icon" />
        <div className="heading_div">
          <nav>
            <ul>
              <li>About</li>
              <li>Contact Us</li>
            </ul>
          </nav>
          <h1 className="welcome_heading">Welcome To AI Voices</h1>
          <button className="getVoiceButton" onClick={() => getVoices()}>
            Get AI Voices
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
