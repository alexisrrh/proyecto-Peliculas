import React from "react";  
import { useAppContext } from "../context/AppContext";  
function Favoritos() {
const { state } = useAppContext();

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        {state.favoritos?.map((item) => (
          <div key={item.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card bg-dark text-white h-100">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title}
                className="card-img-top"
              />

              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">
                  {item.overview}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favoritos;