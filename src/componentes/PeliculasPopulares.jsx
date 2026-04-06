import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import React, { useRef } from "react";

const PeliculasPopulares = () => {
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
      <button onClick={() => scroll("left")} className=" m-5 absolute left-0 top-1/2 z-50 -translate-y-1/2 rounded-full  bg-black/60 px-3 py-2 text-white focus:outline-none"
      >
        <i className="fa-solid fa-angles-left "></i>
      </button>

      <div ref={scrollRef} className="listaP overflow-visible">
        {state.Populares.map((item) => (

          <div key={item.id} className="min-w-[240px] shrink-0 overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-white/80 transform transition-all duration-300 hover:z-20 hover:-translate-y-4 hover:scale-105 hover:shadow-2xl hover:ring-red-500/50"
          > <Link to={`/modal/${item.id}`} className="block">
              <div className="overflow-hidden">
                <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} className="h-[300px] w-full object-cover transition duration-500" />
              </div>
            </Link>
            <div className="p-3">

              <div className="flex items-start justify-between gap-3 p-2">
                <h3 className="text-xl font-semibold text-white line-clamp-2">
                  {item.title}
                </h3>

                <i className={`fa-solid fa-heart cursor-pointer transition transform hover:scale-150 pt-2  ${state.Favoritos.find((fav) => fav.id === item.id) ? "text-red-500 scale-110" : "text-white"}`}
                  onClick={() => dispatch({ type: "set_Favoritos", payload: item })}  ></i>
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-400 line-clamp-4">
                {item.overview}
              </p>
            </div>
          </div>

        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-50 m-5 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white focus:outline-none"
      >
        <i className="fa-solid fa-angles-right"></i>
      </button>

    </div>
  );
};

export default PeliculasPopulares;