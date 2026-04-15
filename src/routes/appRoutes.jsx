import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Favoritos from "../pages/Favoritos";
import Animadas from "../pages/05-Animadas";
import Accion1 from "../pages/02-Accion";
import Terror from "../pages/03-Terror";
import Comedia from "../pages/04-Comedia";
import Modal from "../componentes/Modal";
import Search from "../pages/Busqueda";
import Categorias from "../pages/Categorias";


export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/favoritos" element={<Favoritos />} />
      
  
      <Route path="/populares" element={<Categorias />} />
      <Route path="/accion" element={<Categorias />} />
      <Route path="/terror" element={<Categorias />} />
      <Route path="/comedia" element={<Categorias />} />
      <Route path="/animadas" element={<Categorias />} />
      <Route path="/modal/:id" element={<Modal/>} />
      <Route path="/search/:texto" element={<Search />} />
   
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
