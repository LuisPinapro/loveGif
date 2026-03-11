import '../styles/Menu.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'

export default function Menu() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Navbar 
      variant="dark" 
      className='nav-title carta-navbar'
      aria-label="Navegación principal"
      sticky="top"
    >
      <Container className="justify-content-center">
        <Navbar.Brand 
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
          aria-label="Ir a inicio"
          title="Haz clic para volver al inicio"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
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
      </Container>
    </Navbar>
  );
}
