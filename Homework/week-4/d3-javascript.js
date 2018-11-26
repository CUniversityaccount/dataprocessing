d3.select("body").append("p").text("joe");

d3.json("data.json").then( function(data) {
  var variables = Object.keys(data[0])
  var totalDict = {}

  for (var count =0; count < variables.length; count++) {
    totalDict[variables[count]] = []

  };


  // goes throught the dictionary
  for (var count = 0; count < data.length; count++) {
    var info = Object.values(data[count])
    for (var key = 0; key < info.length; key++) {
      if (variables[key] === Object.keys(data[count])[key]) {
        totalDict[variables[key]].push(Object.values  (data[count])[key]);
      };
    };
  };
  console.log(totalDict)
});
