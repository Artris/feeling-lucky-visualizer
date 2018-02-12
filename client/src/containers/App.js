import React from 'react';
import { connect } from 'react-redux';

import './App.css';
import Dashboard from '../components/Dashboard';
import SimpleAppBar from '../components/AppBar';
import { CircularProgress } from 'material-ui/Progress';
import blue from 'material-ui/colors/blue';

const App = props => {
  const { error, isFecthing, fetched, nodata } = props;

  const wrapInNotice = elm => <div className="notice">{elm}</div>;

  let elm = null;
  if (isFecthing === true) {
    elm = wrapInNotice(
      <CircularProgress style={{ color: blue[500] }} size={100} />
    );
  } else if (error === true) {
    elm = wrapInNotice(<p className="noteice-text">Something is worng</p>);
  } else if (fetched === false) {
    elm = wrapInNotice(<p className="notice-text">Select your destination</p>);
  } else if (nodata === true) {
    elm = wrapInNotice(
      <p className="notice-text">No avalibale houses for this destination</p>
    );
  } else {
    elm = <Dashboard />;
  }

  return (
    <div>
      <SimpleAppBar />
      {elm}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { error, isFecthing, fetched, nodes } = state;
  return { error, isFecthing, fetched, nodata: nodes.length === 0 };
};

export default connect(mapStateToProps, () => ({}))(App);
