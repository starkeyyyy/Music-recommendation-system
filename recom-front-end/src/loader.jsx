import React from "react";
import loading from './assets/loader.gif'
import loading2 from './assets/loader2.gif'

const Loader = () => {
  return (
    <div className="loader">
      <img 
        src={loading}
        alt="Loading..." 
        className="loading"
        style={{width: '500px' , height: '500px'}}
      />
      <div>loading....</div>
    </div>
  );
};

export default Loader;

