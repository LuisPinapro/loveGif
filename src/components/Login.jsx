import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(username, password);
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido';
      
      // Mejorar mensajes de error específicos
      if (errorMessage.includes('no disponible') || errorMessage.includes('database')) {
        setError('❌ El servidor está fuera de servicio. Por favor, intenta más tarde.');
      } else if (errorMessage.includes('incorrectos')) {
        setError('❌ Usuario o contraseña incorrectos');
      } else {
        setError(`❌ ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-container" aria-label="Inicio de sesión">
      <div className="login-box">
        <div className="login-header">
          <h1>LoveGif</h1>
          <p>Acceso a tus cartas</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" aria-label="Formulario de inicio de sesión">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message" role="alert" aria-live="assertive">{error}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>Usuarios de demostración disponibles</p>
          <small>Usuario: FLORY | Contraseña: 1234</small>
        </div>
      </div>
    </main>
  );
}
