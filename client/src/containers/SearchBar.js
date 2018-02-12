import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { fetchData } from '../actions';
import TextField from 'material-ui/TextField';

const styles = {
  input: {
    color: 'white'
  }
};

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    // To read TextField value when users presses enter
    // https://github.com/mui-org/material-ui/issues/5393#issuecomment-304707345
    return (
      <TextField
        autoFocus
        fullWidth
        inputProps={{ className: classes.input }}
        placeholder="Search for your destination"
        inputRef={el => (this.el = el)}
        onKeyPress={ev => {
          if (ev.key === 'Enter') {
            const address = this.el.value;
            this.props.fetchData(address);
            ev.preventDefault();
          }
        }}
      />
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: address => dispatch(fetchData(address))
  };
};

export default connect(() => ({}), mapDispatchToProps)(
  withStyles(styles)(SearchBar)
);
