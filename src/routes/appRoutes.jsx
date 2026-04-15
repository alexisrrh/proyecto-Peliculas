import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Favoritos from "../pages/Favoritos";
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
      <Route path="/search/:texto?" element={<Search />} />
   
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
