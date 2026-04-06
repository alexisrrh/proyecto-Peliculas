import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Favoritos from "../pages/Favoritos";
import Animadas from "../pages/05-Animadas";
import Populares from "../pages/01-Populares";
import Accion1 from "../pages/02-Accion";
import Terror from "../pages/03-Terror";
import Comedia from "../pages/04-Comedia";
import Modal from "../componentes/Modal";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/favoritos" element={<Favoritos />} />
      
  
      <Route path="/populares" element={<Populares />} />
      <Route path="/accion" element={<Accion1 />} />
      <Route path="/terror" element={<Terror />} />
      <Route path="/comedia" element={<Comedia />} />
      <Route path="/animadas" element={<Animadas />} />
      <Route path="/modal/:id" element={<Modal/>} />

   
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
