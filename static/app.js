function buildMetadata(sample) {
  
  var url = "/metadata/" + sample;

  // Fetch metadata for a sample to  build metadata panel
  d3.json(url).then(function(response) {
    
    // Store responses as key-value pairs in JavaScript object
    var dict = [];

    for (let [key, value] of Object.entries(response)) {
      dict.push({
        key: key,
        value: value
      });
    }

    // Clear any existing data before appending new data
    d3.select("#sample-metadata")
    .html("")
    .selectAll("p")
    .data(dict)
    .enter()
    .append("p")
    .html(function(d) {
      return `${d.key}: ${d.value}`;
    });
  });

  // Gauge Chart for Frequency of Washes

  //https://codepen.io/plotly/pen/rxeZME
  //https://com2m.de/blog/technology/gauge-charts-with-plotly/
  d3.json(url).then(function(response) {
    console.log(response.WFREQ);

    // Number of washes
    var washes = response.WFREQ;

    // Trig to calc meter point
    var degrees = 180 - (washes*20),
      radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path:
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    // Pointer center
    var data = [
      { type: 'scatter',
        x: [0],
        y:[0],
        marker: {size: 18, color:'850000'},
        showlegend: false,
        hoverinfo: 'none'
      },
      // Gauge steps
      { 
        values: [50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
        rotation: 90,
        text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:["#7fb384", "#84bb8a", "#86be7f", "#b6cc8a", "#d4e494", "#e4e8ae", "#e8e6c8", "#f3f0e4", "#f7f2eb", "#ffffff"]},
        labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        hoverinfo: 'none',
        hole: .55,
        type: 'pie',
        showlegend: false
      }
    ];

    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
      xaxis: {zeroline:false, showticklabels:false,
          showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
          showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout);
  });
}


function buildCharts(sample) {
  
  var url = "/samples/" + sample;

  // Pie Chart
  d3.json(url).then(function(response) {

    // Grab First 10 Samples of Data to Plot
    var trace1 = {
      values:response.sample_values.slice(0,10),
      labels:response.otu_ids.slice(0,10),
      type: "pie",
      hoverinfo: response.otu_labels.slice(0,10)
    };

    var data1 = [trace1];

    var layout1 = {
      title: "Top 10 Samples"
    };

    Plotly.newPlot("pie", data1, layout1);
  });

  // Bubble Chart
  d3.json(url).then(function(response) {
    
    var trace2 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      },
      type: 'scatter'
    };

    var data2 = [trace2];

    var layout2 = {
      title: "Belly Button Diversity",
      xaxis: {title: "OTU ID"},
      showlegend: false
    };

    Plotly.newPlot("bubble", data2, layout2);
  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
