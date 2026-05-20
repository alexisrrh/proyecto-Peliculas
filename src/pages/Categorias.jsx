import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from "react-router-dom";
import MovieCard from "../componentes/MovieCard";

const Categorias = () => {
  const { state } = useAppContext();
  const location = useLocation();

  const getPeliculasPorRuta = () => {
    switch (location.pathname) {
      case '/accion': return { data: state.Accion, titulo: "Acción" };
      case '/comedia': return { data: state.Comedia, titulo: "Comedia" };
      case '/terror': return { data: state.Terror, titulo: "Terror" };
      case '/animadas': return { data: state.Animadas, titulo: "Animadas" };
      case '/populares': return { data: state.Populares, titulo: "Populares" };
      default: return { data: state.Populares, titulo: "Destacadas" };
    }
  };

  const { data: peliculas, titulo } = getPeliculasPorRuta();

  return (
    <div className="w-full px-4 mt-20 mb-10 min-h-screen">
      <h2 className="text-3xl font-bold text-white mb-8 pl-4">{titulo}</h2>
      
      <div className="flex flex-wrap justify-center gap-8 pb-20">
        {peliculas?.map((item) => (
          <MovieCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Categorias;