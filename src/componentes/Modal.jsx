import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Modal() {
    const { id } = useParams();
    const { state } = useAppContext();
    const [video, setVideo] = useState(null);

    const todasLasPeliculas = [
        ...(state.Populares || []),
        ...(state.Accion || []),
        ...(state.Comedia || []),
        ...(state.Terror || []),
        ...(state.Animadas || [])
    ];

    useEffect(() => {
        async function fetchVideos() {
            try {
                let responseV = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=1ecf4daf764af90f82ce01b58fd9ecc7`,
                    { method: "GET" }
                );
                let data = await responseV.json();
                
                if (data.results) {
                    const trailer = data.results.find(
                        (item) => item.type === "Trailer" && item.site === "YouTube" && item.official === true
                    ) || data.results.find(
                        (item) => item.type === "Trailer" && item.site === "YouTube"
                    ) || data.results[0];
                    
                    setVideo(trailer);
                }
            } catch (error) {
                console.log("Error:", error);
            }
        }
        fetchVideos();
    }, [id]);

    const pelicula = todasLasPeliculas.find((item) => item.id === parseInt(id));

    if (!pelicula) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <h1>Película no encontrada</h1>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 grid place-content-center bg-black/80 p-4" role="dialog">
            <div className="relative w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white sm:text-2xl">{pelicula.title}</h2>
                    <Link to="/">
                        <button className="text-white font-bold cursor-pointer hover:scale-125 hover:text-orange-500 transition-all text-2xl">
                            ✕
                        </button>
                    </Link>
                </div>

                <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl">
                    {video?.key ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${video.key}?autoplay=1&mute=0&rel=0`}
                            className="h-full w-full"
                            frameBorder="0"
                            allowFullScreen
                            title={pelicula.title}
                        ></iframe>
                    ) : (
                        <div className="h-full w-full bg-zinc-900 flex items-center justify-center text-white">
                            <p>Cargando trailer...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Modal;