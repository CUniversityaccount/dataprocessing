window.onload = function() {
  var linkData = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var jsonData = [d3.json(linkData), d3.json(consConf)]


  Promise.all(jsonData).then(function(response) {
    let dataArray = [];

    for (var count = 0; count < response.length; count++) {
      var data = getData(response[count])
      dataArray.push(data)
    }

    console.log(dataArray)
  }).catch(function(e){
      throw(e);
  });

  function getData(data) {
    console.log(data)
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

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data;
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
  }

  const margin = 80;
  const width = 1000 - 2 * margin;
  const height = 800 - 2 * margin;

  const dropdown = d3.select("body")
                     .append("div")
                     .attr("id", "dropdown")


  const svg = d3.select("body")
              .append("svg")
              .attr("width", (width+ 2 * margin) + "px")
              .attr("height", height + 2 * margin)



  var parseYear = d3.timeParse("%Y")
  var formatYear = d3.timeFormat("%Y")

  const xValue = function(d) { return d.Perioden },
        xScale = d3.scaleTime().range([0, width]),
        xMap = function(d) { return xScale(xValue(d)) },
        xAxis = d3.axisBottom(xScale);

  const yScale = d3.scaleLinear().range([height, 0]),
        yMap = function(d) { return yScale(yValue(d)) },
        yAxis = d3.axisLeft(yScale);


  const tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip");

  d3.json("data.json").then( function (data){
    data.forEach(function(point){
      point["aantallen Jonger dan 20 jaar aantal"] = +point["aantallen Jonger dan 20 jaar aantal"];
      point["aantallen 20 tot 40 jaar aantal"] = +point["aantallen 20 tot 40 jaar aantal"];
      point["aantallen 40 tot 65 jaar aantal"] = +point["aantallen 40 tot 65 jaar aantal"];
      point["aantallen 65 tot 80 jaar aantal"] = +point["aantallen 65 tot 80 jaar aantal"];
      point["aantallen Totale bevolking aantal"] = +point["aantallen Totale bevolking aantal"];
    });
  console.log("true")
  // load the variables
  var nest = d3.nest()
              .key(function (d){
                return d.Perioden
              })
              .key(function (d) {
                return d["aantallen Totale bevolking aantal"]
              })
              .entries(data);

  // Scales the axis
  xScale.domain([parseYear(d3.min(data, xValue)), parseYear(d3.max(data, xValue))]);
  yScale.domain([0, 100]);

  // x-axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+ margin + "," + (height + margin) + ")")
      .call(d3.axisBottom(xScale));

  // y-axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin + "," + margin + " )")
      .call(d3.axisLeft(yScale));


  // dropdown menu
  const menu = d3.select("#dropdown")
                  .append()

  // makes the dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 2)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .attr("transform", "translate(" + margin + ", 0)");



});
}
