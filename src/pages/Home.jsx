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
  <div className="relative w-full lg:h-[130vh]">
    <Portada />

    <div className="w-full px-4 mt-4 lg:absolute lg:bottom-6 lg:left-0 lg:z-30 lg:px-6">
      <p className="text-center text-2xl md:text-3xl lg:text-4xl text-white font-bold drop-shadow-lg mb-4">
        Películas Populares
      </p>

      <PeliculasPopulares />
    </div>
  </div>

  <p className="text-center text-2xl md:text-3xl lg:text-4xl text-white mt-10 font-bold drop-shadow-lg">
    Películas de Acción
  </p>
  <PeliculasAccion />

  <p className="text-center text-2xl md:text-3xl lg:text-4xl text-white mt-10 font-bold drop-shadow-lg">
    Películas de Comedia
  </p>
  <PeliculasComedia />

  <p className="text-center text-2xl md:text-3xl lg:text-4xl text-white mt-10 font-bold drop-shadow-lg">
    Películas de Terror
  </p>
  <PeliculasTerror />

  <p className="text-center text-2xl md:text-3xl lg:text-4xl text-white mt-10 font-bold drop-shadow-lg">
    Películas Animadas
  </p>
  <PeliculasAnimadas />
</div>
  );
}

export default Home;
