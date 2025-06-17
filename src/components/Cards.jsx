import "../styles/Cards.css";
import Container from "react-bootstrap/Container";
import Cartas from "../cards/cards";
import Dropdown from "react-bootstrap/Dropdown";
import { useState, useRef, useEffect } from "react";

export default function Cards() {
  const [selectedId, setSelectedId] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [showLetter, setShowLetter] = useState(false);
  const [displayedWords, setDisplayedWords] = useState([]);
  const [displayedWordsTitle, setDisplayedWordsTitle] = useState([]);
  const envelopeRef = useRef(null);
  const [imagenVisible, setImagenVisible] = useState(false);

  const carta = Cartas.find((c) => c.id === selectedId);
  const [showLetterBody, setShowLetterBody] = useState(false);
  //Efecto para manejar la animación del sobre
  useEffect(() => {
    if (!selectedId) return;

    const envelope = envelopeRef.current;
    if (!envelope) return;

    const handleAnimationEnd = () => {
      setShowLetter(true);
    };

    envelope.addEventListener("animationend", handleAnimationEnd);
    return () => {
      envelope.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [animationKey, selectedId]);
  //Efecto para mostrar el titulo de la carta
  useEffect(() => {
    if (!showLetter || !carta) return;

    const texto = carta.title;
    let i = 0;
    setDisplayedWordsTitle([]);

    const interval = setInterval(() => {
      i++;
      setDisplayedWordsTitle(texto.slice(0, i));
      if (i === texto.length) {
        clearInterval(interval);
        setShowLetterBody(true); // Muestra el cuerpo de la carta después de mostrar el título
      }
    }, 100); // velocidad por letra

    return () => clearInterval(interval);
  }, [showLetter, carta]);

  // Efecto para mostrar la carta letra por letra

  useEffect(() => {
    if (!showLetter || !carta || !showLetterBody) return;

    const texto = carta.content;
    let i = 0;
    setDisplayedWords([]);
    setImagenVisible(false);

    const interval = setInterval(() => {
      i++;
      setDisplayedWords(texto.slice(0, i));
      if (i === texto.length) {
        clearInterval(interval);
        setTimeout(() => setImagenVisible(true), 300); // Espera 300ms antes de mostrar la imagen
      }
    }, 35); // velocidad por letra

    return () => clearInterval(interval);
  }, [showLetter, carta, showLetterBody]);

  function handleCardSelect(id) {
    setShowLetter(false);
    setShowLetterBody(false);
    setImagenVisible(false);
    setDisplayedWords([]);
    setSelectedId(id);
    setAnimationKey((prev) => prev + 1);
  }

  return (
    <Container>
      <div className="dropdown-wrapper">
        <Dropdown>
          <Dropdown.Toggle
            id="dropdown1"
            disabled={!showLetter && selectedId !== null}
          >
            Ver Cartitas
          </Dropdown.Toggle>
          <Dropdown.Menu id="dropdown2">
            {Cartas.map((item) => (
              <Dropdown.Item
                onClick={() => handleCardSelect(item.id)}
                key={item.id}
                disabled={!showLetter && selectedId !== null}
              >
                {item.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {selectedId && !showLetter && (
        <div
          className="envelope animacion-sobre"
          key={`sobre-${animationKey}`}
          ref={envelopeRef}
        >
          <div className="flap"></div>
          <div className="body"></div>
        </div>
      )}

      {selectedId && showLetter && (
        <div className="lether carta-animada" key={`carta-${animationKey}`}>
          <h1 className="title">{displayedWordsTitle}</h1>
          <p className="line"></p>
          <p className="content">
            {displayedWords}
            <span className="cursor">|</span>
          </p>
          {imagenVisible && (
            <div className="d-flex justify-content-center fade-in-img">
              <img
                className="img-card"
                src={carta.img}
                alt="decorative"
                width="100%"
              />
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
