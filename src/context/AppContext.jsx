import React, { createContext, useContext, useReducer, useEffect } from "react";
import { appReducer, initialState } from "./appReducer";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  async function peliculas() {
    try {
      let response = await fetch(
        "https://api.themoviedb.org/3/movie/popular?api_key=1ecf4daf764af90f82ce01b58fd9ecc7",
        { method: "GET" },
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data.results);
        dispatch({ type: "set_Populares", payload: data.results });
      } else {
        console.log(response.status);
      }
      let responseP = await fetch(
        "https://api.themoviedb.org/3/discover/movie?api_key=1ecf4daf764af90f82ce01b58fd9ecc7&with_genres=28",
        { method: "GET" },
      );
      if (responseP.ok) {
        const dataP = await responseP.json();
        console.log(dataP);
        dispatch({ type: "set_Accion", payload: dataP.results });
      } else {
        console.log(responseP.status);
      }
      let responseC = await fetch(
        "https://api.themoviedb.org/3/discover/movie?api_key=1ecf4daf764af90f82ce01b58fd9ecc7&with_genres=35",
        { method: "GET" },
      );
      if (responseC.ok) {
        const dataC = await responseC.json();
        console.log(dataC);
        dispatch({ type: "set_Comedia", payload: dataC.results });
      } else {
        console.log(responseC.status);
      }
      let responseT = await fetch(
        "https://api.themoviedb.org/3/discover/movie?api_key=1ecf4daf764af90f82ce01b58fd9ecc7&with_genres=27",
        { method: "GET" },
      );

      if (responseT.ok) {
        const dataT = await responseT.json();
        console.log(dataT);

        dispatch({ type: "set_Terror", payload: dataT.results });
      } else {
        console.log(responseT.status);
      }

      let responseA = await fetch(
        "https://api.themoviedb.org/3/discover/movie?api_key=1ecf4daf764af90f82ce01b58fd9ecc7&with_genres=16",
        { method: "GET" },
      );

      if (responseA.ok) {
        const dataA = await responseA.json();
        console.log(dataA);

        dispatch({ type: "set_Animadas", payload: dataA.results });
      } else {
        console.log(responseA.status);
      }
    

    } catch (error) {
      return console.log("Error:", error);
    }
  }

  useEffect(() => {
    peliculas();
  }, []);


  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(state.Favoritos));
  }, [state.Favoritos]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
