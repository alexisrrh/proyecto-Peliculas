import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Modal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useAppContext();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
const [comentarios, setComentarios] = useState([]);
const [loadingComentarios, setLoadingComentarios] = useState(false);
const [comentariosApp, setComentariosApp] = useState([]);
const [nuevoComentario, setNuevoComentario] = useState("");
const [enviandoComentario, setEnviandoComentario] = useState(false);
const API_URL = import.meta.env.VITE_API_URL;
    const todasLasPeliculas = useMemo(() => [
        ...(state.Populares || []),
        ...(state.Accion || []),
        ...(state.Comedia || []),
        ...(state.Terror || []),
        ...(state.Animadas || []),
        ...(state.searchResults || [])
    ], [state]);

    const pelicula = todasLasPeliculas.find((item) => item.id === parseInt(id));

    useEffect(() => {
        if (!id) return;
        async function fetchVideos() {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=1ecf4daf764af90f82ce01b58fd9ecc7`
                );
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const trailer = data.results.find(
                        (item) => item.type === "Trailer" && item.site === "YouTube" && item.official === true
                    ) || data.results.find(
                        (item) => item.type === "Trailer" && item.site === "YouTube"
                    ) || data.results[0];
                    setVideo(trailer);
                }
            } catch (error) {
                console.error("Error al traer el video:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchVideos();
    }, [id]);
    useEffect(() => {
    if (!video?.key) return;

    async function fetchComentarios() {
        setLoadingComentarios(true);

        try {
            const response = await fetch(`${API_URL}/youtube/comments/${video.key}`);
            const data = await response.json();

            if (data.comments) {
                setComentarios(data.comments);
            }
        } catch (error) {
            console.error("Error al traer comentarios:", error);
        } finally {
            setLoadingComentarios(false);
        }
    }

    fetchComentarios();
}, [video?.key]);

useEffect(() => {
  if (!pelicula?.id) return;

  async function fetchComentariosApp() {
    try {
      const response = await fetch(
        `${API_URL}/movies/${pelicula.id}/comments`
      );

      const data = await response.json();

      if (data.comments) {
        setComentariosApp(data.comments);
      }
    } catch (error) {
      console.error("Error cargando comentarios app:", error);
    }
  }

  fetchComentariosApp();
}, [pelicula?.id]);

async function enviarComentario() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión");
    return;
  }

  if (!nuevoComentario.trim()) return;

  setEnviandoComentario(true);

  try {
    const response = await fetch(
      `${API_URL}/movies/${pelicula.id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          texto: nuevoComentario,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setComentariosApp((prev) => [
        data.comment,
        ...prev,
      ]);

      setNuevoComentario("");
    }
  } catch (error) {
    console.error(error);
  } finally {
    setEnviandoComentario(false);
  }
}

    if (!pelicula) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-md">
                <div className="text-center bg-zinc-900/80 p-8 rounded-2xl border border-white/10">
                    <h1 className="text-white text-2xl mb-4 font-bold">Película no encontrada</h1>
                    <button onClick={() => navigate(-1)} className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition">Volver</button>
                </div>
            </div>
        );
    }
return (
  <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md overflow-y-auto">
    <div className="min-h-screen flex justify-center items-start pt-20 p-4">
      <div className="absolute inset-0" onClick={() => navigate(-1)}></div>

      <div className="relative z-[100000] w-full max-w-4xl max-h-[88vh] overflow-y-auto bg-zinc-900/95 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 custom-scroll">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 z-[100001] bg-black/60 hover:bg-white hover:text-black text-white rounded-full px-3 py-1"
        >
          ✕
        </button>

        <div className="relative aspect-video w-full bg-black">
          {video?.key ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1`}
              className="absolute inset-0 h-full w-full"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={pelicula.title}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-white">
              {loading ? "Cargando trailer..." : "Trailer no disponible"}
            </div>
          )}
        </div>

        <div className="p-5 md:p-7">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-2">
            {pelicula.title}
          </h2>

          <div className="flex items-center gap-3 mb-4 text-sm font-bold text-yellow-400">
            <span>{pelicula.release_date?.split("-")[0]}</span>
            <span className="text-zinc-600">|</span>
            <span>⭐ {pelicula.vote_average?.toFixed(1)}</span>
          </div>

          <p className="text-zinc-300 text-sm md:text-base leading-relaxed line-clamp-3">
            {pelicula.overview}
          </p>
        </div>

        <div className="p-5 md:p-7 border-t border-white/10 bg-zinc-950/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-black text-xl">
              Comentarios del trailer
            </h3>

            <span className="text-xs text-zinc-500">
              {comentarios.length} comentarios
            </span>
          </div>

          {loadingComentarios ? (
            <p className="text-zinc-400 text-sm">Cargando comentarios...</p>
          ) : comentarios.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scroll">
              {comentarios.map((comentario, index) => (
                <div
                  key={index}
                  className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/10"
                >
                  <img
                    src={comentario.avatar}
                    alt={comentario.author}
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-white text-sm font-bold">
                      {comentario.author}
                    </p>

                    <p className="text-zinc-300 text-sm leading-relaxed mt-1 line-clamp-3">
                      {comentario.text}
                    </p>

                    <p className="text-zinc-500 text-xs mt-2">
                      👍 {comentario.likes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">
              No hay comentarios disponibles.
            </p>
          )}
          <div className="mt-8 border-t border-white/10 pt-6">
  <h3 className="text-white text-xl font-black mb-4">
    Comentarios VHSFLIX
  </h3>

  <div className="flex gap-3 mb-5">
    <input
      type="text"
      value={nuevoComentario}
      onChange={(e) => setNuevoComentario(e.target.value)}
      placeholder="Escribe un comentario..."
      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
    />

    <button
      onClick={enviarComentario}
      disabled={enviandoComentario}
      className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 rounded-xl transition"
    >
      {enviandoComentario ? "..." : "Enviar"}
    </button>
  </div>

  <div className="space-y-3 max-h-72 overflow-y-auto custom-scroll">
    {comentariosApp.map((comentario) => (
      <div
        key={comentario.id}
        className="bg-white/5 border border-white/10 rounded-xl p-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <img
            src={comentario.user?.avatar}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <p className="text-white font-bold text-sm">
              {comentario.user?.nombre}
            </p>

            <p className="text-zinc-500 text-xs">
              {new Date(comentario.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <p className="text-zinc-300 text-sm">
          {comentario.texto}
        </p>
      </div>
    ))}
  </div>
</div>
        </div>
      </div>
    </div>
  </div>
);
}

export default Modal;
