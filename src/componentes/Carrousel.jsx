import React from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const Carrousel = ()=> {
  
return (

<div id="carousel" className="relative w-full" data-carousel="slide">
  <div className="relative h-56 overflow-hidden rounded-lg">
    
    <div className="hidden duration-700 ease-in-out" data-carousel-item>
      <img src="img1.jpg" className="absolute w-full h-full object-cover"/>
    </div>

    <div className="hidden duration-700 ease-in-out" data-carousel-item>
      <img src="img2.jpg" className="absolute w-full h-full object-cover"/>
    </div>

  </div>
</div>

    )
}
export default Carrousel;