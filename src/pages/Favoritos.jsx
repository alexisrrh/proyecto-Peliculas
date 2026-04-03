import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";  
function Favoritos() {
const { state, dispatch } = useAppContext();

  useEffect(() => {
    console.log("FAVORITOS EN LA PAGINA:", state.Favoritos);
  }, [state.Favoritos]);


 


return (
  <div className="max-w-7xl mx-auto px-4 py-4">

    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

      {state.Favoritos.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-red-500/40"
        >
          
          {/* IMAGEN CUADRADA */}
          <div className="w-full aspect-square overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title}
              className="w-full h-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* CONTENIDO */}
          <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-white line-clamp-2">
                  {item.title}
                </h3>

                <i
                  className="fa-regular fa-trash-can text-red-300  p-2 cursor-pointer"
                  onClick={() => dispatch({ type: "remove_Favoritos", payload: item })}
                ></i>
              </div>
              <div>
            <p className="mt-2 text-sm text-zinc-400 line-clamp-3">
              {item.overview}
            </p>
          </div>

        </div>
      ))}

    </div>

  </div>
);
}

export default Favoritos;