import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import PriceByTravelDurationScatterPlot from '../containers/PriceByTravelDurationScatterPlot';
import ShortestDistanceMap from '../containers/ShortestDistanceMap';
import ImageGrid from '../containers/ImageGrid';

const spacing = 16;
const style = {
  root: {
    flexGrow: 1
  },
  paper: {
    padding: 10,
    margin: 10,
    marginTop: 20,
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
    this.getComponentMaxHeight = this.getComponentMaxHeight.bind(this);
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

  getComponentMaxHeight() {
    let height = this.state.height - 200;
    return Math.max(height / 2, 280);
  }

  render() {
    const { classes } = this.props;
    const width = this.getComponentWidth();
    const maxHeight = this.getComponentMaxHeight();

    return (
      <div className={classes.root}>
        <Grid container spacing={spacing}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={spacing}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <PriceByTravelDurationScatterPlot
                    width={width}
                    maxHeight={maxHeight}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <ImageGrid width={width} maxHeight={maxHeight} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={spacing}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <ShortestDistanceMap width={width} maxHeight={maxHeight} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
