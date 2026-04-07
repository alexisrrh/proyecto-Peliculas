
import React, { useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";


const PeliculasAnimadas = () => {


  const { state, dispatch } = useAppContext();

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 300;

      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mx-auto ">
      <button
        onClick={() => scroll("left")}
        className="botonDerecho absolute left-0 top-1/2 m-5 -translate-y-1/2 z-50 bg-black/60 text-white px-3 py-2 rounded-full outline-none focus:outline-none">
        <i className="fa-solid fa-angles-left"></i>
      </button>

      <div ref={scrollRef} className="border-0 flex flex-row justify-start  overflow-hidden gap-20 p-15">
        {state.Animadas.map((item) => (
          <div
            key={item.id}
            className="max-w-[240px] shrink-0 overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-white/80 transform transition-all duration-300 hover:z-20 hover:-translate-y-4 hover:scale-105 hover:shadow-2xl hover:ring-red-500/50"
          > <Link to={`/modal/${item.id}`} className="block">
              <div className="overflow-hidden">
                <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} className="h-85 w-full object-cover transition duration-500" />
              </div>
            </Link>
            <div className="flex items-start justify-between gap-3 p-2">
              <h3 className="text-xl font-semibold text-white">
                {item.title}
              </h3>

              <i className={`fa-solid fa-heart cursor-pointer transition transform pt-2 hover:scale-150 ${state.Favoritos.find((fav) => fav.id === item.id) ? "text-red-500 scale-110" : "text-white"}`}
                onClick={() => { dispatch({ type: "set_Favoritos", payload: item }); }}></i></div>
            <div>
              <p className="mt-3 text-sm leading-6 text-zinc-400 line-clamp-4">
                {item.overview}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 m-5 -translate-y-1/2 z-50 bg-black/60 text-white px-3 py-2 rounded-full"
      >
        <i className="fa-solid fa-angles-right"></i>
      </button>
    </div>
  );
}

export default PeliculasAnimadas;