// below is modified script from plot.ly documentation for gauge chart

// wash frequency for default sample
const wfreqDefaultURL = "/wfreq//940";

function init(wfreqDefaultURL) {
    d3.json(wfreqDefaultURL).then(function(data) {
        
        gaugeChart(data);

        var gauge = document.getElementById('gauge');
        Plotly.newPlot(gauge, output_pie[0], output_pie[1]);
    
    })
}

//plot default sample for gauge chart
init(wfreqDefaultURL);

function gaugeChart(data) {
    // Trig to calc meter point
    var degrees = 180 - level, radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

}


// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'scrubs per week',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9 50],
  rotation: 90,
  text: ['0-1', '1-2', '2-3', '3-4',
            '4-5', '5-6', '6-7', '7-8', '8-9'],
  textinfo: 'text',
  textposition:'inside',
  marker: {
//   marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
//                          'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
//                          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
//                          'rgba(255, 255, 255, 0)']},
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Belly Button Washing Frequency 
 Scrubs per Week,
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);