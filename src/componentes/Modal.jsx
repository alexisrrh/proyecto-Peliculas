import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";   
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

function Modal() {
    const { id } = useParams();
    const { state } = useAppContext();
    const [video, setVideo] = useState(null);

    async function fetchVideos() {
        try {
            let responseV = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=1ecf4daf764af90f82ce01b58fd9ecc7`,
                { method: "GET" });

     let data = await responseV.json();
     if (responseV.ok) {
       console.log(data);
       setVideo(data.results[0]);
     }}
    catch (error) {  
             console.log("Error:", error);
     }
    }
        useEffect(() => {  
        fetchVideos();
         }, [id]);
if (!state.Populares || state.Populares.length === 0) {
  return <h1>Cargando...</h1>;
}
    const pelicula = state.Populares.find((item) => item.id === parseInt(id));  
        if (!pelicula) {
          return (
            <div className="flex items-center justify-center h-screen">
              <h1>Película no encontrada</h1>
            </div>
          );
        }
  return (
<div className="card-d container">


    
   <div className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
    <h2 id="modalTitle" className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
        {pelicula.title}
    </h2>

  <div className="mt-4 aspect-video w-full">
  {video && (
    <iframe
      className="h-full w-full rounded-lg"
      src={`https://www.youtube.com/embed/${video.key}`} frameBorder="0" allowFullScreen title={pelicula.title}></iframe>
  )}
</div>
</div>
 <Link to="/" ><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Volver
  </button>  </Link>

  </div>
  </div>
  );
}



export default Modal;

