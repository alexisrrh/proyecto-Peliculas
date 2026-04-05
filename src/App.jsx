import { BrowserRouter } from "react-router-dom";
import  Navbar  from "./componentes/Navbar";
import  Footer  from "./componentes/Footer";
import { AppRoutes } from "./routes/appRoutes";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
      
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

