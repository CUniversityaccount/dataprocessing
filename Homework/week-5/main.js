window.onload = function() {
  var linkData = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var jsonData = [d3.json(linkData), d3.json(consConf)]


  Promise.all(jsonData).then(function(response) {
    let dataArray = [];

    for (var count = 0; count < response.length; count++) {
      var data = getData(response[count]);
      dataArray.push(data);
    }
    var parsedData = parseDate(dataArray)
    makeGraph(parsedData);

  }).catch(function(e){
      throw(e);
  });

  function getData(data) {

    let dataResponse = data.dataSets[0].series;

    // get the dimensions and variables
    let series = data.structure.dimensions.series;
    let seriesLength = series.length

    // set array for variables
    let varArray = [];
    let lenArray = [];

    series.forEach( function(serie) {
      varArray.push(serie);
      lenArray.push(serie.values.length);
    });

    let observation = data.structure.dimensions.observation[0];

    varArray.push(observation);

    let strings = Object.keys(dataResponse);

    let dataArray = []

    // for each string that we created
    strings.forEach(function(string){

        // for each observation and its index
        observation.values.forEach(function(obs, index){

            let data = dataResponse[string].observations[index];

            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0);
                tempString.forEach(function(s, indexi){

                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });
                // every datapoint has a time and ofcourse a datapoint

                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
  }
function parseDate(data) {
      var dataArray = []

      data[0].forEach(function(array) {
        dataArray.push({"time": array.time, "country": array.Country, "consumer": array.datapoint});
      });

      data[1].forEach(function(array) {
        for (var count = 0; count < parseInt(dataArray.length); count++) {
          if (dataArray[count].time === array.time && dataArray[count].country === array.Country) {
            dataArray[count]["women"] = array.datapoint
           };
        }
      })
    return dataArray
  };


function makeGraph(data) {
  var years = [];
  var countries = [];
  var colors = ['#b3e2cd','#fdcdac','#cbd5e8','#f4cae4','#e6f5c9','#fff2ae','#f1e2cc'];
  var colorCode = {};

  // makes the years for the dropdown menu
  data.forEach(function(point) {
      if (years === []) {
        years.push(point.time)
      }
      else if (years.includes(point.time)){
      }
      else {
        years.push(point.time)
      }
    });

    // make the countries that are used in the dataset
    data.forEach(function(point) {
        if (countries === []) {
          countries.push(point.country)
        }
        else if (countries.includes(point.country)){
        }
        else {
          countries.push(point.country)
        }
      });

  // makes a list that shows which colorcode belongs to which country
  for (var count = 0; count < countries.length; count++) {
    colorCode[countries[count]] = colors[count]
  };

  const margin = 80;
  const width = 1000 - 2 * margin;
  const height = 800 - 2 * margin;
  const dropdown = d3.select("body")
                     .append("div")
                     .attr("id", "dropdown");

 const tooltip = d3.select("body")
                   .append("div")
                   .attr("class", "tooltip");

   // dropdown menu
   const menu = d3.select("#dropdown")
                   .append("select")
                   .selectAll("option")
                     .data(years).enter()
                     .append('option')
                     .text( function (d) { return d})
                     .attr( "value", function (d) {
                                     return d;
                     });
  // makes the selected data
  var value = years[0]

  var selectedData = dataSelection(data, value)

  const svg = d3.select("body")
              .append("svg")
              .attr("width", (width+ 2 * margin) + "px")
              .attr("height", height + 2 * margin);



  var parseYear = d3.timeParse("%Y");
  var formatYear = d3.timeFormat("%Y");

  // sets the values to make the x coordinates and axis
  var   xValue = function(d) { return d["consumer"] },
        xScale = d3.scaleLinear().range([0, width ]),
        xMap = function(d) {  return xScale(xValue(d)) },
        xAxis = d3.axisBottom(xScale);

  // sets the values for the y coordinates
  var   yValue = function(d) { return d["women"] },
        yScale = d3.scaleLinear().range([height, 0]),
        yMap = function(d) { return yScale(yValue(d)) },
        yAxis = d3.axisLeft(yScale);



  // Scales the axis
  xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
  yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

  // x-axisx
  svg.append("g")
      .attr("id", "x_axe")
      .attr("class", "axis")
      .attr("transform", "translate("+ margin + "," + (height + margin) + ")")
      .call(d3.axisBottom(xScale));

  // y-axis
  svg.append("g")
      .attr("id", "y_axe")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin + "," + margin + " )")
      .call(d3.axisLeft(yScale));


  // legend
  var legendDomain = d3.scaleOrdinal()
                       .domain(countries)
                       .range(colors)
   var legend = svg.selectAll(".legend")
       .data(selectedData)
     .enter().append("g")
       .attr("class", "legend")
       .attr("transform", function(d, i) { return "translate(" +  margin + "," + (height - margin/ 2 + i * 20) + ")"; })

   // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 10)
        .attr("height", 15)
        .style("fill", function(d) { return colorCode[d.country]})
        .style("stroke", "black");

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.country;})

  // makes the
  svg.selectAll(".dot")
        .data(selectedData)
        .enter().append("circle")
        .attr("class", "scatter")
        .attr("r", 6)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("transform", "translate(" + margin + "," + margin + " )")
        .style("stroke", "black ")
        .style("fill", function(d) { return colorCode[d.country]})

        // lets see the information if move over a bar
        .on("mousemove", function(d) {
              tooltip
                .style("left", d3.event.pageX + 20+ "px")
                .style("top", d3.event.pageY - 10+ "px")
                .style("display", "inline-block")
                .html(d.country);
          })
      		.on("mouseout", function(d){ tooltip.style("display", "none");});





  var updateGraph = function(value) {
    var selectedData = dataSelection(data, value)
    svg.selectAll("circle")
          .data(selectedData)
          .attr("class", "scatter")
          .attr("r", 6)
          .attr("cx", xMap)
          .attr("cy", yMap)
          .attr("transform", "translate(" + margin + "," + margin + " )")
          .style("fill", function(d) { return colorCode[d.country]})
          .style("border-color", "black")
      }


  d3.select("#dropdown").on('change', function () {
      var selectedData = d3.select(this)
                           .select("select")
                           .property("value");
      updateGraph(selectedData);

    })

  function dataSelection(data, selection) {
    var dataArray = [];

    data.forEach( function(point) {
      if (point.time === selection) {
        dataArray.push(point)
      }
    })

    return dataArray

  };

  };
}
