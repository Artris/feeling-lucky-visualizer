import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectNode, visitNode } from '../actions';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import ImageGridList from '../components/ImageGridList';
import ScatterPlot from '../components/ScatterPlot';
import GoogleMap from '../components/GoogleMap';

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
    console.log(this.props);
    const { classes, data } = this.props;
    const { activeNode, visitedNodes } = this.props;
    const width = this.getComponentWidth();

    const destination = this.props.destination;
    const { images, latitude, longitude } = data[activeNode];
    const origin = { latitude, longitude };

    const scatterPlotData = data.map((item, index) => {
      return {
        x: item.duration,
        y: item.price,
        link: item.link,
        visited: visitedNodes.includes(item.link),
        onHover: () => {
          this.props.onHover(index);
        },
        onClick: () => {
          this.props.onClick(item.link);
          window.open(item.link);
        }
      };
    });
    const scatterPlotHeight = width / 2;

    return (
      <div className={classes.root}>
        <Grid container spacing={spacing}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={spacing}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <ScatterPlot
                    extent={{ width, height: scatterPlotHeight }}
                    data={scatterPlotData}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <GoogleMap
                    origin={origin}
                    destination={destination}
                    width={width}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>
              <ImageGridList images={images} width={width} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({ ...state });

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: id => dispatch(visitNode(id)),
    onHover: index => dispatch(selectNode(index))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(App)
);
