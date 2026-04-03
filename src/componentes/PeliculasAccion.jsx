
import React from "react";    
import { useAppContext } from "../context/AppContext";



const PeliculasAccion = () => {


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
    <div className="relative mx-auto px-4 py-8">
      <button
        onClick={() => scroll("left")}
       className="botonDerecho absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white px-3 py-2 rounded-full outline-none focus:outline-none">
        ◀
      </button>

      <div ref={scrollRef} className="listaP">
        {state.Populares.map((item) => (
          <div
            key={item.id}
            className="min-w-[260px] shrink-0 overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-red-500/40"
          >
            <div className="overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title}
                className="h-56 w-full object-cover transition duration-500"
              />
            </div>

            <div className="p-5">
              <h3 className="text-xl font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400 line-clamp-4">
                {item.overview}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white px-3 py-2 rounded-full"
      >
        ▶
      </button>
    </div>
  );
};

export default PeliculasAccion; 