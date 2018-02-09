import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectNode, visitNode } from '../actions';
import ScatterPlot from '../components/ScatterPlot';

class PriceByTravelDurationScatterPlot extends Component {
  render() {
    const { data, onHover, onClick, width, visitedNodes } = this.props;

    const scatterPlotData = data.map((item, index) => {
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

    const height = width / 2;

    return <ScatterPlot extent={{ width, height }} data={scatterPlotData} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { data, visitedNodes } = state;
  return { data, visitedNodes };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: id => dispatch(visitNode(id)),
    onHover: index => dispatch(selectNode(index))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  PriceByTravelDurationScatterPlot
);
