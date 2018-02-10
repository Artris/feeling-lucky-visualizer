import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { setData, setDestination, selectNode } from './actions';
import config from './config';
import './index.css';
import App from './containers/App';
import visualizer from './reducers';
import data from './data.json';

let store = createStore(visualizer);
store.dispatch(setData(data));
store.dispatch(setDestination(config.destination));
store.dispatch(selectNode(data[0]));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
