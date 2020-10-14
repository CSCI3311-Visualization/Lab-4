d3.csv('wealth-health-2014.csv', d3.autoType).then((data) => {
  const margin = { top: 20, right: 20, bottom: 20, left: 30 };
  const width = 650 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  console.log(data);

  const svg = d3
    .select('.chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const group = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Income
  const xExtent = d3.extent(data, (d) => d.Income);
  const xScale = d3.scaleLinear().domain(xExtent).range([0, width]);

  // Life Expectancy
  const yExtent = d3.extent(data, (d) => d.LifeExpectancy);
  const yScale = d3.scaleLinear().domain(yExtent).range([height, 0]);

  // Radius (Population)
  const radiusExtent = d3.extent(data, (d) => d.Population);
  const radiusScale = d3.scaleSqrt().domain(radiusExtent).range([5, 15]);

  // Color (Region)
  const regionScale = d3.scaleOrdinal(d3.schemeTableau10);

  console.log(xScale(xExtent[0]), xScale(xExtent[1]));
  console.log(yScale(yExtent[0]), yScale(yExtent[1]));

  const tooltip = d3.select('.tooltip');

  group
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('opacity', 0.7)
    .attr('fill', (d) => regionScale(d.Region))
    .attr('stroke', '#757575')
    .attr('cx', (d) => xScale(d.Income))
    .attr('cy', (d) => yScale(d.LifeExpectancy))
    .attr('r', (d) => radiusScale(d.Population))
    .on('mouseenter', (event, d) => {
      const { Country, Region, Population, Income, LifeExpectancy } = d;
      tooltip.html(
        'Country: ' +
          Country +
          '<br />' +
          'Region: ' +
          Region +
          '<br />' +
          'Population: ' +
          Population +
          '<br />' +
          'Income: ' +
          Income +
          '<br />' +
          'Life Expectancy: ' +
          LifeExpectancy
      );
      const pos = d3.pointer(event, window);
      tooltip.style('top', pos[1] + 'px');
      tooltip.style('left', pos[0] + 'px');
      tooltip.style('display', 'block');
    })
    .on('mouseleave', (event, d) => {
      tooltip.style('display', 'none');
    });

  const xAxis = d3.axisBottom().scale(xScale).ticks(5, 's');

  group
    .append('g')
    .attr('class', 'axis x-axis')
    .call(xAxis)
    .attr('transform', `translate(0, ${height})`);

  const yAxis = d3.axisLeft().scale(yScale);

  group.append('g').attr('class', 'axis y-axis').call(yAxis);
  // .attr('transform', `translate(0, ${width})`);

  console.log(regionScale.domain());

  group
    .selectAll('div')
    .data(regionScale.domain())
    .enter()
    .append('text')
    .attr('class', 'legend-label')
    .attr('x', width - 150)
    .attr('y', (d, i) => 300 + i * 20)
    .text((d) => {
      console.log('hello', d);
      return d;
    });

  group
    .selectAll('rect')
    .data(regionScale.domain())
    .enter()
    .append('rect')
    .attr('class', 'legend-rect')
    .attr('x', width - 170)
    .attr('y', (d, i) => 300 + i * 20 - 10)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', (d) => {
      return regionScale(d);
    });

  group.append('text').attr('x', 550).attr('y', 450).text('Income');

  group
    .append('text')
    .attr('x', 15)
    .attr('y', 0)
    .attr('id', 'yLabel')
    .text('Life Expectancy');

  console.log('d3 end');
});
