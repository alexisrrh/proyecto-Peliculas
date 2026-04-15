import React from "react";
import PeliculasPopulares from "../componentes/PeliculasPopulares";
import PeliculasAccion from "../componentes/PeliculasAccion";
import PeliculasComedia from "../componentes/PeliculasComedia";
import PeliculasTerror from "../componentes/PeliculasTerror";
import PeliculasAnimadas from "../componentes/PeliculasAnimadas";
import Carrousel from "../componentes/Carrousel";

function Home() {
  return (
    <div>
      <Carrousel/>
      <p className="text-center text-4xl text-white mt-10 text-shadow-sm font-bold text-shadow-orange-500">
        Peliculas Populares
      </p>
      <PeliculasPopulares />
      <p className="text-center text-4xl text-white mt-10 text-shadow-sm font-bold text-shadow-orange-500">
        Películas de Acción
      </p>
      <PeliculasAccion />
      <p className="text-center text-4xl text-white mt-10 text-shadow-sm font-bold text-shadow-orange-500">
        Películas de Comedia
      </p>
      <PeliculasComedia />
      <p className="text-center text-4xl text-white mt-10 text-shadow-sm font-bold text-shadow-orange-500">
        Películas de Terror
      </p>
      <PeliculasTerror />
      <p className="text-center text-4xl text-white mt-10 text-shadow-sm font-bold text-shadow-orange-500">
        Películas Animadas
      </p>
      <PeliculasAnimadas />
    </div>
  );
}

export default Home;
