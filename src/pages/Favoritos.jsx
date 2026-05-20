import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import MovieCard from "../componentes/MovieCard";

function Favoritos() {
  const { state } = useAppContext();

  useEffect(() => {
    console.log("FAVORITOS EN LA PAGINA:", state.Favoritos);
  }, [state.Favoritos]);

  return (
    <div className="w-full px-4 mt-20 mb-10 min-h-screen">
      <h2 className="text-3xl font-bold text-white mb-8 pl-4 flex items-center gap-3">
        <i className="fa-solid fa-heart text-red-500"></i> Mis Favoritos
      </h2>

      {state.Favoritos.length === 0 ? (
        <div className="text-white text-center mt-20 text-xl text-zinc-500">
          No tienes películas favoritas.
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8 pb-20">
          {state.Favoritos.map((item) => (
            // Pasamos isFavoritosPage=true para que renderice el botón de eliminar
            <MovieCard key={item.id} item={item} isFavoritosPage={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoritos;