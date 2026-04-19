import React from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";


const Portada = ()=> {
    const {state} = useAppContext();


return (

<div id="carousel" className="relative w-full">
  <div className="relative h-[85vh] overflow-hidden">

    {state.Populares.map((item, index) => (
      <div
        key={item.id}
        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
          index === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
      >
        <img
          src={`https://image.tmdb.org/t/p/original${item.backdrop_path || item.poster_path}`}
          alt={item.title}
          className="w-full h-full object-cover"
        />

        {/* capa oscura */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* degradado arriba */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent"></div>

        {/* degradado abajo */}
        <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        {/* contenido encima */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg max-w-2xl">
            {item.title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm md:text-lg text-white line-clamp-3">
            {item.overview}
          </p>

          <div className="mt-6 flex gap-4">
            <Link
              to={`/modal/${item.id}`}
              className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition"
            >
              <i className="fa-solid fa-play mr-2"></i>
              Reproducir
            </Link>

            <button className="bg-white/20 text-white font-semibold px-6 py-3 rounded-md hover:bg-white/30 transition">
              <i className="fa-solid fa-circle-info mr-2"></i>
              Más información
            </button>
          </div>
        </div>
      </div>
    ))}

   
    
      </div>
    </div>

)}
export default Portada;