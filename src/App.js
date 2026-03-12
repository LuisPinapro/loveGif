import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Cards from "./components/Cards";
import CartaForm from "./components/CartaForm";
import Menu from "./components/Menu";

function AppContent() {
  const { user } = useAuth();

  // Si no hay usuario autenticado, mostrar login
  if (!user) {
    return <Login />;
  }

  // Si hay usuario autenticado, mostrar la aplicación
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
