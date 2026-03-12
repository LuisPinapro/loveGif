import { useState, useEffect } from 'react';

/**
 * Componente de imagen con reintentos automáticos
 * Maneja casos donde imágenes fallan en cargar agregando cache busters
 */
export default function ImageWithRetry({ 
  src, 
  alt, 
  className, 
  maxRetries = 4,
  retryDelay = 800,
  onError,
  onLoad,
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount < maxRetries) {
      // Exponential backoff: 800ms, 1600ms, 3200ms, 6400ms
      const delay = retryDelay * Math.pow(2, retryCount);
      
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        // Agregar cache buster con timestamp para forzar recarga
        const separator = src.includes('?') ? '&' : '?';
        setImgSrc(`${src}${separator}t=${Date.now()}`);
      }, delay);
    } else {
      setHasError(true);
      setIsLoading(false);
      console.error(`Imagen no se pudo cargar después de ${maxRetries} intentos:`, src);
      if (onError) onError(new Error('Image failed to load after retries'));
    }
  };

  const handleLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  if (hasError) {
    return (
      <div
        style={{
          width: '100%',
          height: '300px',
          background: 'linear-gradient(135deg, rgba(212, 103, 143, 0.1), rgba(212, 175, 55, 0.1))',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '0.95rem',
          textAlign: 'center',
          padding: '20px',
          border: '2px dashed rgba(212, 103, 143, 0.3)',
        }}
      >
        📸 No se pudo cargar la imagen. Intenta recargar la página.
      </div>
    );
  }

  return (
    <>
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        crossOrigin="anonymous"
        {...props}
        style={{
          ...(props.style || {}),
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
      {isLoading && retryCount > 0 && (
        <div
          style={{
            fontSize: '0.8rem',
            color: '#999',
            textAlign: 'center',
            marginTop: '8px',
          }}
        >
          Cargando imagen... ({retryCount}/{maxRetries})
        </div>
      )}
    </>
  );
}
