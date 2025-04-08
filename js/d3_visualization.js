const width = 800;
const height = 500;
const margin = { top: 50, right: 100, bottom: 70, left: 70 };

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const colorScale = d3.scaleOrdinal()
  .domain([
    'Insufficient_Weight',
    'Normal_Weight',
    'Overweight_Level_I',
    'Overweight_Level_II',
    'Obesity_Type_I',
    'Obesity_Type_II',
    'Obesity_Type_III'
  ])
  .range([
    '#88CCEE',  
    '#DDCC77',  
    '#CC6677',  
    '#117733',  
    '#332288', 
    '#AA4499',  
    '#44AA99'   
  ]);

d3.csv("Obesity prediction.csv").then(data => {
  const nestedData = d3.rollups(
    data,
    v => v.length,
    d => d.CAEC,
    d => d.NObesity
  );

  const formatted = nestedData.map(([caec, values]) => {
    const obj = { CAEC: caec };
    values.forEach(([obesity, count]) => {
      obj[obesity] = count;
    });
    return obj;
  });

  const obesityLevels = colorScale.domain();

  const stackedData = d3.stack()
    .keys(obesityLevels)
    (formatted);

  const xScale = d3.scaleBand()
    .domain(formatted.map(d => d.CAEC))
    .range([margin.left, width - margin.right])
    .padding(0.3);

  const yMax = d3.max(stackedData, series =>
    d3.max(series, d => d[1])
  );

  const yScale = d3.scaleLinear()
    .domain([0, yMax])
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("font-family", "'EB Garamond', serif")
    .style("font-size", "13px");

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("font-family", "'EB Garamond', serif")
    .style("font-size", "13px");

  svg.append("text")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .style("font-family", "'EB Garamond', serif")
    .style("font-size", "16px")
    .text("Number of Individuals");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-family", "'EB Garamond', serif")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Figure 2: Food Between Meals vs Obesity (CAEC vs Obesity Level)");

  svg.selectAll("g.layer")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("class", "layer")
    .attr("fill", d => colorScale(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.data.CAEC))
    .attr("y", d => yScale(d[1]))
    .attr("height", d => yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth());

  const legend = svg.append("g")
    .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

  obesityLevels.forEach((level, i) => {
    const row = legend.append("g")
      .attr("transform", `translate(0, ${i * 25})`);

    row.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", colorScale(level));

    row.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text(level)
      .style("font-family", "'EB Garamond', serif")
      .style("font-size", "13px");
  });
});
