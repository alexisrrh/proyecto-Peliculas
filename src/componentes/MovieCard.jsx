import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const MovieCard = ({ item, isFavoritosPage = false }) => {
  const { state, dispatch } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const isFav = state.Favoritos?.find((fav) => fav.id === item.id);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  };

  useEffect(() => {
    if (isHovered && !trailerKey) {
      const fetchTrailer = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${item.id}/videos?api_key=1ecf4daf764af90f82ce01b58fd9ecc7`
          );
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const trailer =
              data.results.find((vid) => vid.type === "Trailer" && vid.site === "YouTube" && vid.official) ||
              data.results.find((vid) => vid.type === "Trailer" && vid.site === "YouTube") ||
              data.results[0];

            if (trailer) {
              setTrailerKey(trailer.key);
            }
          }
        } catch (error) {
          console.error("Error buscando el trailer:", error);
        }
      };
      fetchTrailer();
    }
  }, [isHovered, item.id, trailerKey]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // SOLUCIÓN: Agregamos w-[260px] md:w-[300px] para que la tarjeta no colapse
      className="w-[260px] md:w-[300px] shrink-0 group relative shadow-lg transform transition-all duration-300 hover:z-20 hover:-translate-y-4 hover:scale-105 hover:shadow-2xl hover:ring-cyan-500/50"
    >
      {/* CONTENEDOR DE IMAGEN Y VIDEO */}
      <div className="h-[380px] md:h-[450px] w-full rounded-2xl relative overflow-hidden bg-zinc-900 border border-zinc-800">
        <Link to={`/modal/${item.id}`} className="absolute inset-0 z-10 w-full h-full block cursor-pointer"></Link>
        
        {/* IMAGEN DE POSTER */}
        <img
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={item.title}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isHovered && trailerKey ? "opacity-0" : "opacity-100"}`}
        />

        {/* REPRODUCTOR YOUTUBE (Oculto hasta hacer hover) */}
        {isHovered && trailerKey && (
          <div className="absolute inset-0 z-0 pointer-events-none bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${trailerKey}&start=0&end=15`}
              title="Trailer"
              className="w-[300%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              frameBorder="0"
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
        )}

        {/* HEADER DE LA TARJETA (TÍTULO Y CORAZÓN/BASURERO) */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-between gap-3 p-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <h3 className="text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
            {item.title}
          </h3>

          <div className="pointer-events-auto shrink-0">
            {isFavoritosPage ? (
              <i
                className="fa-regular fa-trash-can p-2 cursor-pointer transition transform hover:scale-125 text-red-500 text-xl drop-shadow-md"
                onClick={() => dispatch({ type: "remove_Favoritos", payload: item })}
              ></i>
            ) : (
              <i
                className={`fa-solid fa-heart cursor-pointer transition transform pt-1 text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:scale-125 ${isFav ? "text-red-500" : "text-white"}`}
                onClick={() => dispatch({ type: "set_Favoritos", payload: item })}
              ></i>
            )}
          </div>
        </div>
      </div>

      {/* SINOPSIS */}
      <div className="absolute -bottom-24 left-0 right-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 group-hover:-translate-y-28 transition-all duration-300">
        <p className="bg-zinc-900/95 border border-zinc-700 rounded-xl mx-2 text-sm leading-5 text-zinc-300 font-medium text-justify line-clamp-4 px-4 py-3 shadow-2xl backdrop-blur-md">
          {item.overview}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;