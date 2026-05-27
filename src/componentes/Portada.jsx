import React from "react";
import { useAppContext } from "../context/AppContext";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";

const Portada = () => {
    const [modalInfo, setModalInfo] = useState(false);
    const { state } = useAppContext();
 const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handlePeliculaClick = (item) => {
    token ? navigate(`/modal/${item.id}`) : navigate("/login");
  };
    if (!state.Populares || state.Populares.length === 0) return null;

    // Tomamos la primera película para la portada principal
    const mainMovie = state.Populares[0];

    return (
        <div className="relative h-[80vh] w-full overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src={`https://image.tmdb.org/t/p/original${mainMovie.backdrop_path || mainMovie.poster_path}`}
                    alt={mainMovie.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 z-20">
                    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg max-w-2xl">
                        {mainMovie.title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm md:text-lg text-white line-clamp-3">
                        {mainMovie.overview}
                    </p>
                    <div className="mt-6 flex gap-4">
                  
  <button
    type="button"
    onClick={() => handlePeliculaClick(mainMovie)}
    className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition flex items-center"
  >
    <i className="fa-solid fa-play mr-2"></i>
    Reproducir
  </button>

                      <button
  onClick={() => setModalInfo(true)}
  className="bg-white/20 text-white font-semibold px-6 py-3 rounded-md hover:bg-white/30 transition flex items-center"
>
  <i className="fa-solid fa-circle-info mr-2"></i>
  Más información
</button>
                    </div>
                </div>
            </div>
            {modalInfo && (
  <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center px-4">
    <div className="bg-zinc-900 text-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative">
      
      <button
        onClick={() => setModalInfo(false)}
        className="absolute top-4 right-4 z-10 bg-black/60 text-white w-10 h-10 rounded-full hover:bg-red-600 transition"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <img
        src={`https://image.tmdb.org/t/p/original${mainMovie.backdrop_path || mainMovie.poster_path}`}
        alt={mainMovie.title}
        className="w-full h-64 object-cover"
      />

      <div className="p-6">
        <h2 className="text-3xl font-bold mb-3">{mainMovie.title}</h2>

        <p className="text-zinc-300 leading-7 mb-4">
          {mainMovie.overview || "No hay descripción disponible."}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm text-zinc-300">
          <p>
            <span className="text-white font-bold">Fecha:</span>{" "}
            {mainMovie.release_date || "No disponible"}
          </p>

          <p>
            <span className="text-white font-bold">Puntuación:</span>{" "}
            {mainMovie.vote_average || "No disponible"}
          </p>
        </div>
      </div>
    </div>
  </div>
)}
        </div>

        
    );
};

export default Portada;