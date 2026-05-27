import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Modal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useAppContext();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    const todasLasPeliculas = useMemo(() => [
        ...(state.Populares || []),
        ...(state.Accion || []),
        ...(state.Comedia || []),
        ...(state.Terror || []),
        ...(state.Animadas || []),
        ...(state.searchResults || [])
    ], [state]);

    const pelicula = todasLasPeliculas.find((item) => item.id === parseInt(id));

    useEffect(() => {
        if (!id) return;
        async function fetchVideos() {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=1ecf4daf764af90f82ce01b58fd9ecc7`
                );
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const trailer = data.results.find(
                        (item) => item.type === "Trailer" && item.site === "YouTube" && item.official === true
                    ) || data.results.find(
                        (item) => item.type === "Trailer" && item.site === "YouTube"
                    ) || data.results[0];
                    setVideo(trailer);
                }
            } catch (error) {
                console.error("Error al traer el video:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchVideos();
    }, [id]);

    if (!pelicula) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-md">
                <div className="text-center bg-zinc-900/80 p-8 rounded-2xl border border-white/10">
                    <h1 className="text-white text-2xl mb-4 font-bold">Película no encontrada</h1>
                    <button onClick={() => navigate(-1)} className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition">Volver</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-md p-4 animate-in fade-in duration-300">
            {/* Overlay transparente para cerrar al hacer clic fuera */}
            <div className="absolute inset-0" onClick={() => navigate(-1)}></div>

            <div className="relative w-full max-w-5xl bg-zinc-900/95 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 border border-white/10">
                
                {/* Botón Cerrar Flotante (para evitar el doble título arriba) */}
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-white hover:text-black text-white rounded-full p-2 transition-all backdrop-blur-md border border-white/10"
                >
                    <svg xmlns="http://w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Contenedor del Video */}
                <div className="relative aspect-video w-full bg-black">
                    {video?.key ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1`}
                            className="absolute inset-0 h-full w-full"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title={pelicula.title}
                        ></iframe>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-white p-10 text-center">
                            {loading ? (
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-400 mb-4"></div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-xl text-zinc-400 font-medium">Trailer no disponible</p>
                                    {pelicula.backdrop_path && (
                                        <img 
                                            src={`https://tmdb.org{pelicula.backdrop_path}`} 
                                            alt="Backdrop" 
                                            className="rounded-lg opacity-40 max-h-60 mx-auto border border-white/10"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Info en la base: Aquí pusimos el título para que no se choque con el del video */}
                <div className="p-6 md:p-8 bg-zinc-900/90">
                    <h2 className="text-2xl font-black text-white md:text-4xl mb-2">
                        {pelicula.title}
                    </h2>
                    <div className="flex items-center gap-3 mb-4 text-sm font-bold text-yellow-400">
                        <span>{pelicula.release_date?.split('-')[0]}</span>
                        <span className="text-zinc-600">|</span>
                        <span>⭐ {pelicula.vote_average?.toFixed(1)}</span>
                    </div>
                    <p className="text-zinc-300 text-sm md:text-base leading-relaxed line-clamp-4">
                        {pelicula.overview}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Modal;
