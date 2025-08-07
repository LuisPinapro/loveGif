import "../styles/Cards.css";
import Container from "react-bootstrap/Container";
import Dropdown  from "react-bootstrap/Dropdown";
import Carousel  from "react-bootstrap/Carousel";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = "https://lovegifbackend.onrender.com";

export default function Cards() {
  /* ─────────── estados base ─────────── */
  const [cartas, setCartas] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);

  const [showLetter, setShowLetter]           = useState(false);
  const [showLetterBody, setShowLetterBody]   = useState(false);
  const [displayedTitle, setDisplayedTitle]   = useState("");
  const [displayedContent, setDisplayedContent] = useState("");


  const [showCarousel, setShowCarousel] = useState(false);

  const envelopeRef = useRef(null);
  const navigate    = useNavigate();
  const carta       = cartas.find(c => c.id === selectedId);

  /* ───────── cargar cartas ───────── */
  useEffect(() => {
    fetch(`${backendUrl}/cartas`)
      .then(r => r.json())
      .then(setCartas)
      .catch(console.error);
  }, []);

  /* ───────── animación del sobre ───────── */
  useEffect(() => {
    if (!selectedId) return;

    const envelopeNode = envelopeRef.current;   // ← copia local
    if (!envelopeNode) return;

    const handleEnd = () => setShowLetter(true);
    envelopeNode.addEventListener("animationend", handleEnd);

    /* cleanup usa la misma referencia */
    return () => {
      envelopeNode.removeEventListener("animationend", handleEnd);
    };
  }, [animationKey, selectedId]);

  /* ─── título letra-por-letra ─── */
  useEffect(() => {
    if (!showLetter || !carta) return;
    let i = 0;
    setDisplayedTitle("");
    const id = setInterval(() => {
      i++;
      setDisplayedTitle(carta.title.slice(0, i));
      if (i === carta.title.length) {
        clearInterval(id);
        setShowLetterBody(true);
      }
    }, 100);
    return () => clearInterval(id);
  }, [showLetter, carta]);

  /* ─── cuerpo letra-por-letra + rotación lateral ─── */
  useEffect(() => {
    if (!showLetterBody || !carta) return;

    /* texto */
    let i = 0;
    setDisplayedContent("");
    setShowCarousel(false);

    const txtTimer = setInterval(() => {
      i++;
      setDisplayedContent(carta.content.slice(0, i));
      if (i === carta.content.length) {
        clearInterval(txtTimer);
        setTimeout(() => setShowCarousel(true), 500);
      }
    }, 35);


    return () => {
      clearInterval(txtTimer);
    };
  }, [showLetterBody, carta]);

  /* ─── cambiar carta ─── */
  const handleCardSelect = (id) => {
    setSelectedId(id);
    setShowLetter(false);
    setShowLetterBody(false);
    setDisplayedTitle("");
    setDisplayedContent("");
    setShowCarousel(false);
    setAnimationKey(k => k + 1);
  };

  /* util para obtener url absoluta */
  const urlAbs = (u) => u.startsWith("http") ? u : `${backendUrl}${u}`;

  /* ───────────── render ───────────── */
  return (
    <Container>

      {/* barra superior */}
      <div className="dropdown-wrapper">
        <div className="boton-wrapper">
          <button className="boton-escribir" onClick={() => navigate("/nueva")}>
            ✍️ Escribir nueva carta
          </button>
        </div>

        <Dropdown>
          <Dropdown.Toggle id="dropdown1" disabled={!showLetter && selectedId}>
            Ver Cartitas
          </Dropdown.Toggle>
          <Dropdown.Menu id="dropdown2">
            {cartas.map(c => (
              <Dropdown.Item key={c.id}
                             disabled={!showLetter && selectedId}
                             onClick={() => handleCardSelect(c.id)}>
                {c.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* sobre */}
      {selectedId && !showLetter && (
        <div ref={envelopeRef} className="envelope animacion-sobre" key={`sobre-${animationKey}`}>
          <div className="flap" /><div className="body" />
        </div>
      )}

      {/* carta */}
      {selectedId && showLetter && (
        <div className="lether carta-animada" key={`carta-${animationKey}`}>
          {/* audio */}
          {carta.special && carta.audio && (
            <audio src={urlAbs(carta.audio)} autoPlay />
          )}

          <h1 className="title">{displayedTitle}</h1>
          <p className="line" />
          <p className="content">
            {displayedContent}
            <span className="cursor">|</span>
          </p> 

          {/* carta normal con 1 imagen */}
          {!carta.special && (
            <div className="d-flex justify-content-center fade-in-img">
              {carta.img && <img className="img-card" src={urlAbs(carta.img)} alt="decorative" />}
            </div>
          )}

          {/* carrusel final */}
          {carta.special && showCarousel && (
            <Carousel fade interval={4000} className="mt-4">
              {carta.images.map((u,i) => (
                <Carousel.Item key={i}>
                  <img className="d-block w-100" src={urlAbs(u)} alt={`foto ${i}`} />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </div>
      )}
    </Container>
  );
}
