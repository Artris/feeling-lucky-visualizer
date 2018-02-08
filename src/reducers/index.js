import { combineReducers } from 'redux';

const data = (state = [], action) => {
  switch (action.type) {
    case 'SET_DATA':
      return action.data;
    default:
      return state;
  }
};

const activeNode = (state = 0, action) => {
  switch (action.type) {
    case 'SELECT_NODE':
      return action.node;
    default:
      return state;
  }
};

const visitedNodes = (state = [], action) => {
  switch (action.type) {
    case 'VISIT_NODE':
      return [...state, action.node];
    default:
      return state;
  }
};

const destination = (state = 0, action) => {
  switch (action.type) {
    case 'SET_DESTINATION':
      return action.destination;
    default:
      return state;
  }
};

const visualizer = combineReducers({
  data,
  activeNode,
  visitedNodes,
  destination
});

export default visualizer;
