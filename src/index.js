import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import data from './data.json';

ReactDOM.render(<App data={data} />, document.getElementById('root'));
registerServiceWorker();
