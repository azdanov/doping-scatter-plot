import * as d3 from 'd3';
import '../css/index.css';
import data from '../cyclist-data.json';

console.table(data);

const w = 600;
const h = 400;
const padding = 40;
const yearDays = 365;

const parseTime = d3.timeParse('%M:%S');
const parseYear = d3.timeParse('%Y');

// For converting Dates to strings
const formatYear = d3.timeFormat('%Y');
const formatTime = d3.timeFormat('%M:%S');

// Discover start and end dates in dataset
const startDate = parseYear(d3.min(data, d => d.Year));
const endDate = parseYear(d3.max(data, d => d.Year));

// Discover start and end dates in dataset
const startTime = parseTime(d3.min(data, d => d.Time));
const endTime = parseTime(d3.max(data, d => d.Time));

console.log(startDate, endDate);
console.log(startTime, endTime);

// Create scale functions
const xScale = d3
  .scaleTime()
  .domain([
    d3.timeDay.offset(startDate, -yearDays),
    d3.timeDay.offset(endDate, yearDays),
  ])
  .range([padding, w - padding]);

const yScale = d3
  .scaleTime()
  .domain([d3.timeDay.offset(startTime, -1), d3.timeDay.offset(endTime, 1)])
  .range([h - padding, padding]);

// Define X axis
const xAxis = d3
  .axisBottom(xScale)
  .ticks(9)
  .tickFormat(formatYear);

// Define Y axis
const yAxis = d3
  .axisLeft(yScale)
  .ticks(10)
  .tickFormat(formatTime);

// Create SVG element
const svg = d3
  .select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

// Generate guide lines
svg
  .selectAll('line')
  .data(data)
  .enter()
  .append('line')
  .attr('x1', d => xScale(parseYear(d.Year)))
  .attr('x2', d => xScale(parseYear(d.Year)))
  .attr('y1', h - padding)
  .attr('y2', d => yScale(parseTime(d.Time)))
  .attr('stroke', '#ddd')
  .attr('stroke-width', 1);

// Generate circles last, so they appear in front
svg
  .selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', d => xScale(parseYear(d.Year)))
  .attr('cy', d => yScale(parseTime(d.Time)))
  .attr('r', 2);

// Create X axis
svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(0,${h - padding})`)
  .call(xAxis);

// Create Y axis
svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(${padding},0)`)
  .call(yAxis);
