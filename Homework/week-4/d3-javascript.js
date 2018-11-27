// Name : Coen Mol
// Studentennummer: 123 09524
// Opdracht: Bar graph

const margin = 80;
const width = 1000 - 2 * margin ;
const height = 600 - 2 * margin;


const svg = d3.select("svg")

const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

// makes X range and values
const x  = d3.scaleBand()
            .range([0, width])
            .padding(0.2);

// makes y range and values
const y = d3.scaleLinear()
          .range([height, 0]);

//
const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const tooltip = d3.select("body").select("div").attr("class", "toolTip");

// loads graph and json file
d3.json("data.json").then(function(data) {
  var variables = Object.keys(data[0])
  var totalDict = {}
  var heightList = []
  var coordinateXList = []
  var coordinateYList = []

  for (var count =0; count < variables.length; count++) {
    totalDict[variables[count]] = []
  };


  // goes throught the dictionary
  for (var count = 0; count < data.length; count++) {
    var info = Object.values(data[count]);

    // put the information into the directionary
    for (var key = 0; key < info.length; key++) {
      if (variables[key] === Object.keys(data[count])[key]) {
        totalDict[variables[key]].push(Object.values(data[count])[key]);
      };
    };
  };

  var xAxisData = totalDict[variables[0]];
  var yAxisData = totalDict[variables[6]];


  x.domain(xAxisData);
  y.domain([ parseInt(d3.min(yAxisData))/10**6 - 1 , parseInt(d3.max(yAxisData))/10**6]);

  // Makes the bars
  chart.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d[variables[0]]); })
      .attr("y", function(d) { return y(parseInt(d[variables[6]])/10**6); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(parseInt(d[variables[6]])/10**6); })

      // lets see the information if move over a bar
      .on("mousemove", function(d) {
            tooltip
              .style("left", d3.event.pageX - 10+ "px")
              .style("top", d3.event.pageY - 40 + "px")
              .style("display", "inline-block")
              .html("Totale bevolking = " + parseFloat(d[variables[6]]/10**6));
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});

  // add X Axe
  chart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.5em")
          .attr("font-size", "10px")
          .attr("transform", "rotate(-90)");



    // add Y Axe
    chart.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));


    // Headtext
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 + (margin / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-style", "bold")
        .text("Nederlandse bevolking van 1950 tot 2018");

    // text label for the x axis
    svg.append("text")
        .attr("transform",
              "translate(" + (width/2) + " ," +
                             (height + margin + 50) + ")")
        .style("text-anchor", "middle")
        .text("Years");


    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Bewoners (X 1000000)");
  });
