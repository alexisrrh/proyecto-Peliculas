import React, { useState } from 'react';

export const PerfilUsuario = () => {
  // Lista fija de las 4 opciones de avatar con temática VHS / Cine Retro
  const opcionesAvatares = [
    "unsplash.com", // Avatar 1
    "unsplash.com", // Avatar 2
    "unsplash.com", // Avatar 3
    "unsplash.com"  // Avatar 4
  ];

  // Estado para controlar qué avatar está seleccionado (inicia con el primero)
  const [avatarActual, setAvatarActual] = useState(opcionesAvatares[0]);
  
  // Estado para alternar entre ver el perfil o ver el selector de avatares
  const [editando, setEditando] = useState(false);

  // Datos mock del usuario
  const usuario = {
    nombre: "Priskin",
    socioNumero: "001985",
    miembroDesde: "Octubre 1994",
    puntos: 1250,
  };

  return (
    <div className="text-white font-mono p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Contenedor Principal Centralizado */}
      <div className="w-full max-w-md flex flex-col items-center z-10">
        
        {/* Título Estilo Neón */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] text-center">
          EXPEDIENTE DE SOCIO
        </h1>

        {/* Tarjeta de Socio Transparente (Hereda tu fondo de pantalla) */}
        <div className="w-full border-2 border-purple-500 p-6 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.2),_8px_8px_0px_0px_rgba(236,72,153,1)] relative overflow-hidden group hover:shadow-[0_0_30px_rgba(168,85,247,0.4),_12px_12px_0px_0px_rgba(236,72,153,1)] transition-all duration-300 backdrop-blur-xs">
          
          {/* Código de barras decorativo superior derecho */}
          <div className="absolute top-3 right-4 opacity-40 flex h-6 gap-[2px]">
            {[2, 4, 1, 3, 1, 4, 2, 1, 3].map((w, i) => (
              <span key={i} className="bg-white h-full" style={{ width: `${w}px` }}></span>
            ))}
          </div>

          <div className="flex flex-col items-center pt-4">
            
            {/* Contenedor del Avatar Estilo Retro */}
            <div className="w-36 h-36 border-4 border-purple-500 rounded-none overflow-hidden relative shadow-[0_0_15px_rgba(168,85,247,0.3)] mb-4">
              <img 
                src={avatarActual} 
                alt="Avatar Socio" 
                className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-purple-500/10 mix-blend-color"></div>
            </div>

            {/* Nombre del Socio e ID */}
            <h2 className="text-2xl font-black text-pink-500 uppercase tracking-widest text-center animate-pulse duration-2000">
              {usuario.nombre}
            </h2>
            <p className="text-xs text-zinc-400 font-bold mt-1 tracking-widest">
              MEMBERSHIP NO: <span className="text-white">{usuario.socioNumero}</span>
            </p>
            
            {/* Panel Selector con las 4 Opciones (Solo se renderiza al pulsar Editar) */}
            {editando && (
              <div className="mt-6 w-full border border-dashed border-pink-500 p-4 rounded-lg text-center bg-transparent backdrop-blur-md">
                <p className="text-xs font-bold text-pink-400 mb-3 uppercase tracking-wider">Selecciona tu Avatar:</p>
                <div className="grid grid-cols-4 gap-2">
                  {opcionesAvatares.map((imgUrl, indice) => (
                    <button
                      key={indice}
                      onClick={() => setAvatarActual(imgUrl)}
                      className={`aspect-square border-2 overflow-hidden transition-transform active:scale-95 ${
                        avatarActual === imgUrl 
                          ? 'border-pink-500 scale-105 shadow-[0_0_8px_rgba(236,72,153,0.6)]' 
                          : 'border-zinc-700 hover:border-purple-400'
                      }`}
                    >
                      <img src={imgUrl} alt={`Opción ${indice + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setEditando(false)} 
                  className="mt-4 text-[10px] text-zinc-400 underline hover:text-white block mx-auto uppercase tracking-widest"
                >
                  Confirmar selección
                </button>
              </div>
            )}

            {/* Tabla de Información Estilo Terminal (Se oculta al editar para dejar espacio) */}
            {!editando && (
              <div className="mt-6 w-full border border-zinc-700 p-4 rounded-lg text-sm space-y-3 font-semibold bg-transparent">
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-purple-400 uppercase">ESTADO DE CUENTA:</span> 
                  <span className="text-emerald-400 border border-emerald-500/30 px-2 rounded text-xs flex items-center bg-transparent">● ACTIVO</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-purple-400 uppercase">ALTA DEL CLUB:</span> 
                  <span className="text-zinc-300">{usuario.miembroDesde}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-purple-400 uppercase">PUNTOS VHS:</span> 
                  <span className="text-yellow-400 tracking-wider font-mono">{usuario.puntos} PTS</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Sección Unificada de Botones de Acción */}
        <div className="w-full grid grid-cols-2 gap-4 mt-8">
          <button 
            onClick={() => setEditando(!editando)}
            className={`py-3 rounded-none transform -skew-x-12 transition-all font-black uppercase tracking-wider text-sm border-r-4 border-b-4 active:translate-y-1 active:border-0 shadow-lg ${
              editando 
                ? 'bg-pink-600 hover:bg-pink-500 border-pink-900 text-white' 
                : 'bg-purple-600 hover:bg-purple-500 border-purple-900 text-white'
            }`}
          >
            {editando ? "VER EXPEDIENTE" : "EDITAR PERFIL"}
          </button>
          <button className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white py-3 rounded-none transform -skew-x-12 transition-all font-black uppercase tracking-wider text-sm active:translate-y-1 shadow-lg bg-transparent">
            CERRAR SESIÓN
          </button>
        </div>

      </div>
    </div>
  );
};
