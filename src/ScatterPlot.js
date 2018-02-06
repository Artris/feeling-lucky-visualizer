import React, { Component } from 'react';
import * as d3 from 'd3';

const margin = { top: 10, bottom: 60, left: 80, right: 10 };

class ScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.draw = this.draw.bind(this);
    this.updateScale = this.updateScale.bind(this);
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

    this.xAxis = d3
      .select(this.root)
      .append('g')
      .attr('class', 'x axis');

    this.xAxisLabel = this.xAxis
      .append('text')
      .text('Travel Time')
      .style('fill', 'black')
      .style('font-size', '2em');

    this.yAxis = d3
      .select(this.root)
      .append('g')
      .attr('class', 'y axis');

    this.yAxisLabel = this.yAxis
      .append('text')
      .text('Price')
      .style('fill', 'black')
      .style('text-anchor', 'middle')
      .style('font-size', '2em');

    this.draw();
  }

  updateScale({ data, extent }) {
    this.width = extent.width - margin.left - margin.right;
    this.height = extent.height - margin.top - margin.bottom;

    this.x = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.x)])
      .range([0, this.width]);
    this.y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .range([this.height, 0]);

    this.axisBottom = d3
      .axisBottom(this.x)
      .ticks(2)
      .tickFormat(d => `${(d / 3600).toFixed(1)}h`);
    this.axisLeft = d3
      .axisLeft(this.y)
      .ticks(2)
      .tickFormat(d => `$${d / 1000}k`);
  }

  draw() {
    const { data } = this.props;
    /**
     * Items
     */
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

    /**
     * x axis
     */
    this.xAxis
      .attr(
        'transform',
        'translate(' + margin.left + ',' + (this.height + margin.top) + ')'
      )
      .call(this.axisBottom);
    this.xAxisLabel.attr('x', this.width / 2).attr('y', 2 * margin.bottom / 3);

    /**
     * y axis
     */
    this.yAxis
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(this.axisLeft);
    this.yAxisLabel.attr(
      'transform',
      'translate(' +
        -margin.left / 2 +
        ',' +
        this.height / 2 +
        ')' +
        'rotate(-90)'
    );
  }

  render() {
    const { width, height } = this.props.extent;
    return (
      <svg width={width} height={height} ref={root => (this.root = root)} />
    );
  }
}

export default ScatterPlot;
