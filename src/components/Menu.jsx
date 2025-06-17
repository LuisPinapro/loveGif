import '../styles/Menu.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/logo.png'

export default function Menu () {

    return(
        <Navbar variant="dark" className='nav-title carta-navbar'>
            <Container className="justify-content-center">
                <Navbar.Brand href="#home">
                    <img
                    alt="logo"
                    src={logo}
                    width="40"
                    height="40"
                    className="d-inline-block align-middle"
                    />{''}
                    
                </Navbar.Brand>
                <Navbar.Brand><span className='title'>Cartitas del Piña</span></Navbar.Brand>           
            </Container>
      </Navbar>
      
    )
}
