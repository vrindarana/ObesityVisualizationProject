// js/d3_visualization.js

const margin = { top: 50, right: 30, bottom: 70, left: 60 },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("data/obesity_data.csv").then(function(data) {
    const obesityCounts = d3.rollup(data, v => v.length, d => d.Obesity);
    const obesityArray = Array.from(obesityCounts, ([key, value]) => ({ Obesity: key, Count: value }));

    const x = d3.scaleBand()
        .domain(obesityArray.map(d => d.Obesity))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(obesityArray, d => d.Count)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(y));

    svg.selectAll("bars")
        .data(obesityArray)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Obesity))
        .attr("y", d => y(d.Count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Count))
        .attr("fill", "#69b3a2");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Frequency of Obesity Levels");
});
