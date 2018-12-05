import * as d3 from "d3";
import "./styles.css";

function getTheTime (seconds) {
  let dateObj = new Date();
  let minutes = Math.floor(seconds/60);
  let secs = seconds - (minutes * 60) 
  dateObj.setMinutes(minutes);
  dateObj.setSeconds(secs);
  return dateObj;
}

const req = new XMLHttpRequest();
req.open("GET", "/src/data.json", true);
req.send();
req.onload = function() {
  const json = JSON.parse(req.responseText);
  console.log(json);
  const w = 1000;
  const h = 600;
  const padding = 50;
  let tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);
  const xScale = d3
    .scaleTime()
    .domain([d3.min(json.map(d => d.Year)), d3.max(json.map(d => d.Year))])
    .range([padding, w - padding]);
  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(json.map(d => getTheTime(d.Seconds))),
      d3.max(json.map(d => getTheTime(d.Seconds)))
    ])
    .range([h - padding, padding]);
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  const svg = d3
    .select("body")
    .select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  svg
    .selectAll("circle")
    .data(json)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(getTheTime(d.Seconds)))
    .attr("r", 5)
    .attr("class", "dot")
    .attr("data-xvalue", (d, i) => d.Year)
    .attr("data-yvalue", (d, i) => getTheTime(d.Seconds))
    .style('fill',(d)=>d.Doping === "" ? 'blue' : 'red')
    .style('stroke','black')
    .on("mouseover", function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip
          .html(`Cyclist: ${d.Name}\nTime: ${d.Time}\n${d.Doping === "" ? 'No Reported Doping' : 'Doping: '+d.Doping}`)
          .style("left", d3.event.pageX + 20 + "px")
          .style("top", d3.event.pageY + 20 + "px");
        tooltip.attr("data-year", d.Year);
      })
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(400)
          .style("opacity", 0);
      });;
  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis)
    .attr("id", "x-axis");
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .attr("id", "y-axis");
  const legend = svg.append('g')
     .attr('id','legend')
     .attr('transform','translate(750,400)');
  legend
    .append('text')
    .text('Did the dope');
  legend
    .append('rect')
    .attr('x','-20')
    .attr('y','-14')
    .attr('height','15px')
    .attr('width','15px')
    .style('fill','red')
    .style('stroke','black');
  legend
    .append('text')
    .text('Clean as a whistle')
    .attr('y','20');
  legend
    .append('rect')
    .attr('x','-20')
    .attr('y','6')
    .attr('height','15px')
    .attr('width','15px')
    .style('fill','blue')
    .style('stroke','black')
};
