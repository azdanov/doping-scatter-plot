import * as d3 from 'd3';
import '../css/index.css';
import data from '../cyclist-data.json';

console.table(data);

const w = 900;
const h = 600;
const padding = 40;
const offsetSeconds = 5;

const parseTime = d3.timeParse('%M:%S');

const formatTime = d3.timeFormat('%M:%S');

const startTime = parseTime(d3.min(data, d => d.Time));
const endTime = parseTime(d3.max(data, d => d.Time));

const eventYears = [...new Set(data.map(d => d.Year))].sort((a, b) => a - b);

const xScale = d3
  .scaleBand()
  .domain(eventYears)
  .range([padding, w - padding]);

const yScale = d3
  .scaleTime()
  .domain([
    d3.timeSecond.offset(endTime, offsetSeconds),
    d3.timeSecond.offset(startTime, -offsetSeconds),
  ])
  .range([h - padding, padding]);

const xAxis = d3.axisBottom(xScale);

const yAxis = d3
  .axisLeft(yScale)
  .ticks(10)
  .tickFormat(formatTime);

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

svg
  .selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', d => xScale(d.Year) + xScale.bandwidth() / 2)
  .attr('cy', d => {
    return yScale(parseTime(d.Time))
  })
  .attr('r', 5);

svg
  .selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .classed('cyclist', true)
  .text(d => d.Name)
  .attr('x', d => xScale(d.Year) + xScale.bandwidth() / 2 + 10)
  .attr('y', d => yScale(parseTime(d.Time)) + 4);

svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(0,${h - padding})`)
  .call(xAxis);

svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(${padding},0)`)
  .call(yAxis);