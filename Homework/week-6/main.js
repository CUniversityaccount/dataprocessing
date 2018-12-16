// Name : Coen Mol
// Studentennummer: 123 09524
// Opdracht: Linked Views
// Source: https://stats.oecd.org/index.aspx?DatasetCode=POP_FIVE_HIST
console.log("source: https://stats.oecd.org/index.aspx?DatasetCode=POP_FIVE_HIST")

function parseData(data) {
  var groupData = d3.nest()
                    .key(function(d) { return d.Time})
                    .key(function(d) { return d.Country})
                    .key(function(d) {  var split = d.Subject.split(" ")
                                        return split[split.length - 1]})
                    .rollup(function(d) {
                            var dict = {}
                            d.forEach( function(dp) {
                              dict[dp.Sex] = parseInt(dp.Value)
                              dict["country"] = dp.Country
                            })
                            return dict
                          })
                    .object(data);
  return groupData
};

function parseCountry(data) {
  var dataArray = []
  Object.keys(data).forEach(function (d) {
      dataArray.push(d)
  })

  return dataArray
}


function makeGraph(data) {
  let years = Object.keys(data);

  var beginDate = years[0]
  let country = parseCountry(data[beginDate])

  // dropdown menu
  const dropdown = d3.select("body")
                     .append("div")
                     .attr("id", "dropdown");
  const menu = d3.select("#dropdown")
                  .append("select")
                  .selectAll("option")
                    .data(years).enter()
                    .append('option')
                    .text( function (d) { return d})
                    .attr( "value", function (d) {
                                    return d; })

  makeBar(data, data[beginDate], country, years)
}

function makeBar(data, selectedData, country, year) {
  const stack = d3.stack().offset(d3.stackOffsetExpand);
  const margin = 80;
  const width = 750 - 2 * margin;
  const height = 500 - 2 * margin;
  var list = Object.keys(selectedData[country[0]]).sort(function(d) { return d } )
  var index = list.indexOf("ages")
  list.splice(index, 1)
  list.sort()
  var z = d3.scaleLinear()
            .domain([0, list.length])
            .interpolate(d3.interpolateLab)
            .range(["yellow", "purple", "green"]);

  const svg = d3.select("body")
              .append("svg")
              .attr("class", "bargraph")
              .attr("width", (width+ 2 * margin + 50) + "px")
              .attr("height", height + 2 * margin);
              g = svg.append("g").attr("transform", "translate(" + margin + "," + margin + ")")

  // x_axis
  let xAxis = d3.scaleBand()
                  .range([0, width])
                  .padding(0.1)
                  .domain(country)

  // y_axis
  function yValue(data) {
    let max = []
    Object.values(data).forEach(function (d) {
      Object.values(d).forEach(function (dp) {
      max.push(dp["All persons"])
    })
    });
    return d3.max(max)
  }
  var max = yValue(selectedData)
  let yAxis = d3.scaleLinear()
                .range([height, 0])
                .domain([0, max])


  var dataList = []

  Object.values(selectedData).forEach(function(d) {
      var dict = {}
    list.forEach(function (dp) {
      dict["country"] = d[dp].country
      dict[dp] = d[dp]["All persons"]
    });
      dataList.push(dict)
  })

  var stackData = stack.keys(list)(dataList)
  var serie = g.selectAll(".series")
              .data(stackData)
              .enter()
              .append("g")
                .attr("class", "series")
                .attr('fill', function(d, i) { return z(i) })
                .attr("key", function (d) { return d.key});

    // append the bars
    serie.selectAll(".series")
      .data(function(d) { return d})
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xAxis(d.data.country); })
      .attr("y", function(d) { return yAxis(d[1] * selectedData[d.data.country]["ages"]["All persons"]); })
      .attr("width", xAxis.bandwidth())
      .attr("height", function(d) { return yAxis(d[0] *selectedData[d.data.country]["ages"]["All persons"]) - yAxis(d[1] * selectedData[d.data.country]["ages"]["All persons"]); })
      .attr("selected", "no")
      .on("click", function(d) {
        if (d3.select(this).attr("selected") === "yes"){
          d3.selectAll(".bar").attr("selected", "no")
          d3.select(this).attr("stroke", "none")
          d3.select("svg.piechart").remove()
        }
        else {
          d3.selectAll(".bar").attr("selected", "no").attr("stroke", "none")
          d3.select(this).attr("selected", "yes")
          d3.select(this).attr("stroke", "black")
          d3.select(this).attr("stroke-width", "2px")
          var key = d3.select(this.parentNode).attr("key")
          makePie(selectedData[d.data.country][key])
        }
      });

    // call x_axis
   svg.append("g")
        .attr("id", "x_axis")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin + "," + (+ margin + height) + ")")
        .call(d3.axisBottom(xAxis))

    //  call y_axis
    svg.append("g")
        .attr("id", "y_axis")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin + "," + margin + ")")
        .call(d3.axisLeft(yAxis))

    // legend
    var legendDomain = z
     var legend = svg.selectAll(".legend")
         .data(list.reverse())
       .enter().append("g")
         .attr("class", "legend")
         .attr("transform", function(d, i) { return "translate(" + 200 + "," + (height + 40 - i * 20) + ")"; })

     // draw legend colored rectangles
      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 10)
          .attr("height", 15)
          .style("fill", function(d, i) { return z(list.length - i)})
          .style("stroke", "black");

      // draw legend text
      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".25em")
          .style("text-anchor", "end")
          .style("font-size", "12px")
          .text(function(d) { return d;});

      // text label for the x axis
      svg.append("text")
          .attr("transform",
                "translate(" + ((width/2) + margin) + " ," +
                               (height + margin + 50) + ")")
          .style("text-anchor", "middle")
          .text("Countries");


      // text label for the y axis
      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0)
          .attr("x",0 - (height / 2) - margin)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Population");

      // Headtext
      svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 + (margin / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("font-style", "bold")
          .text("Comparision between the population of Denmark and Austria");




  d3.select("#dropdown").on('change', function () {
      d3.select("svg.piechart").remove()
      var newDate = d3.select(this)
                           .select("select")
                           .property("value");
      updateGraph(data[newDate]);


      function updateGraph(data) {
        // update max value
        function yValue(data) {
          let max = []
          Object.values(data).forEach(function (d) {
            Object.values(d).forEach(function (dp) {
            max.push(dp["All persons"])
          })
          });
          return d3.max(max)
        }
        var max = yValue(selectedData)

        var dataList = []

        Object.values(data).forEach(function(d) {
            var dict = {}
          list.forEach(function (dp) {
            dict["country"] = d[dp].country
            dict[dp] = d[dp]["All persons"]
          });
            dataList.push(dict)
        })

        var stackData = stack.keys(list)(dataList)
      g.selectAll(".series")
                  .data(stackData)
                  .enter();

      d3.selectAll("rect.bar").remove();

      // change graph
      serie.selectAll(".series")
        .data(function(d) { return d})
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xAxis(d.data.country); })
        .attr("y", function(d) { return yAxis(d[1] * selectedData[d.data.country]["ages"]["All persons"]); })
        .attr("width", xAxis.bandwidth())
        .attr("height", function(d) { return yAxis(d[0] *selectedData[d.data.country]["ages"]["All persons"]) - yAxis(d[1] * selectedData[d.data.country]["ages"]["All persons"]); })
        .attr("selected", "no")
        .on("click", function(d) {
          if (d3.select(this).attr("selected") === "yes"){
            d3.selectAll(".bar").attr("selected", "no")
            d3.select(this).attr("stroke", "none")
            d3.select("svg.piechart").remove();
          }
          else {
            d3.selectAll(".bar").attr("selected", "no").attr("stroke", "none")
            d3.select(this).attr("selected", "yes")
            d3.select(this).attr("stroke", "black")
            d3.select(this).attr("stroke-width", "2px")
            var key = d3.select(this.parentNode).attr("key")
            makePie(selectedData[d.data.country][key]);
          }
        });
      }
    })
}

