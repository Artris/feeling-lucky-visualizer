import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import PriceByTravelDurationScatterPlot from './PriceByTravelDurationScatterPlot';
import ShortestDistanceMap from './ShortestDistanceMap';
import ImageGrid from './ImageGrid';

const spacing = 16;
const style = {
  root: {
    flexGrow: 1,
    marginTop: 30
  },
  paper: {
    padding: 10,
    margin: 10,
    textAlign: 'center'
  }
};
const styles = theme => style;

/**
 * Checkout the answer by speckledcarp on how to handle window resizing in React
 * https://stackoverflow.com/a/42141641
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getComponentWidth = this.getComponentWidth.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  getComponentWidth() {
    let width;
    if (this.state.width < 960) {
      const whiteSpaceWidth = (style.paper.margin + style.paper.padding) * 2;
      width = this.state.width - whiteSpaceWidth;
    } else {
      const whiteSpaceWidth =
        spacing + (style.paper.margin + style.paper.padding) * 4;
      width = (this.state.width - whiteSpaceWidth) / 2;
    }
    return width < 0 ? 0 : width;
  }

  render() {
    const { classes } = this.props;
    const width = this.getComponentWidth();

    return (
      <div className={classes.root}>
        <Grid container spacing={spacing}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={spacing}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <PriceByTravelDurationScatterPlot width={width} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <ShortestDistanceMap width={width} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>
              <ImageGrid width={width} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
