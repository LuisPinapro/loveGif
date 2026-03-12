import '../styles/EnvelopeAnimation.css';

/**
 * Animación realista y simple de sobre abriéndose
 * Estructura: Cuerpo rectangular + Solapa triangular que se levanta
 */
export default function EnvelopeAnimation({ onAnimationEnd }) {
  return (
    <div className="envelope-animation-wrapper">
      <div className="envelope-container" onAnimationEnd={onAnimationEnd}>
        {/* Cuerpo del sobre - rectángulo base */}
        <div className="envelope-body">
          <div className="body-face">
            <div className="envelope-lines"></div>
          </div>
        </div>

        {/* Solapa superior - triángulo que se abre */}
        <div className="top-flap">
          <div className="flap-content">
            <div className="flap-shine"></div>
          </div>
        </div>

        {/* Carta dentro emergiendo */}
        <div className="letter-inside">
          <div className="letter-paper">
            <span className="heart-icon">💌</span>
          </div>
        </div>
      </div>
    </div>
  );
}
