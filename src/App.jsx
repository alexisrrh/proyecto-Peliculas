import { BrowserRouter, useLocation } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Footer from "./componentes/Footer";
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
      <Layout />
    </BrowserRouter>
  );
}

export default App;