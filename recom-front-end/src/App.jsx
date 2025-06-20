import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Spotify from "./assets/spotify-brands-solid.svg";

import background from "./assets/backgroundmusic.jpg"
import bg from "./assets/bg.webp";
import SongCard from "./Card";
import Search from "./assets/magnifying-glass-solid (1).svg?react"
import Loader from "./loader";

const App = () => {
  const [songName, setSongName] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(true);
  const [showLoader , setShowLoader] = useState(false);

  useEffect(() => {
    if (showDropdown === false && songName !== "") {
      fetchRecommendations();
    }
  }, [songName , recommendations]);

  useEffect(() => {
    if (songName.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      if (!showDropdown && songName !== '') return;
      try {
        const response = await axios.get(
          `https://music-recommendation-system-4d2f.onrender.com/search?query=${encodeURIComponent(songName)}`
        );
        console.log(response.data.songs)
        setSuggestions(response.data.songs);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    // Debounce API calls
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [songName]);

  //Fetch recommendations
  const fetchRecommendations = async () => {
    if (!songName.trim()) {
      alert("Please enter a song name.");
      return;
    }

    try {
      setShowLoader(true);
      const response = await axios.post("https://music-recommendation-system-4d2f.onrender.com/recommend", {
        song_name: songName,
      });

      setRecommendations(response.data.songs); 
      console.log(response.data)
    setMessage(response.data.message);
    setShowLoader(false);
    setShowDropdown(true)
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setMessage("Error fetching recommendations.");
    }
  };

  return (
    <div className="App">
      <div className="image-container">
        <img className = 'bg-image' src={background} />
      </div>
      <div className="Window" style={{ padding: "20px", fontFamily: "Arial" }}>
        <div className="heading" ><img src={Spotify} style={{height: '90px' , fill: "white"}}/><h1> Hindi Song Recommender</h1></div>

        <div className="search" >
          <div className="input-bar">
          <input
            type="text"
            placeholder="Enter song name"
            onChange={(e) => setSongName(e.target.value)}
            value={songName}
            className="input-field"
          />
          <button
            onClick={fetchRecommendations}
            className="search-button"
          >
            <Search style ={{height: "30px"}}/>
          </button>
        </div>

        <div className="dropdown">
          {showDropdown && suggestions.length > 0 && (
            <div className="button">
              {suggestions.map((song, index) => (
                <button
                  key={index}
                  style={{
                    textAlign: "left",
                    paddingLeft: "30px",
                    borderRadius: "0px",
                    background: "transparent",
                  }}
                  onClick={() => {
                    setSongName(song);
                    setShowDropdown(false);
                    setSuggestions([]);
                  }}
                >
                  {song}
                </button>
              ))}
            </div>
          )}
        </div>
        </div>
        <div className="recoms">
        {message && (
          <p>
            <strong>{message}</strong>
          </p>
        )}
        {recommendations && <SongCard data={recommendations} />}
        {showLoader && <Loader/>}
        </div>

      </div>
    </div>
  );
};

export default App;
