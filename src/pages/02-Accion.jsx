import React from 'react'
import { appReducer } from '../context/appReducer';

const Accion = () => {
    const {state, dispatch} = useAppContext();
  return (
    <div className="relative mx-auto px-4 py-2">
      <div ref={scrollRef} className="listaP">
        {state.Accion.map((item) => (
          <div
            key={item.id}
            className="min-w-[260px] shrink-0 overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-red-500/40"
          >
            <div className="overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title}
                className="h-85 w-full object-cover transition duration-500"
              />
            </div>

            <div className="titulo p-2">
              <h3 className="text-xl font-semibold text-white">
                {item.title}
              </h3>
              
   <i className="fa-regular fa-heart text-red-500 pt-2" onClick={() => { dispatch({ type: "set_Favoritos", payload: item });}}></i></div>
   <div>
              <p className="mt-3 text-sm leading-6 text-zinc-400 line-clamp-4">
                {item.overview}
              </p>
            </div>
        
          </div>
        ))}
      </div>

    </div>
  );
}

export default Accion;