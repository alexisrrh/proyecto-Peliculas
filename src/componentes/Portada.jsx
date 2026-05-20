import React from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const Portada = () => {
    const { state } = useAppContext();

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
                        <Link
                            to={`/modal/${mainMovie.id}`}
                            className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition flex items-center"
                        >
                            <i className="fa-solid fa-play mr-2"></i> Reproducir
                        </Link>
                        <button className="bg-white/20 text-white font-semibold px-6 py-3 rounded-md hover:bg-white/30 transition flex items-center">
                            <i className="fa-solid fa-circle-info mr-2"></i> Más información
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portada;