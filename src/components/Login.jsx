import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    try {
      login(username, password);
    } catch (err) {
      setError(err.message);
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
            />
          </div>

          {error && <div className="error-message" role="alert" aria-live="assertive">{error}</div>}

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        <div className="login-footer">
          <p>Usuarios de demostración disponibles</p>
          <small>Solicita acceso para más información</small>
        </div>
      </div>
    </main>
  );
}
