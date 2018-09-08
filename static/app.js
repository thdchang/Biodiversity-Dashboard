// Plot the default route once the page loads
const sampleDefaultURL = "/samples/940"
const metadataDefaultURL = "/metadata/940";


function init(sampleDefaultURL, metadataDefaultURL) {
d3.json(sampleDefaultURL).then(function(data) {
  pieChartData(data);
  bubbleChartData(data);
  console.log(bubbleChartData(data))

  var pie = document.getElementById('pie');
  Plotly.newPlot(pie, output_pie[0], output_pie[1]);

  var bubble = document.getElementById("bubble");
  Plotly.newPlot(bubble, output_bubble[0], output_bubble[1]);
})

d3.json(metadataDefaultURL).then(function(data) {
  var metadataDiv = d3.select("#metadata")
  for (var key in data) {
    metadataDiv.append("p").text(`${key}: ${data[key]}`)

  }

  })
}

init(sampleDefaultURL, metadataDefaultURL);

/// -----------------------------------------
function pieChartData(data) {   
  output_pie = [];

  var pie_trace = {
    labels: data[0]["labels"],
    values: data[0]["values"],
    type: "pie",
    text: data[0]["hoverinfo"],
    hoverinfo: `label+text+value+percent`,
    textinfo: `percent`
  };

  var pie_layout = {
    "showlegend": true,
    "height": 500, 
    "width": 500,
    "margin":{t: 0, b:0}
  }
  var pie_data = [pie_trace];

  output_pie.push(pie_data);
  output_pie.push(pie_layout);
  
  return output_pie;

}

// var colorFunc = function markerColor(array) {
//   colorArray = [];
//   for (var i=0; i<array.length; i++) {
//     return `rgb(0,0,${array[i]})`
//   }
// }

function bubbleChartData(data) {

  output_bubble = [];

  var bubble_trace = {
    x: data[1]["x"],
    y: data[1]["y"],
    mode: "markers",
    marker: { 
      color: data[1]["x"],
      size: data[1]["y"]
    },
    text: data[1]["text"],

  };


  var bubble_layout = {
      "height": 600, 
      "width": 1250,
      "xaxis": {
        "title": "OTC ID"
      },
      "hovermode":"closest"

  }

  var bubble_data = [bubble_trace];

  output_bubble.push(bubble_data);
  output_bubble.push(bubble_layout);

  return output_bubble;

}







// Get new data whenever the dropdown selection changes
function getData(route) {
  console.log(route);
  
  d3.json(`/samples/${route}`).then(function(data) {
    console.log("newdata", data);
    updatePlotly(data);
  });



  d3.json(`/metadata/${route}`).then(function(data) {
    
    d3.select("#metadata").html("");
    var peElements = d3.select("#metadata");

    for (var key in data) {
      peElements.append("p").text(`${key}: ${data[key]}`)
  
    }
  

  })
}



// Update the plot with new data
function updatePlotly(newdata) {
  
  pie = pieChartData(newdata)
  bubble = bubbleChartData(newdata)


  Plotly.newPlot("pie", pie[0], pie[1]);
  Plotly.newPlot("bubble", bubble[0], bubble[1]);
}









// ---------------------------------------------------------
// Review and edit 

// MAKE THE PLOTS RESPONSIVE
(function() {
  var d3 = Plotly.d3;
  var WIDTH_IN_PERCENT_OF_PARENT = 100,
      HEIGHT_IN_PERCENT_OF_PARENT = 90;
  
  var gd3 = d3.selectAll(".responsive-plot")
      .style({
        width: WIDTH_IN_PERCENT_OF_PARENT + '%',
        'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
        
        height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
        'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
      });

  var nodes_to_resize = gd3[0]; //not sure why but the goods are within a nested array
  window.onresize = function() {
    for (var i = 0; i < nodes_to_resize.length; i++) {
      Plotly.Plots.resize(nodes_to_resize[i]);
    }
  };
  
})
();