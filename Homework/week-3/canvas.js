export function canvasCalculate(file) {
  var data = file;
  console.log(data)

  var tempAvr = [];
  var day = [];
  var count = 0
  data.forEach(function(element) {
    var key = Object.keys(element);
    tempAvr.push(element[key[0]])
    day.push(element[key[1]])
  })
  return [tempAvr, day]
}

export function makeCanvas(data) {
  var tempAvr = data[0]
  var day = data[1]

  var minTempAvr = 0
  for (var count = 0; count < tempAvr.length; count++) {
    if (tempAvr[count] < minTempAvr) {
      minTempAvr = tempAvr[count]
    }
  }


  var maxTempAvr = 0
  for (var count = 0; count < tempAvr.length; count++) {
    if (tempAvr[count] > maxTempAvr) {
      maxTempAvr = tempAvr[count]
    }
  }

  var minDay = 0
  var maxDay = day.length

  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  // makes canvas and variables
  var tempXaxis = [-15, -10, -5, 0, 5 , 10, 15, 20, 25]
  var graphTop = 50;
  var graphBottom = 550;
  var graphLeft = 50;
  var graphRight = 1200;

  var graphHeight = (maxTempAvr - minTempAvr);
  var graphWidth = 1200;

  // makes x, y axis
  context.beginPath();
  context.moveTo(graphLeft, graphTop)
  context.lineTo(graphLeft, graphBottom);
  context.lineTo(graphRight, graphBottom)
  context.lineTo(graphRight, graphTop)
  context.lineTo(graphLeft, graphTop)
  context.stroke();

  // makes the roster
  context.beginPath();
  context.strokeStyle = "lightgrey";

  for (var count = 0; count < tempXaxis.length; count++) {

    context.moveTo( graphLeft, (graphHeight - (tempXaxis[count] * 10 + (-minTempAvr)) / graphHeight * graphHeight) + graphTop);
    context.lineTo( graphRight, (graphHeight - (tempXaxis[count] * 10 + (-minTempAvr)) / graphHeight * graphHeight) + graphTop);
    context.fillText(tempXaxis[count] + " C", graphLeft - 30, (graphHeight - (tempXaxis[count] * 10 + (-minTempAvr)) / graphHeight * graphHeight) + graphTop);
  };

  var year_data = 20010101
  var year = 2001

  for( var count = 0; count < maxDay; count++ ){
    if (day[count] === year_data) {
      var date = "01-01-" + year;
      context.moveTo((graphRight / maxDay * count) + 50, graphTop);
      context.lineTo((graphRight / maxDay * count) + 50, graphBottom)
      context.fillText(date , 25 + (graphRight / maxDay * count), graphBottom + 25);
      year_data += 10000
      year += 1
    }
  }
  context.stroke()

  // make the point on the x-axis and y- axis
  context.beginPath();
  context.strokeStyle = "black";

  for (var count = 0; count < tempXaxis.length; count++) {
    context.moveTo( graphLeft - 5, (graphHeight - (tempXaxis[count] * 10 + (-minTempAvr)) / graphHeight * graphHeight) + graphTop);
    context.lineTo( graphLeft, (graphHeight - (tempXaxis[count] * 10 + (-minTempAvr)) / graphHeight * graphHeight) + graphTop);
  };

  year_data = 20010101
  year = 2001

  for( var count = 0; count < maxDay; count++ ){
    if (day[count] === year_data) {
      var date = "01-01-" + year;
      context.moveTo((graphRight / maxDay * count) + 50, graphBottom)
      context.lineTo((graphRight / maxDay * count) + 50, graphBottom + 10)
      year_data += 10000
      year += 1
    }
  }
  context.stroke();


  context.beginPath();
  context.lineJoin = "round";
  context.strokeStyle = "black";



  context.moveTo( graphLeft, ( graphHeight - tempAvr[ 0 ] / maxTempAvr * graphHeight ) + graphTop );


  // draw reference value for day of the week
  for( var count = 1; count < maxDay; count++ ){
    if (tempAvr[count] >= 0) {
      context.lineTo( graphRight / maxDay * count + graphLeft, (graphHeight - (tempAvr[count] + (-minTempAvr)) / graphHeight * graphHeight) + graphTop);
      }
    else {
      context.lineTo( graphRight / maxDay * count + graphLeft, (graphHeight - ((-minTempAvr + tempAvr[count]) / graphHeight * graphHeight)) + graphTop);
      }

  }
  context.stroke();
}