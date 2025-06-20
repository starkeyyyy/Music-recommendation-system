import React from "react";

import loading2 from './assets/loader2.gif'


const Loader = () => {
  return (
    <div className="loader">
      <img 
        src={loading2}
        alt="Loading..." 
        className="loading"
        style={{width: '200px',  height: 'auto', zIndex: 1000}}
        
        
      />
      <div style={{color:"black" , fontSize: "25px" , fontFamily: "Poppins" , fontWeight:"bold"}}>Loading...</div>
    </div>
  );
};

export default Loader;

