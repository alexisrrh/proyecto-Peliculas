
import React from "react";    
import { useAppContext } from "../context/AppContext";



const PeliculasComedia = () => {


const { state, dispatch } = useAppContext();







  return (
  <div className="container mx-auto px-4 py-8">
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      
      {state.Comedia.map((item) => (
        <div
          key={item.id}
          className="group max-w-sm overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-red-500/40"
        >
          <div className="overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"/>
          </div>

          <div className="p-5">
            <h3 className="text-xl font-semibold text-white transition duration-300 group-hover:text-red-400">
              {item.title}
            </h3>

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

export default PeliculasComedia;