import { BrowserRouter } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Footer from "./componentes/Footer";
import StarBackground from "./componentes/StarBackground"; // <--- Importamos el fondo
import { AppRoutes } from "./routes/appRoutes";

function Layout() {
  const location = useLocation();
  
  // No mostrar Navbar/Footer si estamos en "/" o en "/relax"
  const isFullScreenPage = location.pathname === "/" || location.pathname === "/relax";

  return (
    <div className="flex flex-col min-h-screen">
      {!isFullScreenPage && <Navbar />}
      
      <main className="flex-grow">
        <AppRoutes />
      </main>
      
      {!isFullScreenPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* Añadimos 'relative' para que el z-index de los hijos funcione bien */}
      <div className="flex flex-col min-h-screen relative text-white">
        
        {/* 1. EL FONDO (Siempre detrás) */}
        <StarBackground />
      
        {/* 2. EL CONTENIDO (Encima del fondo) */}
        <Navbar />
      
        <main className="flex-grow relative z-10">
          <AppRoutes />
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
