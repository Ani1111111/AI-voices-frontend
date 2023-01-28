import React, { useState } from "react";
import "./voices.css";
import male_icon from "../../assests/home/male_icon.jpg";
import female_icon from "../../assests/home/female_icon.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle, faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ReactAudioPlayer from 'react-audio-player';
// import { saveAs } from 'file-saver';





var all_voices = [];
const getVoices = () => {
  axios
    .get("http://127.0.0.1:5000/get_all_voices")
    .then(function (response) {
      // handle success
      let voices = response["data"];
      for(let voice of voices){
        let obj  = {}
        obj[voice.id] = voice
        all_voices.push(obj)
      }
      console.log(all_voices)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
};
getVoices();

export default function Voices(props) {
  const [gender, setGender] = useState("Male");
  const [rate, setRate] = useState(130);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);

  const checkInput =()=>{
    let speakText = document.querySelector('.speechtext').value
    if (speakText){
      document.querySelector('.errorspan').classList.remove('display')
    }
  }

  const settingGender = () => {
    for (let input of document.getElementsByClassName("state")) {
      if (input.checked) {
        setGender(input.value);
      }
    }
  };

  const play = (e, voice_id)=>{
    e.preventDefault();
    console.log('playing')
    let speakText_input = document.querySelector('.speechtext')
    let speakText = speakText_input.value
    if(speakText){
      setWaiting(true)
      speakText_input.style.border = '1px solid black'
      let url = "http://127.0.0.1:5000/speak/".concat(speakText)
      console.log(url)
      axios({
        method: 'post',
        url: url,
        responseType: "blob",
        data: {
          voice_id: voice_id,
          gender: gender, // This is the body part
          rate: rate
        }
      })
      .then((response) =>{
        let src = URL.createObjectURL(response.data);
        document.querySelector('#'.concat(voice_id)).setAttribute('src',src)
        setWaiting(false)
        document.querySelector('#'.concat(voice_id)).setAttribute('autoplay',true)
        document.querySelector('#'.concat(voice_id)).classList.add('display')
  
      })
      .catch(function (error) {
        // handle error
        setWaiting(false)
        setError(true)
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    }else{
      console.log(speakText_input)
      speakText_input.style.border = '2px solid red'
      document.querySelector('.errorspan').classList.add('display')
    }
  }
  function closeModal(e) {
    e.stopPropagation();
    props.closeModel();
  }
  return (
    <>
      <div className="voices_div">
        <div className="voices_heading">
          <h1>Voices</h1>
          <button
            type="button"
            className="closebutton"
            data-dismiss="modal"
            aria-label="Close"
            onClick={closeModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form action="">
          <input
            className="speechtext"
            type="text"
            onChange={()=>{checkInput()}}
            placeholder="Enter Text To Convert"
            required
          />
          <span className ='errorspan'>Please Enter Input</span>
          <div className="ratediv">
            <div className="ratewithsearch">
            <div className="ratenumber"><p><b>Speed</b></p><p>{rate}</p></div>
            <input type="text" name="" id="search" placeholder="Search Voice"/>
            </div>
          <input type="range" id  = 'rate'min="1" max="500" value={rate}  onChange = {(e)=>{setRate(e.target.value)}}/>
          </div>
          <div className="radiogroup">
            <div className="wrapper">
              <input
                className="state"
                type="radio"
                name="gender"
                id="male"
                value="Male"
                onClick={settingGender}
                defaultChecked
              />
              <label className="label" htmlFor="male">
                <div className="indicator"></div>
                <span className="text">Male</span>
              </label>
            </div>
            <div className="wrapper">
              <input
                className="state"
                type="radio"
                name="gender"
                id="female"
                value="Female"
                onClick={settingGender}
              />
              <label className="label" htmlFor="female">
                <div className="indicator"></div>
                <span className="text">Female</span>
              </label>
            </div>
          </div>
        
        {all_voices.map((el) => (
          <div className="single_voice" key={Object.keys(el)[0]}>
            <div className="voicenamediv">
              {gender === "Female" ? (
                <img src={female_icon} alt="icon" />
              ) : (
                <img src={male_icon} alt="icon" />
              )}
              <p>{el[Object.keys(el)[0]].name}</p>
              <button className="playbutton" onClick={(e)=>play(e, Object.keys(el)[0])}>
              <FontAwesomeIcon icon={faPlayCircle} />
              </button>
            </div>
            <div className="languagediv">
              <p className="voicepara">{gender} voice</p>
              {waiting ? <p>Please Wait.....</p>:''}
              {error ? <p>Something went wrong</p>:''}
              <ReactAudioPlayer
              className="audioplayer"
              id={Object.keys(el)[0]}
                  controls
                  src=''
                />
            </div>
          </div>
        ))}
        </form>
      </div>
    </>
  );
}
