import "../css/index.css";
import data from "../cyclist-data.json";

const w = 700;
const h = 600;
const padding = 40;
const offsetSeconds = 5;
const circleRadius = 5;

const parseTime = d3.timeParse("%M:%S");

const formatTime = d3.timeFormat("%M:%S");

const startTime = parseTime(d3.min(data, ({ Time }) => Time));
const endTime = parseTime(d3.max(data, ({ Time }) => Time));

const eventYears = [...new Set(data.map(({ Year }) => Year))].sort((a, b) => a - b);

const [startYear, endYear] = d3.extent(eventYears, d => d);

const xScale = d3
    .scaleBand()
    .domain(eventYears)
    .range([padding, w - padding]);

const yScale = d3
    .scaleTime()
    .domain([d3.timeSecond.offset(endTime, offsetSeconds), d3.timeSecond.offset(startTime, -offsetSeconds)])
    .range([h - padding, padding]);

const xAxis = d3.axisBottom(xScale);

const yAxis = d3
    .axisLeft(yScale)
    .ticks(10)
    .tickFormat(formatTime);

d3.select("h1").text(`Fastest times up Alpe d'Huez`);
d3.select("p").text(`Data from year ${startYear} up to ${endYear}.`);

const svg = d3
    .select("main")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

const onMouseOver = ({ Name, Year, Nationality, Time }) => {
    svg
        .selectAll("circle")
        .classed(
            "selected",
            ({ Name: currentName, Year: currentYear }) => `${Name} + ${Year}` === `${currentName} + ${currentYear}`,
        )
        .attr(
            "r",
            ({ Name: currentName, Year: currentYear }) =>
                `${Name} + ${Year}` === `${currentName} + ${currentYear}` ? circleRadius + 2 : circleRadius,
        );
    d3
        .select(".cyclist-stats")
        .text(`${Name} (${Nationality}) - ${Time} - ${Year}`)
        .classed("cyclist-info--visible", true);
};

const onMouseOut = () => {
    svg.selectAll("circle").classed("selected", () => {
        svg
            .selectAll("circle")
            .classed("selected", () => false)
            .attr("r", circleRadius);
    });
    d3.select(".cyclist-stats").classed("cyclist-info--visible", false);
};

svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", ({ Year }) => xScale(Year) + xScale.bandwidth() / 2)
    .attr("cy", ({ Time }) => yScale(parseTime(Time)))
    .attr("r", circleRadius)
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut);

svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis);

svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

const infoPanel = d3
    .select("main")
    .append("div")
    .style("height", `${h - padding * 1.7}px`)
    .classed("info", true);

infoPanel.append("h2").text(`Top ${data.length} cyclists`);

infoPanel
    .selectAll("p")
    .data(data)
    .enter()
    .append("p")
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)
    .text(({ Place, Name, Year }) => `${Place}. ${Name} (${Year})`)
    .append("span")
    .text(({ Time }) => `${Time}`);
