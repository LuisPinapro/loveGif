import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CartaForm.css"; // Asegúrate de tener este archivo CSS

export default function CartaForm({ onCartaAgregada }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubiendo(true);
    setError("");

    try {
      let imageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await fetch("https://lovegifbackend.onrender.com/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!data.url) throw new Error("Error al subir imagen");
        imageUrl = data.url;
      }

      const resCarta = await fetch("https://lovegifbackend.onrender.com/cartas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, img: imageUrl }),
      });

      if (!resCarta.ok) throw new Error("Error al guardar la carta");

      setTitle("");
      setContent("");
      setImageFile(null);
      if (onCartaAgregada) onCartaAgregada();
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Hubo un problema al subir la carta.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="form-page">
      <form className="form-carta" onSubmit={handleSubmit}>
        <h2>💌 Escribir nueva carta</h2>

        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Contenido de la carta"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button type="submit" disabled={subiendo}>
          {subiendo ? "Enviando..." : "Guardar carta"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
