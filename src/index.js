import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Menu from './components/Menu';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cards from './components/Cards'

const root2 = ReactDOM.createRoot(document.getElementById('menu'));
root2.render(<React.StrictMode>
  <Menu/>
</React.StrictMode>);
const root3 = ReactDOM.createRoot(document.getElementById('cards'));
root3.render(<React.StrictMode>
    <Cards/>
  </React.StrictMode>);
/*const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);*/


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
