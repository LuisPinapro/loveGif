import "../styles/Cards.css";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Carousel from "react-bootstrap/Carousel";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeMessage from "./WelcomeMessage";
import EnvelopeLoader from "./EnvelopeLoader";
import EnvelopeAnimation from "./EnvelopeAnimation";
import ImageWithRetry from "./ImageWithRetry";
import { fetchWithRetry, fixGitHubUrl } from "../utils/fetchUtils";

const backendUrl = "https://lovegifbackend.onrender.com";

export default function Cards() {
  const [selectedId, setSelectedId] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [showLetter, setShowLetter] = useState(false);
  const [displayedWords, setDisplayedWords] = useState([]);
  const [displayedWordsTitle, setDisplayedWordsTitle] = useState([]);
  const [imagenVisible, setImagenVisible] = useState(false);
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLetterBody, setShowLetterBody] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const navigate = useNavigate();

  const carta = cartas.find((c) => c.id === selectedId);
  const imageUrl = carta?.img?.startsWith("http")
    ? fixGitHubUrl(carta.img)
    : `${backendUrl}${carta?.img || ""}`;

  // Fetch cartas from backend with retry logic
  useEffect(() => {
    const fetchCartas = async () => {
      try {
        setLoading(true);
        const response = await fetchWithRetry(
          "https://lovegifbackend.onrender.com/cartas",
          {
            retries: 4,
            backoffMs: 800,
            timeout: 8000,
          }
        );
        const data = await response.json();
        setCartas(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching cartas:", err);
        setError("No se pudieron cargar las cartas. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchCartas();
  }, []);

  // Envelope animation handler - triggers when animation ends
  const handleEnvelopeAnimationEnd = () => {
    setShowLetter(true);
  };

  // Display title with typing effect
  useEffect(() => {
    if (!showLetter || !carta) return;

    const texto = carta.title;
    let i = 0;
    setDisplayedWordsTitle([]);

    if (skipAnimation) {
      setDisplayedWordsTitle(texto);
      setShowLetterBody(true);
      return;
    }

    const interval = setInterval(() => {
      i++;
      setDisplayedWordsTitle(texto.slice(0, i));
      if (i === texto.length) {
        clearInterval(interval);
        setShowLetterBody(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [showLetter, carta, skipAnimation]);

  // Display content with typing effect
  useEffect(() => {
    if (!showLetter || !carta || !showLetterBody) return;

    const texto = carta.content;
    let i = 0;
    setDisplayedWords([]);
    setImagenVisible(false);
    setShowCarousel(false);

    if (skipAnimation) {
      setDisplayedWords(texto);
      setTimeout(() => {
        setImagenVisible(true);
        if (carta?.special && carta?.images) {
          setShowCarousel(true);
        }
      }, 100);
      return;
    }

    const interval = setInterval(() => {
      i++;
      setDisplayedWords(texto.slice(0, i));
      if (i === texto.length) {
        clearInterval(interval);
        setTimeout(() => {
          setImagenVisible(true);
          if (carta?.special && carta?.images) {
            setShowCarousel(true);
          }
        }, 300);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [showLetter, carta, showLetterBody, skipAnimation]);

  function handleCardSelect(id) {
    setShowLetter(false);
    setShowLetterBody(false);
    setImagenVisible(false);
    setDisplayedWords([]);
    setDisplayedWordsTitle([]);
    setImageError(false);
    setShowCarousel(false);
    setSkipAnimation(false);
    setSelectedId(id);
    setAnimationKey((prev) => prev + 1);
  }

  return (
    <Container>
      {/* Envelope Loader - Animación de corazones en sobre */}
      <EnvelopeLoader isLoading={loading} />

      {/* Welcome Message - Mensaje personalizado por usuario */}
      {!loading && !selectedId && <WelcomeMessage />}

      {/* Error State */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="py-5 text-center"
          style={{
            color: "#c62828",
            backgroundColor: "rgba(198, 40, 40, 0.1)",
            padding: "var(--spacing-md)",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--spacing-lg)",
            marginTop: "var(--spacing-lg)",
          }}
        >
          <p>{error}</p>
        </div>
      )}

      {/* Controls Section */}
      {!loading && (
        <div className="dropdown-wrapper">
          <div className="boton-wrapper">
            <button
              className="boton-escribir"
              onClick={() => navigate("/nueva")}
              aria-label="Escribir nueva carta"
              title="Escribe una nueva carta para compartir"
            >
              ✍️ Escribir nueva carta
            </button>
          </div>

          <Dropdown>
            <Dropdown.Toggle
              id="dropdown1"
              disabled={!showLetter && selectedId !== null}
              aria-label={
                cartas.length === 0
                  ? "Sin cartas disponibles"
                  : `Ver cartitas. ${cartas.length} cartas disponibles`
              }
              title="Selecciona una carta para leer"
            >
              Ver Cartitas
            </Dropdown.Toggle>
            <Dropdown.Menu id="dropdown2" aria-label="Lista de cartas disponibles">
              {cartas.length === 0 ? (
                <Dropdown.Item disabled className="text-secondary">
                  No hay cartas aún. ¡Escribe una!
                </Dropdown.Item>
              ) : (
                cartas.map((item) => (
                  <Dropdown.Item
                    onClick={() => {
                      setSkipAnimation(false);
                      handleCardSelect(item.id);
                    }}
                    key={item.id}
                    disabled={!showLetter && selectedId !== null}
                    aria-label={`Leer carta: ${item.title}`}
                  >
                    {item.title}
                  </Dropdown.Item>
                ))
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      {/* Envelope Animation - Compact and Elegant */}
      {selectedId && !showLetter && (
        <EnvelopeAnimation onAnimationEnd={handleEnvelopeAnimationEnd} />
      )}

      {/* Letter Content */}
      {selectedId && showLetter && (
        <article
          className="lether carta-animada"
          key={`carta-${animationKey}`}
          aria-label={`Contenido de la carta: ${displayedWordsTitle}`}
        >

          <h1 className="title" aria-label={`Título: ${displayedWordsTitle}`}>
            {displayedWordsTitle}
          </h1>
          <p className="line" aria-hidden="true"></p>
          <p className="content" aria-live="polite" aria-atomic="false">
            {displayedWords}
            {!skipAnimation && displayedWords.length > 0 && displayedWords.length < carta?.content?.length && (
              <span className="cursor" aria-hidden="true">
                |
              </span>
            )}
          </p>

          {/* Image with fade-in animation */}
          {/* Carta normal - Una imagen */}
          {!carta?.special && imagenVisible && carta?.img && (
            <div className="d-flex justify-content-center fade-in-img">
              <ImageWithRetry
                className="img-card"
                src={imageUrl}
                alt={`Imagen de la carta: ${displayedWordsTitle}`}
                maxRetries={4}
                retryDelay={800}
                onError={(err) => {
                  console.error("Error loading image after retries:", imageUrl, err);
                  setImageError(true);
                }}
              />
            </div>
          )}

          {/* Carrusel para cartas especiales - Múltiples imágenes */}
          {carta?.special && showCarousel && carta?.images && carta.images.length > 0 && (
            <div className="mt-4 fade-in-img">
              <Carousel fade interval={4000} className="carousel-special">
                {carta.images.map((imageUri, i) => {
                  const imgUrl = imageUri?.startsWith("http")
                    ? fixGitHubUrl(imageUri)
                    : `${backendUrl}${imageUri || ""}`;
                  return (
                    <Carousel.Item key={i}>
                      <ImageWithRetry
                        className="d-block w-100 carousel-img"
                        src={imgUrl}
                        alt={`Foto ${i + 1} de la carta`}
                        maxRetries={4}
                        retryDelay={800}
                        onError={(err) => {
                          console.error(`Error loading carousel image: ${imgUrl}`, err);
                        }}
                      />
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            </div>
          )}

          {/* Image Error Message */}
          {imagenVisible && carta?.img && imageError && !carta?.special && (
            <div
              style={{
                marginTop: "var(--spacing-lg)",
                padding: "var(--spacing-md)",
                backgroundColor: "rgba(212, 103, 143, 0.1)",
                borderLeft: "3px solid var(--primary-rose)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              📸 No se pudo cargar la imagen, pero la carta está completa.
            </div>
          )}

          {/* Close Card Button */}
          {/* Close Card Button with Skip Button */}
          <div
            style={{
              marginTop: "var(--spacing-lg)",
              display: "flex",
              justifyContent: "center",
              gap: "var(--spacing-md)",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Skip Animation Button */}
            {!skipAnimation && ((displayedWordsTitle.length > 0 && displayedWordsTitle.length < carta?.title?.length) || (displayedWords.length < carta?.content?.length)) && (
              <button
                className="skip-button-inline"
                onClick={() => setSkipAnimation(true)}
                aria-label="Saltar animación de escritura"
                title="Ver la carta completa inmediatamente"
              >
                ⏩ Omitir escritura
              </button>
            )}
            
            <button
              onClick={() => {
                setSelectedId(null);
                setSkipAnimation(false);
                setImageError(false);
              }}
              style={{
                background: "linear-gradient(135deg, var(--primary-rose), var(--primary-rose-dark))",
                color: "white",
                border: "none",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all var(--transition-base)",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, var(--primary-rose-dark), var(--secondary-burgundy))";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, var(--primary-rose), var(--primary-rose-dark))";
                e.target.style.transform = "translateY(0)";
              }}
              aria-label="Cerrar carta"
              title="Cierra esta carta para ver otra"
            >
              ← Atrás
            </button>
          </div>
        </article>
      )}
    </Container>
  );
}
