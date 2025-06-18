import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cards from "./components/Cards";
import CartaForm from "./components/CartaForm";
import Menu from "./components/Menu";


export default function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Cards />} />
        <Route path="/nueva" element={<CartaForm />} />
      </Routes>
    </Router>
  );
}
