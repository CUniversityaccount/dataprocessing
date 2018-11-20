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

  // makes canvas
  var graphTop = 25;
  var graphBottom = 25 + (maxTempAvr - minTempAvr);
  var graphLeft = 25;
  var graphRight = maxDay + 25;

  var graphHeight = (maxTempAvr - minTempAvr);
  var graphWidth = 1200;

  // makes x, y axis
  context.beginPath();
  context.moveTo(graphLeft, graphTop);
  context.lineTo(graphLeft, graphBottom);
  context.lineTo(graphRight, graphBottom);
  context.stroke();

  context.beginPath();
  context.moveTo(graphLeft, (graphHeight + minTempAvr) + 25)
  context.lineTo(graphRight, (graphHeight + minTempAvr) + 25)
  context.stroke()

  context.beginPath();

  var year_data = 20010101
  var year = 2001

  for( var count = 1; count < maxDay; count++ ){
    if (day[count] === year_data) {
      context.moveTo(graphRight / day.length * count, graphTop);
      context.lineTo(graphRight / day.length * count, graphBottom)
      context.fillText(year, graphRight / day.length * count, graphBottom + 25);
      year_data += 10000
      year += 1
    }
  }
  context.stroke()


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
