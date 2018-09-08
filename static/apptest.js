// Plot the default route once the page loads
const defaultURL = "/samples/940";

d3.json(defaultURL).then(function(data) {
  pieChartData(data);
  bubbleChartData(data);
  console.log(bubbleChartData(data))

  var pie = document.getElementById('pie');
  Plotly.newPlot(pie, output_pie[0], output_pie[1]);

  var bubble = document.getElementById("bubble");
  Plotly.newPlot(bubble, output_bubble[0], output_bubble[1]);
})



/// -----------------------------------------
function pieChartData(data) {   
  output_pie = [];

  var pie_trace = {
    labels: data[0]["labels"],
    values: data[0]["values"],
    type: "pie",
    hoverinfo: data[0]["hoverinfo"]
  };

  var pie_layout = {
    "title": "",
    "showlegend": true,
    "height": 600, 
    "width": 600
  }
  var pie_data = [pie_trace];

  output_pie.push(pie_data);
  output_pie.push(pie_layout);
  
  return output_pie;

}



function bubbleChartData(data) {

  output_bubble = [];

  var bubble_trace = {
    x: data[1]["x"],
    y: data[1]["y"],
    mode: "markers",
    marker:data[1]["marker"]
  };


  var bubble_layout = {
      "title": "",
      "showlegend": true,
      "height": 600, 
      "width": 600
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
  
}



// Update the plot with new data
function updatePlotly(newdata) {
  
  pie = pieChartData(newdata)
  bubble = bubbleChartData(newdata)


  Plotly.newPlot("pie", pie[0], pie[1]);
  Plotly.newPlot("bubble", bubble[0], bubble[1]);
}










