import React from 'react';
import { useAppContext } from '../context/AppContext';

const Animadas = () => {
  const { state, dispatch } = useAppContext();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Grid responsivo: 1 columna en móvil, 2 en tablet, 4 en desktop */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {state.Animadas.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col overflow-hidden rounded-xl bg-zinc-900 shadow-xl ring-1 ring-white/10 transition-all hover:ring-red-500/50"
          >
            {/* Contenedor de Imagen con ratio de aspecto de póster */}
            <div className="aspect-[2/3] overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              {/* Botón de Favorito flotante sobre la imagen */}
              <button 
                onClick={() => dispatch({ type: "set_Favoritos", payload: item })}
                className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 backdrop-blur-md transition hover:bg-red-500/20"
              >
                <i className={` text-xl ${state.Favoritos.find((fav) => fav.id === item.id) ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart text-white"}`}></i>
              </button>
            </div>

            {/* Contenido de Texto */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="line-clamp-1 text-lg font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                {item.overview}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Animadas;