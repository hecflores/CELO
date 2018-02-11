import React from 'react';
import ReactDOM from 'react-dom';



console.debugOn();
console.org();
/***************************************************************************/
/* Pages                                                                   */
/***************************************************************************/
import App from './components/Template/App.jsx';
let div = document.createElement('div');
document.body.appendChild(div);
/***************************************************************************/
/* Routes                                                                  */
/***************************************************************************/
ReactDOM.render((
    <App/>
), div);