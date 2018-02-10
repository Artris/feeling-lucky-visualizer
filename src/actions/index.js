export const setData = data => {
  return {
    type: 'SET_DATA',
    data
  };
};

export const selectNode = node => {
  return {
    type: 'SELECT_NODE',
    node
  };
};

export const visitNode = node => {
  return {
    type: 'VISIT_NODE',
    node
  };
};

export const setDestination = destination => {
  return {
    type: 'SET_DESTINATION',
    destination
  };
};
