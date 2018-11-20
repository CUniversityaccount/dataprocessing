export function canvas(file) {
  var data = file;

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
