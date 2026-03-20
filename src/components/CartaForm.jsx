import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/CartaForm.css";

export default function CartaForm({ onCartaAgregada }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError("El título es requerido");
      return;
    }
    if (!content.trim()) {
      setError("El contenido de la carta es requerido");
      return;
    }
    if (!user?.usuarioId) {
      setError("Error: Usuario no autenticado");
      return;
    }

    setSubiendo(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = "";
      
      // Upload image if provided
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

      // Save carta with usuarioId
      const resCarta = await fetch("https://lovegifbackend.onrender.com/cartas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          usuarioId: user.usuarioId,
          title, 
          content, 
          img: imageUrl 
        }),
      });

      if (!resCarta.ok) throw new Error("Error al guardar la carta");

      setSuccess("¡Carta guardada exitosamente! Redirigiendo...");
      setTitle("");
      setContent("");
      setImageFile(null);
      
      if (onCartaAgregada) onCartaAgregada();
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Hubo un problema al guardar la carta. Intenta de nuevo.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="form-page">
      <form className="form-carta" onSubmit={handleSubmit} noValidate>
        <h2>💌 Escribir nueva carta</h2>
        
        {/* Error Message */}
        {error && (
          <div
            className="error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div
            className="success"
            role="status"
            aria-live="polite"
          >
            {success}
          </div>
        )}

        {/* Title Input */}
        <div>
          <label htmlFor="titulo" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Título *
          </label>
          <input
            id="titulo"
            type="text"
            placeholder="Ej: Mi amor infinito"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={subiendo}
            aria-required="true"
            aria-label="Título de la carta"
            required
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label htmlFor="contenido" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Contenido *
          </label>
          <textarea
            id="contenido"
            placeholder="Escribe tu mensaje aquí. Puedes usar saltos de línea..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            disabled={subiendo}
            aria-required="true"
            aria-label="Contenido de la carta"
            required
          />
          <small style={{ color: "var(--text-secondary)", display: "block", marginTop: "4px" }}>
            {content.length} caracteres
          </small>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="imagen" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Imagen (Opcional)
          </label>
          <input
            id="imagen"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                  setError("La imagen no debe superar 5MB");
                  setImageFile(null);
                } else {
                  setImageFile(file);
                  setError("");
                }
              }
            }}
            disabled={subiendo}
            aria-label="Seleccionar imagen para la carta"
          />
          {imageFile && (
            <small style={{ color: "var(--text-secondary)", display: "block", marginTop: "8px" }}>
              Imagen seleccionada: {imageFile.name}
            </small>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={subiendo}
          aria-label={subiendo ? "Guardando carta..." : "Guardar carta"}
        >
          {subiendo ? "Enviando..." : "Guardar carta"}
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          disabled={subiendo}
          style={{
            marginTop: "var(--spacing-md)",
            background: "var(--text-secondary)",
            color: "white",
          }}
          aria-label="Volver a la página principal"
        >
          ← Volver
        </button>
      </form>
    </div>
  );
}
