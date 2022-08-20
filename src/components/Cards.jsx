import '../styles/Cards.css';
import Container from 'react-bootstrap/Container';
import Cartas from '../cards/cards'
import Dropdown from 'react-bootstrap/Dropdown';
import { useState } from 'react';

export default function Cards() {
    const [card, setCard]= useState(1);
    function showCard(){
        const e = Cartas.find(element=>{
            return element.id === card;
        })
        return(
            <div key={e.id} className='lether'>
                <h1 className='title'>{e.title}</h1>
                <p className='line'></p>
                <p className='content'>{e.content}</p>
                <div className='d-flex justify-content-center'>                
                    <img className='img-card' src={e.img} alt = 'decorative' width= "100%"/>
                </div>
            </div>) 
    }
    return(
        <Container bg="dark">
            <Dropdown>
                <Dropdown.Toggle id="dropdown1">Ver Cartitas
                </Dropdown.Toggle>
                <Dropdown.Menu id='dropdown2'>
                    {
                        Cartas.map(item => (
                            <Dropdown.Item onClick={() => setCard(item.id)} key={item.id}>{item.title}
                            </Dropdown.Item>
                        ))
                    }
                </Dropdown.Menu>
            
            </Dropdown>
            <div>
                {showCard()}
            </div>
        </Container>
    )
}
