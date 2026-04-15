import React from "react";
import PeliculasPopulares from "../componentes/PeliculasPopulares";
import PeliculasAccion from "../componentes/PeliculasAccion";
import PeliculasComedia from "../componentes/PeliculasComedia";
import PeliculasTerror from "../componentes/PeliculasTerror";
import PeliculasAnimadas from "../componentes/PeliculasAnimadas";
import Portada from "../componentes/Portada";


function Home() {
  return (
  <div>
  {/* HERO + LISTA ENCIMA */}
  <div className="relative w-full h-[130vh]">

    <Portada />

    <div className="absolute bottom-6 left-0 z-30 w-full px-6">
      <p className="text-center text-4xl text-white font-bold drop-shadow-lg mb-0">
        Peliculas Populares
      </p>

      <PeliculasPopulares />
    </div>

  </div>

  {/* RESTO NORMAL (debajo) */}
  <p className="text-center text-4xl text-white mt-10 font-bold drop-shadow-lg">
    Películas de Acción
  </p>
  <PeliculasAccion />

  <p className="text-center text-4xl text-white mt-10 font-bold drop-shadow-lg">
    Películas de Comedia
  </p>
  <PeliculasComedia />

  <p className="text-center text-4xl text-white mt-10 font-bold drop-shadow-lg">
    Películas de Terror
  </p>
  <PeliculasTerror />

  <p className="text-center text-4xl text-white mt-10 font-bold drop-shadow-lg">
    Películas Animadas
  </p>
  <PeliculasAnimadas />
</div>
  );
}

export default Home;
