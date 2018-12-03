import * as d3 from 'd3';
import "./styles.css";

const req = new XMLHttpRequest();
req.open("GET", "/src/data.json", true);
req.send();
req.onload = function() {
  const json = JSON.parse(req.responseText);
  const w = 1000;
  const h = 600;
  const padding = 50;
  const xScale = d3.scaleLinear()
                   .domain([new Date(1994),new Date(2015)])
                   .range([padding, w-padding]);
  const yScale = d3.scaleLinear()
                   .domain([d3.min(json.map(d=>{
                     return function(d){
                     var parseTime = d3.timeParse("%M:%S");
                     return parseTime(d.Time)
                   }})),d3.max(json.map(d=>{
                     return function(d){
                      var parseTime = d3.timeParse("%M:%S");
                      return parseTime(d.Time)
                     }
                   }))])
                   .range([h-padding,padding]);
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  const svg = d3.select('#chart')
                .append('svg')
                .attr('width',w)
                .attr('height',h);
  svg.selectAll('circle')
     .data(json)
     .enter()
     .append('circle')
     .attr('cx',(d,i)=>xScale(d.Time))
     .attr('cy',(d,i)=>yScale(d.Year))
     .attr('r',5)
     .attr('class','dot')
     .attr('data-xvalue',(d,i)=>xScale(d.Year))
     .attr('data-yvalue',(d,i)=>yScale(d.Time))
  svg.append('g')
     .attr('transform','translate(0,' + h-padding + ')')
     .call(xAxis)
     .attr('id','x-axis');
  svg.append('g')
     .attr('transform','translate(' + padding + ',0)')
     .call(yAxis)
     .attr('id','y-axis');
}