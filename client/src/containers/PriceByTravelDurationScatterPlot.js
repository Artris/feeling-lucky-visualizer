import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectNode, visitNode } from '../actions';
import ScatterPlot from '../components/ScatterPlot';

class PriceByTravelDurationScatterPlot extends Component {
  render() {
    const {
      nodes,
      onHover,
      onClick,
      width,
      visitedNodes,
      maxHeight
    } = this.props;

    const scatterPlotData = nodes.map((item, index) => {
      return {
        x: item.duration,
        y: item.price,
        link: item.link,
        visited: visitedNodes.includes(item.link),
        onHover: () => onHover(item),
        onClick: () => {
          onClick(item.link);
          window.open(item.link);
        }
      };
    });

    const height = maxHeight;

    return <ScatterPlot extent={{ width, height }} data={scatterPlotData} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { nodes, visitedNodes } = state;
  return { nodes, visitedNodes };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: id => dispatch(visitNode(id)),
    onHover: node => dispatch(selectNode(node))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  PriceByTravelDurationScatterPlot
);
