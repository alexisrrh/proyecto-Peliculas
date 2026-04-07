import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

function Modal() {
    const { id } = useParams();
    const { state } = useAppContext();
    const [video, setVideo] = useState(null);
    const todasLasPeliculas = [
        ...state.Populares || [],
        ...state.Accion || [],
        ...state.Comedia || [],
        ...state.Terror || [],
        ...state.Animadas || []];

    async function fetchVideos() {
        try {
            let responseV = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=1ecf4daf764af90f82ce01b58fd9ecc7`,
                { method: "GET" });

            let data = await responseV.json();
            if (responseV.ok) {
                console.log(data);
                setVideo(data.results[0]);
            }
        }
        catch (error) {
            console.log("Error:", error);
        }
    }
    useEffect(() => {
        fetchVideos();
    }, [id]);

    const pelicula = todasLasPeliculas.find((item) => item.id === parseInt(id));
    if (!pelicula) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1>Película no encontrada</h1>
            </div>
        );
    }
    return (
        <div className="card-d container">
            <div className="card-detalles">


                <div className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                    <div className="w-full max-w-md rounded-lg bg-white/25 p-6 shadow-lg dark:bg-gray-900">
                        <h2 id="modalTitle" className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white text-center pb-2">
                            {pelicula.title}
                        </h2>
                        <hr className="mb-3 border-gray-300" />
                        <div>

                            {video?.key ? (<div className="aspect-video w-full overflow-hidden rounded-lg">
                                <iframe src={`https://www.youtube.com/embed/${video.key}?autoplay=1&mute=1`} className="h-full w-full" frameBorder="0" allowFullScreen title={pelicula.title} ></iframe>

                            </div>
                            ) : (
                                <p className="text-gray-600">Cargando video...</p>
                            )}

                        </div>
                        <hr className="mt-3 border-gray-300" />
                        <Link to="/" ><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex mt-4 mx-80">
                            Volver
                        </button>  </Link>
                    </div>
                </div>


            </div>
        </div>
    );
}



export default Modal;

