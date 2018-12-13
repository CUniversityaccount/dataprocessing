// Name : Coen Mol
// Studentennummer: 123 09524
// Opdracht: Linked Views


function parseData(data) {
  var totalData = [];
  var female = [];
  var male = []
  var parseYear = d3.timeParse("%Y");
  var formatYear = d3.timeFormat("%Y");
  let dataKeys = Object.keys(data)

  data.forEach(function(data) {
      if (data.SEX === "MA") {
        male.push({total: data.Value, country: data.Country, year: data.TIME});;
      }
      else if (data.SEX === "FE") {
        female.push({total: data.Value, country: data.Country, year: data.TIME});
      }
      else if (data.SEX === "TT") {
        totalData.push({"country": data.Country, "year": data.TIME, "total": data.Value});
      }
    });

  for (var c = 0; c < totalData.length; c++) {
    for (var i = 0; i < female.length; i++ ) {
      if (totalData[c].year === female[i].year && totalData[c].country === female[i].country) {
        totalData[c]["female"] = female[i].total
      }
      else if (totalData[c].year === male[i].year && totalData[c].country === male[i].country) {
        totalData[c]["male"] = male[i].total
      };
    };
  };
  return totalData
};

function parseCountry(data) {
  var dataArray = {country: [], year: []}

  data.forEach( function(dp) {
    Object.keys(dataArray).forEach (function(key) {
      if (dataArray[key].length === 0) {
        dataArray[key].push(dp[key])
      }
      else if (dataArray[key].includes(dp[key])){
      }
      else {
        dataArray[key].push(dp[key])
      };
    })
  });

  return dataArray
}

function dataSelection(data, year) {
  var dataArray = []

  data.forEach( function(dp) {
    if (dp.year === year) {
      dataArray.push(dp)
    }
  });

  return dataArray
}

function makeGraph(data) {
  let countryYears = parseCountry(data);

  var beginDate = countryYears.year[0];

  // dropdown menu
  const dropdown = d3.select("body")
                     .append("div")
                     .attr("id", "dropdown");
  const menu = d3.select("#dropdown")
                  .append("select")
                  .selectAll("option")
                    .data(countryYears.year).enter()
                    .append('option')
                    .text( function (d) { return d})
                    .attr( "value", function (d) {
                                    return d; })

  var selectedData = dataSelection(data, beginDate)
  makeBar(data, selectedData, countryYears)
}

function makeBar(data, selectedData, year) {
  const margin = 80;
  const width = 750 - 2 * margin;
  const height = 500 - 2 * margin;

  const svg = d3.select("body")
              .append("svg")
              .attr("class", "bargraph")
              .attr("width", (width+ 2 * margin) + "px")
              .attr("height", height + 2 * margin);
  // x_axis
  let xAxis = d3.scaleBand()
                  .range([0, width])
                  .padding(0.1)
                  .domain(year.country)
  // y_axis
  let yValue = function (d) { return d.total};
  let yAxis = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(data, yValue)])



  // Makes the bars
  d3.select("svg.bargraph")
    .selectAll(".bar")
    .data(selectedData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xAxis(d.country); })
      .attr("y", function(d) { return yAxis(d.total); })
      .attr("width", xAxis.bandwidth())
      .attr("height", function(d) { return height - yAxis(d.total); })
      .attr("transform", "translate(" + margin + "," + margin + ")")
      .on("click", function (d) {
        d3.selectAll(this)
        if (this.style.fill === "grey") {
          d3.selectAll("rect").style("fill", "grey")
          d3.select(this).style("fill", "red")
          makePie(d)
        }
        else {
          d3.select("svg.piechart").remove();
          d3.select(this).style("fill", "grey")

        }
      });

  // call x_axis
  svg.append("g")
      .attr("id", "x_axis")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin + "," + (+ margin + height) + ")")
      .call(d3.axisBottom(xAxis))

  // call y_axis
  svg.append("g")
      .attr("id", "y_axis")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin + "," + margin + ")")
      .call(d3.axisLeft(yAxis))

  d3.select("#dropdown").on('change', function () {
      var newData = d3.select(this)
                           .select("select")
                           .property("value");
      var selectedData = dataSelection(data, newData)
      updateGraph(data, selectedData, year, xAxis, yAxis);

    })
}

function updateGraph(data, selectedData, year, xAxis, yAxis) {
  const margin = 80;
  const width = 750 - 2 * margin;
  const height = 500 - 2 * margin;
  d3.select("svg.bargraph").selectAll(".bar")
    .remove()
    .enter()
    
  d3.select("svg")
    .selectAll(".bar")
    .data(selectedData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xAxis(d.country); })
      .attr("y", function(d) { return yAxis(d.total); })
      .attr("width", xAxis.bandwidth())
      .attr("height", function(d) { return height - yAxis(d.total); })
      .attr("transform", "translate(" + margin + "," + margin + ")")
      .on("click", function (d) {
        d3.selectAll(this)
        if (this.style.fill === "grey") {
          d3.selectAll("rect").style("fill", "grey")
          d3.select(this).style("fill", "red")
          console.log(d)
          makePie(d)
        }
        else {
          d3.select("svg.piechart").remove();
          d3.select(this).style("fill", "grey")

        }
      })
}

function makePie(data) {

  var values = parsePie(data)
  var color = d3.scaleOrdinal().range(["#FFC0CB", "#00008b"]);
  var width = 960,
      height = 450,
      radius = Math.min(width, height) / 2;

  var arc = d3.arc()
              .innerRadius(0)
              .outerRadius(radius);

  var pie = d3.pie()
              .value(function(d) { return (d.value / data.total); })
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
              .attr("transform", "translate("+ radius + ", " + radius + ")");

  var path = svg.selectAll('path')
              .data(pie(values))
              .enter()
              .append('path')
              .attr('d', arc)
              .attr('fill', function(d, i) {
                return color(i);
              })
              .text("text", function(d) { return d.label; });

  if (elementExists != 0) {
    var values = parsePie(data)
    pie.value(function(d) { return (d.value / data.total); })
    path = path.data(pie)
  }
}

function parsePie(data) {
  var male = null
  var female = null
  Object.keys(data).forEach(function(dp) {
    if (dp === "male") {
      male = {label: dp, value: data[dp]}
    }
    else if (dp === "female") {
      female = {label: dp, value: data[dp]}
    }
  })
  return [male, female]
}



function main() {
  d3.csv("data.csv").then(function (data) {
    var parsedData = parseData(data)
    makeGraph(parsedData)
  });
}


window.onload = function() {
  main()
};