function makePie(data) {
  var values = parsePie(data)
  var color = d3.scaleOrdinal().range(["#00008b", "#FFC0CB"]);
  var width = 960,
      height = 450,
      radius = Math.min(width, height) / 2;

  var arc = d3.arc()
              .innerRadius(0)
              .outerRadius(radius);

  var pie = d3.pie()
              .value(function(d) { return (Object.values(d) / data["All persons"]); })
              .sort(null);

  var elementExists = document.getElementsByClassName("piechart")
  if (elementExists.length === 0) {
    d3.select("body")
      .append("svg")
      .attr("class", "piechart")
      .attr("width", width)
      .attr("height", height)


  }
  var svg = d3.select("svg.piechart")
              .append("g")
              .attr("transform", "translate("+ width / 2 + ", " + radius + ")");
  d3.select("svg.piechart").selectAll("text").remove()
  var path = svg.selectAll('path')
              .data(pie(values))
              .enter()
              .append('path')
              .attr('d', arc)
              .attr('fill', function(d, i) {
                return color(i);
              })
              .attr("stroke", "black")

              svg.selectAll("text")
              .data(pie(values))
              .enter()
              .append("text")
              .attr("transform", function(d) {
                var _d = arc.centroid(d);
                _d[0] *= 2.5;	//multiply by a constant factor
                _d[1] *= 2.5;	//multiply by a constant factor
                return "translate(" + _d + ")";
              })
              .attr("dy", ".50em")
              .style("text-anchor", "middle")
              .attr("fill", "black")
              .text(function(d, i) { return Object.keys(values[i]) + ": " + Object.values(values[i]) });
  if (elementExists != 0) {

    var values = parsePie(data)
    pie.value(function(d) { return (d / data["All persons"]); })
    path = path.data(pie(values))
  }
}

function parsePie(data) {
  var male = data.Males
  var female = data.Females
  return [{Male: male}, {Female: female}]
}



function main() {
  d3.csv("data3.csv").then(function (data) {
    var parsedData = parseData(data)
    makeGraph(parsedData)
  });
}


window.onload = function() {
  main()
};
