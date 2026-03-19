import './EnvelopeLoader.css';

export default function EnvelopeLoader({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="envelope-loader-overlay" role="status" aria-live="polite" aria-label="Cargando cartas">
      <div className="envelope-loader-container">
        {/* Contenedor del sobre */}
        <div className="envelope-wrapper" aria-hidden="true">
          {/* Corazones cayendo */}
          <div className="hearts-container">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="heart" style={{
                '--delay': `${i * 0.2}s`,
                '--duration': '3s'
              }}>
                ❤️
              </div>
            ))}
          </div>

          {/* Estructura del sobre */}
          <div className="envelope">
            {/* Solapa superior */}
            <div className="envelope-flap">
              <div className="flap-triangle flap-left" />
              <div className="flap-triangle flap-right" />
              <div className="flap-top" />
            </div>

            {/* Cuerpo del sobre */}
            <div className="envelope-body">
              <div className="envelope-front">
                <div className="stamp" />
                <div className="address-lines">
                  <div className="address-line" />
                  <div className="address-line short" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Texto de carga */}
        <p className="loading-text">Preparando tus cartas...</p>
      </div>
    </div>
  );
}
