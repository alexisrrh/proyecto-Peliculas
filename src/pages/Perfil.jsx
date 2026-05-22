import React, { useState, useEffect } from 'react';
import { Private, actualizarAvatarEnDB } from '../services/auth.services';

export const PerfilUsuario = () => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarActual, setAvatarActual] = useState("https://i.pinimg.com/736x/c5/77/35/c577359e3223df4b3d92e785bf7464a8.jpg");
    const [editando, setEditando] = useState(false);

const opcionesAvatares = [
    "https://i.pinimg.com/736x/c5/77/35/c577359e3223df4b3d92e785bf7464a8.jpg", // Avatar 1
    "https://i.pinimg.com/736x/34/0e/1f/340e1f3a71b1b388f6699ebf0328d848.jpg", // Avatar 2
    "https://i.pinimg.com/736x/dd/02/9d/dd029dca8e5ff2e177ca8459760642fa.jpg", // Avatar 3
    "https://i.pinimg.com/736x/1e/e8/8a/1ee88a173e942bada798a19fd02f715f.jpg"  // Avatar 4
  ];

    useEffect(() => {
        const cargarDatosPrivados = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`https://proyecto-peliculas-1-iiml.onrender.com/private`, {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsuario(data);
                    if (data.avatar) setAvatarActual(data.avatar);
                }
            } catch (error) {
                console.error('Error de conexión:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarDatosPrivados();
    }, []);

        // FUNCIÓN PARA GUARDAR EL AVATAR EN EL BACKEND
    const actualizarAvatar = async (nuevaUrl) => {
        const token = localStorage.getItem("token");
        try {
            // Asumimos que tienes un endpoint /update-avatar o similar en tu backend
            const response = await fetch(`${API_URL}/update-avatar`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ avatar: nuevaUrl })
            });

            if (response.ok) {
                setAvatarActual(nuevaUrl);
                setEditando(false);
                console.log("Avatar actualizado en la base de datos");
            } else {
                console.error("No se pudo guardar el avatar en el servidor");
            }
        } catch (error) {
            console.error("Error al guardar avatar:", error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center font-mono p-20">
            <span className="animate-pulse text-purple-500 font-bold">[ ACCEDIENDO AL EXPEDIENTE... ]</span>
        </div>
    );

    if (!usuario) return (
        <div className="flex flex-col items-center justify-center font-mono p-10 text-center">
            <div className="border-2 border-red-500 p-8 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <h1 className="text-red-500 text-2xl font-black mb-4 uppercase">ACCESO DENEGADO</h1>
                <button onClick={() => window.location.href = "/login"} className="bg-red-600 text-white px-6 py-2 transform -skew-x-12 font-bold hover:bg-red-500">
                    VOLVER AL LOGIN
                </button>
            </div>
        </div>
    );

    return (
        <div className="text-white font-mono p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full max-w-md flex flex-col items-center z-10">
                
                {/* Título TITILANTE */}
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] text-center uppercase animate-pulse">
                    Expediente de Socio
                </h1>

                {/* Tarjeta Principal con Sombra Rosa Fija */}
               <div className="w-full border-2 border-purple-500 p-6 rounded-xl relative backdrop-blur-sm bg-black/40 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3),_8px_8px_0px_0px_rgba(236,72,153,1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6),_15px_15px_0px_0px_rgba(236,72,153,1)] hover:-translate-y-2">                
                    <div className="absolute top-3 right-4 opacity-40 flex h-5 gap-[2px]">
                        {[2, 4, 1, 3, 2, 5].map((w, i) => (
                            <span key={i} className="bg-white h-full" style={{ width: `${w}px` }}></span>
                        ))}
                    </div>

                    <div className="flex flex-col items-center pt-4">
                        {/* Avatar */}
                        <div className="w-32 h-32 md:w-36 md:h-36 border-4 border-purple-500 rounded-none overflow-hidden relative mb-6 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                            <img
                                src={avatarActual}
                                alt="Avatar Socio"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>

                        {/* Nombre del cliente */}
                        <h2 className="text-2xl md:text-3xl font-black text-pink-500 uppercase tracking-widest text-center mb-2">
                            {usuario.nombre || usuario.username || usuario.email?.split('@')[0] || "SOCIO"}
                        </h2>
                        
                        {/* ID del cliente */}
                        <p className="text-xs text-zinc-400 font-bold mb-6 tracking-widest">
                            MEMBERSHIP ID: <span className="text-white border-b border-pink-500">#{"00" + usuario.id || "000"}</span>
                        </p>

                        {!editando ? (
                            <div className="w-full space-y-3 font-semibold">
                                <div className="border border-zinc-700 p-4 rounded-lg bg-black/60 shadow-inner">
                                    <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                                        <span className="text-purple-400 text-xs uppercase tracking-tighter">EMAIL REGISTRADO:</span>
                                        <span className="text-zinc-300 text-xs truncate ml-2">{usuario.email}</span>
                                    </div>
                                    
                                    {/* AQUÍ ESTÁN LOS PUNTOS DE VUELTA */}
                                    <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                                        <span className="text-purple-400 text-xs uppercase tracking-tighter">PUNTOS ACUMULADOS:</span>
                                        <span className="text-yellow-400 text-xs font-mono">{usuario.puntos || 0} PTS</span>
                                    </div>

                                    <div className="flex justify-between pt-1">
                                        <span className="text-purple-400 text-xs uppercase tracking-tighter">ESTADO DE CUENTA:</span>
                                        <span className="text-emerald-400 text-xs">● ACTIVO</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full border border-dashed border-pink-500 p-4 rounded-lg text-center bg-black/40">
                                <p className="text-[10px] font-bold text-pink-400 mb-4 uppercase tracking-[0.2em]">ACTUALIZAR AVATAR</p>
                                <div className="grid grid-cols-4 gap-3">
                                    {opcionesAvatares.map((img, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => { setAvatarActual(img); setEditando(false); }}
                                            className={`border-2 transition-all ${avatarActual === img ? 'border-pink-500 scale-110 shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'border-zinc-700'}`}
                                        >
                                            <img src={img} className="w-full aspect-square object-cover grayscale" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-4 mt-8">
                    <button 
                        onClick={() => setEditando(!editando)}
                        className="bg-purple-600 hover:bg-purple-500 text-white py-3 transform -skew-x-12 font-black uppercase text-sm border-r-4 border-b-4 border-purple-900 active:translate-y-1 transition-all"
                    >
                        {editando ? "CANCELAR" : "EDITAR"}
                    </button>
                    <button 
                        onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
                        className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white py-3 transform -skew-x-12 font-black uppercase text-sm active:translate-y-1 transition-all"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};
