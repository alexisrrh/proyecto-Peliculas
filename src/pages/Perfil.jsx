import React from 'react';

export const PerfilUsuario = () => {
  // Datos de ejemplo (esto vendría de tu auth o base de datos)
  const usuario = {
    nombre: "Priskin",
    socioNumero: "001985",
    miembroDesde: "Octubre 1994",
    puntos: 1250,
    avatar: "https://placeholder.com", // O una foto con filtro grain
    favoritos: [
      { id: 1, titulo: "Back to the Future", poster: "url-poster" },
      { id: 2, titulo: "Blade Runner", poster: "url-poster" }
    ]
  };

  return (
    <div className="text-white font-mono p-8 flex flex-col items-center">
      
      {/* Título Estilo Neón */}
      <h1 className="text-4xl md:text-6xl font-bold mb-10 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
        EXPEDIENTE DE SOCIO
      </h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Lado Izquierdo: El Carnet */}
        <div className="col-span-1 bg-zinc-900 border-2 border-purple-500 p-6 rounded-lg shadow-[5px_5px_0px_0px_rgba(168,85,247,1)] relative overflow-hidden">
          {/* Efecto de estática/ruido encima */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://giphy.com')]"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-32 h-32 border-4 border-pink-500 mb-4 overflow-hidden">
              <img src={usuario.avatar} alt="Avatar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
            <h2 className="text-xl font-bold text-pink-500 uppercase tracking-widest">{usuario.nombre}</h2>
            <p className="text-xs text-zinc-400">ID: {usuario.socioNumero}</p>
            
            <div className="mt-6 w-full border-t border-zinc-700 pt-4 text-xs space-y-2">
              <p><span className="text-purple-400 uppercase">Estado:</span> ACTIVO</p>
              <p><span className="text-purple-400 uppercase">Miembro desde:</span> {usuario.miembroDesde}</p>
              <p><span className="text-purple-400 uppercase">Créditos:</span> {usuario.puntos} pts</p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Actividad y Ajustes */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* Sección Películas Alquiladas / Favoritas */}
          <div className="bg-zinc-900/50 border border-zinc-700 p-6 rounded-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              CINTAS EN POSESIÓN
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Placeholder de películas */}
              <div className="aspect-[2/3] bg-zinc-800 border border-dashed border-zinc-600 flex items-center justify-center text-zinc-500 text-xs text-center p-2">
                REBOBINANDO...
              </div>
              <div className="aspect-[2/3] bg-zinc-800 border border-dashed border-zinc-600 flex items-center justify-center text-zinc-500 text-xs text-center p-2">
                INSERTAR CINTA
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-none transform -skew-x-12 transition-all font-bold">
              EDITAR PERFIL
            </button>
            <button className="border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-6 py-2 rounded-none transform -skew-x-12 transition-all font-bold">
              CERRAR SESIÓN
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
