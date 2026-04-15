import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Favoritos() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    console.log("FAVORITOS EN LA PAGINA:", state.Favoritos);
  }, [state.Favoritos]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {state.Favoritos.length === 0 ? (
        <h1 className="textF text-center text-red-500">
          No tienes películas favoritas.
        </h1>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {state.Favoritos.map((item) => (
            <div key={item.id} className="group relative shadow-lg transform transition-all duration-300 hover:z-20 hover:-translate-y-4 hover:scale-105 hover:shadow-2xl hover:ring-red-500/50">
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <Link to={`/modal/${item.id}`}>
                  <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}  alt={item.title} className="h-full w-full rounded-2xl object-cover transition duration-500 hover:rotate-2 hover:grayscale"
                  />
                </Link>

                <div className="absolute top-0 left-0 right-0 flex items-start justify-between gap-3 p-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>

                  <i className={`fa-solid fa-heart cursor-pointer transition transform pt-2 hover:scale-150 ${ state.Favoritos.find((fav) => fav.id === item.id) ? "text-red-500 scale-110": "text-white"}`} onClick={() => dispatch({ type: "set_Favoritos", payload: item }) }
                  ></i>
                </div>

                <i
                  className="fa-regular fa-trash-can absolute bottom-2 right-2 text-red-300 p-2 cursor-pointer"
                  onClick={() =>
                    dispatch({ type: "remove_Favoritos", payload: item })
                  }
                ></i>
              </div>

              <p className="overflow-hidden rounded-2xl  bg-zinc-900 mt-3 text-sm leading-6 text-white font-bold text-justify line-clamp-4 px-4 py-1 group-hover:translate-y-0 md:opacity-0 group-hover:opacity-100  md:-translate-y-100 transition-all duration-300">
                {item.overview}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoritos;