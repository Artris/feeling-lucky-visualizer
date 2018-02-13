import React, { Component } from "react";
import * as d3 from "d3";

const margin = { top: 10, bottom: 50, left: 80, right: 10 };

class ScatterPlot extends Component {
  constructor(props) {
    super(props);
    /*this is nessecary because we pass the nodes into a force simulation which returns a new state with every tick*/
    this.state = { nodes: props.data };
  }

  componentWillMount() {
    this.updateScale(this.props);
  }

  componentWillReceiveProps(props) {
    this.setState({ nodes: props.data }, () => {
      this.createReplusionForce();
    });
  }

  componentDidUpdate() {
    this.updateScale(this.props);
    this.drawScatterPlot();
  }

  componentDidMount() {
    /*this creates a wrapper that starts at the top left corner of the scatter plot*/
    this.g = d3
      .select(this.root)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.xAxis = d3
      .select(this.root)
      .append("g")
      .attr("class", "x axis");

    this.xAxisLabel = this.xAxis
      .append("text")
      .text("Transit Time")
      .style("fill", "grey")
      .style("font-size", "1.5em");

    this.yAxis = d3
      .select(this.root)
      .append("g")
      .attr("class", "y axis");

    this.yAxisLabel = this.yAxis
      .append("text")
      .text("Price")
      .style("text-anchor", "middle")
      .style("fill", "grey")
      .style("font-size", "1.5em");

    /*draws a background grid made of horizontal and vertical lines*/
    this.yGrid = d3
      .select(this.root)
      .append("g")
      .style("stroke-opacity", 0.1)
      .style("fill", "#424949");

    this.xGrid = d3
      .select(this.root)
      .append("g")
      .style("stroke-opacity", 0.1)
      .style("fill", "#424949");

    /*adds a force to the data so that nodes do not overlap*/
    this.createReplusionForce();
    this.drawScatterPlot();
  }

  updateScale({ data, extent }) {
    this.width = extent.width - margin.left - margin.right;
    this.height = extent.height - margin.top - margin.bottom;

    this.min = {
      y: d3.min(this.state.nodes, d => d.y),
      x: d3.min(this.state.nodes, d => d.x)
    };
    this.max = {
      y: d3.max(this.state.nodes, d => d.y),
      x: d3.max(this.state.nodes, d => d.x)
    };

    /*create the scales for the axis*/
    this.x = d3
      .scaleLinear()
      .domain([0, this.max.x])
      .range([0, this.width]);

    this.y = d3
      .scaleLinear()
      .domain([0, this.max.y])
      .range([this.height, 0]);

    this.axisBottom = d3
      .axisBottom(this.x)
      .ticks(5)
      .tickFormat(d => `${(d / 60).toFixed(0)}min`)
      .tickSizeOuter(0);

    this.axisLeft = d3
      .axisLeft(this.y)
      .ticks(5)
      .tickFormat(d => `$${d}`)
      .tickSizeOuter(0);

    this.verticalGrid = d3
      .axisLeft(this.y)
      .ticks(7)
      .tickSize(-this.width)
      .tickFormat("")
      .tickSizeOuter(0);

    this.horizontalGrid = d3
      .axisBottom(this.x)
      .ticks(8)
      .tickSize(-this.height)
      .tickFormat("")
      .tickSizeOuter(0);
  }

  drawScatterPlot() {
    this.drawScatterPoints();
    this.xAxisDraw();
    this.yAxisDraw();
    this.drawVerticalGrid();
    this.drawHorizontalGrid();
  }

  createReplusionForce() {
    /*See https://medium.com/walmartlabs/d3v4-forcesimulation-with-react-8b1d84364721*/
    let simulation = d3
      .forceSimulation(this.state.nodes)
      .force("charge", d3.forceManyBody().strength(-30))
      .on("tick", () => this.setState({ nodes: this.state.nodes }));

    /*See https://bl.ocks.org/mbostock/1667139
    Here we speed up the force simulation ticks to make the nodes appear static*/
    for (
      var i = 0,
        n = Math.ceil(
          Math.log(simulation.alphaMin()) /
            Math.log(1 - simulation.alphaDecay())
        );
      i < n;
      ++i
    ) {
      simulation.tick();
    }
  }

  /*a color scale that scales linearly according to both the x and y data points*/
  createColorScale() {
    return d3
      .scaleLinear()
      .domain([this.min.x / this.max.x + this.min.y / this.max.y, 2])
      .range([d3.rgb("#ADF1D2"), d3.rgb("#553555")])
      .interpolate(d3.interpolateHcl);
  }

  drawScatterPoints() {
    let colors = this.createColorScale();

    this.nodeRadius = 10;
    const items = this.g.selectAll("circle").data(this.state.nodes);

    /*draw the scatter points*/
    items
      .enter()
      .append("circle")
      .attr("r", this.nodeRadius)
      .merge(items)
      .attr("cx", d => this.x(d.x))
      .attr("cy", d => this.y(d.y) + this.nodeRadius)
      .attr("id", (d, i) => `node-${i}`)
      .attr("stroke", "grey")
      .attr("stroke-width", 2)
      .on("mouseover", function(d) {
        d.onHover();
        let element = d3.select(this);
        /*remove lines extending from a previous hovered on node*/
        removeLines();
        /*draw lines extending from the data node being hovered on to the x and y axis*/
        drawVerticalLine(element);
        drawHorizontalLine(element);
      })
      .on("click", function(d, i) {
        d.onClick();
      })
      .style(
        "fill",
        d => (d.visited ? "grey" : colors(d.x / this.max.x + d.y / this.max.y))
      );
    /*draw the line that extends from a node being hovered on to the y-axis
    See http://bl.ocks.org/nbremer/801c4bb101e86d19a1d0*/
    const drawHorizontalLine = element => {
      this.g
        .append("g")
        .append("line")
        .attr("class", "horizontal")
        .attr("x1", element.attr("cx"))
        .attr("x2", 0)
        .attr("y1", element.attr("cy"))
        .attr("y2", element.attr("cy"))
        .attr("stroke", element.style("fill"))
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.5)
        .transition()
        .duration(500);
    };

    /*draw the line that extends from a node being hovered on to the x-axis
    See http://bl.ocks.org/nbremer/801c4bb101e86d19a1d0*/
    const drawVerticalLine = element => {
      this.g
        .append("g")
        .append("line")
        .attr("class", "vertical")
        .attr("x1", element.attr("cx"))
        .attr("x2", element.attr("cx"))
        .attr("y1", element.attr("cy"))
        .attr("y2", this.height)
        .attr("stroke", element.style("fill"))
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.5)
        .transition()
        .duration(200);
    };

    /*remove the lines extending from a node to the axis */
    const removeLines = function(element) {
      d3.selectAll("line.horizontal").remove();
      d3.selectAll("line.vertical").remove();
    };

    items.exit().remove();
  }

  /*draw the x-axis*/
  xAxisDraw() {
    this.xAxis
      .attr(
        "transform",
        "translate(" + margin.left + "," + (this.height + margin.top) + ")"
      )
      .attr("opacity", 0.5)
      .call(this.axisBottom);

    this.xAxisLabel.attr("x", this.width / 2).attr("y", 2 * margin.bottom / 3);
  }

  /*draw the y-axis*/
  yAxisDraw() {
    this.yAxis
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("opacity", 0.5)
      .call(this.axisLeft);

    this.yAxisLabel.attr(
      "transform",
      "translate(" +
        -margin.left / 2 +
        "," +
        this.height / 2 +
        ")" +
        "rotate(-90)"
    );
  }

  /*draw the horizontal lines required for the background grid*/
  drawHorizontalGrid() {
    this.xGrid
      .attr(
        "transform",
        "translate(" + margin.left + "," + (this.height + margin.top) + ")"
      )
      .call(this.horizontalGrid);
  }

  /*draw the vertical lines required for the background grid*/
  drawVerticalGrid() {
    this.yGrid
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(this.verticalGrid);
  }

  render() {
    const { width, height } = this.props.extent;
    return (
      <svg width={width} height={height} ref={root => (this.root = root)} />
    );
  }
}

export default ScatterPlot;
