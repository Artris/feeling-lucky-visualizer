import React, { Component } from 'react';
import * as d3 from 'd3';

const margin = { top: 10, bottom: 40, left: 40, right: 10 };

class ScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.draw = this.draw.bind(this);
    this.setScale = this.updateScale.bind(this);
  }

  componentWillMount() {
    this.updateScale(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateScale(props);
    this.draw();
  }

  componentDidMount() {
    this.g = d3
      .select(this.root)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    this.draw();
  }

  updateScale({ data, extent }) {
    const width = extent.width - margin.left - margin.right;
    const height = extent.height - margin.top - margin.bottom;

    this.x = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.x)])
      .range([0, width]);
    this.y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .range([height, 0]);
  }

  draw() {
    const { data } = this.props;
    const items = this.g.selectAll('circle').data(data);

    items
      .enter()
      .append('circle')
      .attr('r', 10)
      .attr('id', (d, i) => `node-${i}`)
      .merge(items)
      .attr('cx', d => this.x(d.x))
      .attr('cy', d => this.y(d.y))
      .on('mouseover', d => d.onHover())
      .on('click', (d, i) => d.onClick())
      .style('fill', 'rgba(255, 128, 0, 0.5)');

    items.exit().remove();
  }

  render() {
    const { width, height } = this.props.extent;
    return (
      <svg width={width} height={height} ref={root => (this.root = root)} />
    );
  }
}

export default ScatterPlot;
