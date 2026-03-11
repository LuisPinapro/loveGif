import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cards from "./components/Cards";
import CartaForm from "./components/CartaForm";
import Menu from "./components/Menu";


export default function App() {
  return (
    <Router>
      <Menu />
      <main role="main" aria-label="Contenido principal">
        <Routes>
          <Route path="/" element={<Cards />} />
          <Route path="/nueva" element={<CartaForm />} />
        </Routes>
      </main>
      <footer 
        style={{
          marginTop: "60px",
          padding: "30px 20px",
          textAlign: "center",
          backgroundColor: "rgba(212, 175, 55, 0.05)",
          borderTop: "2px solid var(--primary-gold)",
          color: "var(--text-secondary)",
          fontSize: "0.9rem"
        }}
        role="contentinfo"
      >
        <p>Hecho con ❤️ por Piña | {new Date().getFullYear()}</p>
      </footer>
    </Router>
  );
}
