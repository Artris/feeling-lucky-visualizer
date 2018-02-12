import { SET_DATA, SELECT_NODE, VISIT_NODE, REQUEST_DATA } from '../actions';

const rootReducer = (
  state = {
    nodes: [],
    activeNode: null,
    visitedNodes: [],
    destination: null,
    isFecthing: false,
    fetched: false,
    error: false
  },
  action
) => {
  switch (action.type) {
    case SET_DATA:
      const { nodes, destination } = action.data;
      return Object.assign({}, state, {
        nodes: nodes,
        activeNode: nodes[0],
        destination: destination,
        visitedNodes: [],
        isFecthing: false,
        fetched: true,
        error: false
      });
    case REQUEST_DATA:
      return Object.assign({}, state, {
        isFecthing: true,
        fetched: false,
        error: false
      });
    case SELECT_NODE:
      return Object.assign({}, state, {
        activeNode: action.node
      });
    case VISIT_NODE:
      return Object.assign({}, state, {
        visitedNodes: [...state.visitedNodes, action.node]
      });
    default:
      return state;
  }
};

export default rootReducer;
