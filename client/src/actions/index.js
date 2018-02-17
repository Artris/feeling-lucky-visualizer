export const SET_DATA = 'SET_DATA';
export const REQUEST_FAILED = 'REQUEST_FAILED';
export const SELECT_NODE = 'SELECT_NODE';
export const VISIT_NODE = 'VISIT_NODE';
export const REQUEST_DATA = 'REQUEST_DATA';

export const setData = ({ nodes, destination }) => ({
  type: SET_DATA,
  data: { nodes, destination }
});

export const selectNode = node => ({
  type: SELECT_NODE,
  node
});

export const visitNode = id => ({
  type: VISIT_NODE,
  node: id
});

export const setErrorFlag = () => ({
  type: REQUEST_FAILED
});

const requestData = () => ({ type: REQUEST_DATA });

export const fetchData = address => {
  return dispatch => {
    dispatch(requestData());
    return fetch(`/api/items?destination=${address}`)
      .then(response => response.json())
      .then(({ nodes, destination, error }) => {
        if (error) {
          dispatch(setErrorFlag());
        } else {
          dispatch(setData({ nodes, destination }));
        }
      })
      .catch(err => dispatch(setErrorFlag()));
  };
};
