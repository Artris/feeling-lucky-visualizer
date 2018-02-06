import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import ImageGridList from './ImageGridList';
import ScatterPlot from './ScatterPlot';
import config from './config';
import Map from './Map';

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
    this.state = {
      width: 0,
      height: 0,
      selected: this.props.data[0],
      visited: []
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getComponentWidth = this.getComponentWidth.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.visitNode = this.visitNode.bind(this);
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

  selectNode(index) {
    this.setState({ selected: this.props.data[index] });
  }

  visitNode(index) {
    const node = this.props.data[index];
    const visitedNodesSoFar = this.state.visited;

    this.setState({
      visited: [...new Set([...visitedNodesSoFar, node.link])]
    });
    window.open(node.link);
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
    const { classes, data } = this.props;
    const width = this.getComponentWidth();
    const visitedNodesSoFar = this.state.visited;

    const destination = config.destination;
    const { images, latitude, longitude } = this.state.selected;
    const origin = { latitude, longitude };

    const scatterPlotData = data.map((item, index) => {
      return {
        x: item.duration,
        y: item.price,
        link: item.link,
        visited: visitedNodesSoFar.includes(item.link),
        onHover: () => {
          this.selectNode(index);
        },
        onClick: () => {
          this.visitNode(index);
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
                  <Map
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

export default withStyles(styles)(App);
