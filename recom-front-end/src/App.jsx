import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Background from "./assets/background.webp";
import bg from "./assets/bg.webp";
import SongCard from "./Card";

const App = () => {
  const [songName, setSongName] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(true);

  useEffect(() => {
    if (showDropdown === false && songName !== "") {
      fetchRecommendations();
    }
  }, [songName]);

  useEffect(() => {
    if (songName.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/search?query=${encodeURIComponent(songName)}`
        );
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
      const response = await axios.post("http://127.0.0.1:5000/recommend", {
        song_name: songName,
      });

      setRecommendations(response.data.recommendations);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setMessage("Error fetching recommendations.");
    }
  };

  return (
    <div className="App">
      <div className="image-container">
        <img src={bg} />
      </div>
      <div className="Window" style={{ padding: "20px", fontFamily: "Arial" }}>
        <h1>🎵 Hindi Song Recommender</h1>

        <div className="input-bar">
          <input
            type="text"
            placeholder="Enter song name"
            onChange={(e) => setSongName(e.target.value)}
            value={songName}
            style={{}}
            className="input-field"
          />
          <button
            onClick={fetchRecommendations}
            style={{
              padding: "10px",
              borderRadius: "30px",
              backgroundColor: "white",
              backdropFilter: "blur(10px)",
              border: "none",
              cursor: "pointer",
            }}
          >
            🔍
          </button>
        </div>

        <div className="dropdown">
          {showDropdown && suggestions.length > 1 && (
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
        <div className="recoms">
        {message && (
          <p>
            <strong>{message}</strong>
          </p>
        )}
        <SongCard data={recommendations} />
        </div>

      </div>
    </div>
  );
};

export default App;
