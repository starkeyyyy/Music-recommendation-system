import React from 'react';
import './App.css';
import Spotify from './assets/spotify-brands-solid.svg';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import required modules
import { Pagination } from 'swiper/modules';

const SongCard = ({ data = [] }) => {
  return (
    <div className="card">
      
      <Swiper
        slidesPerView={5}
        spaceBetween={10}
        pagination={{ clickable: true }}
        //modules={[Pagination]}
        className="mySwiper"
      >
        {data.map((song, index) => (
          <SwiperSlide key={index}>
          <div className="song-slide">
            <div className="card-content">
            <img src={Spotify} alt="Spotify" className="spotify-icon"/>
              <div className="song-details">
                <h3 className="song-title">{song.song_name}</h3>
                <p className="artist">🎤 {song.singer}</p>
                <p className="release-date">📅 Released: {song.released_date}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        
        ))}
      </Swiper>
    </div>
  );
};

export default SongCard;




