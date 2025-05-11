import React from "react";
import "./App.css";
import Play from './assets/play-solid.svg?react'


const SongCard = ({ data = [] }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="card">
      {data.map((song, index) => (
        <a
      href={song.spotify_url}
      target="_blank"
      rel="noopener noreferrer"
      className="link"
    >
      <div 
        className="spotify-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Album Cover */}
        <div className="cover-container">
          <div className="cover-overlay" />
          <img 
            src={song.cover_url} 
            alt={`photo`} 
            className="album-cover" 
          />
          {/* Play Button Overlay */}
          <div className={`play-button-container ${isHovered ? 'visible' : ''}`}>
            <button className="play-button">
              <Play style ={{height: '30px' , width: '30px'}}/>
            </button>
          </div>
        </div>
        
        {/* Album Info */}
        <div className="album-info">
          <h2 className="album-title">{song.title}</h2>
          <p className="album-artist">{song.artist}</p>
          
          {/* Divider */}
          <div className="divider"></div>
          
          <div className="album-meta">
            <span>{song.release_date}</span>
            <div className="album-stats">
              <span>{song.album} songs</span>
              <span>•</span>
              <span>{song.duration_ms}</span>
            </div>
          </div>
          
          {/* Spotify Tag */}
          <div className="spotify-tag">
            <svg viewBox="0 0 24 24" className="spotify-logo" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span className="spotify-label">Spotify</span>
          </div>
        </div>
      </div>
    </a>
      
      ))}
    </div>
  );
};

export default SongCard;
