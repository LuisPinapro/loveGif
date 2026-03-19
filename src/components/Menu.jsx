import '../styles/Menu.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../images/logo.png'

export default function Menu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar 
      variant="dark" 
      className='nav-title carta-navbar'
      aria-label="Navegación principal"
      sticky="top"
    >
      <Container className="navbar-content">
        <div className="navbar-left">
          <Navbar.Brand 
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
            aria-label="Ir a inicio"
            title="Haz clic para volver al inicio"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick();
              }
            }}
          >
            <img
              alt="Logo de Cartitas del Piña"
              src={logo}
              width="40"
              height="40"
              className="d-inline-block align-middle"
            />
          </Navbar.Brand>
          <Navbar.Brand>
            <span className='title' role="heading" aria-level="1">
              Cartitas del Piña
            </span>
          </Navbar.Brand>
        </div>

        {user && (
          <div className="navbar-right">
            <span className="user-greeting">Hola, {user.displayName}</span>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              Salir
            </button>
          </div>
        )}
      </Container>
    </Navbar>
  );
}
