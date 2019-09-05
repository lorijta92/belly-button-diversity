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
  d3.json(url).then(function(response) {
    console.log(response.WFREQ);

    var trace = {
      title: {text: "Scrubs per Week"},
      type: "indicator",
      mode: "gauge",
      gauge: {
        bar: {thickness:0},
        borderwidth: 0,
        axis: {
          range: [0,9],
          tickmode: "linear"
        },
        steps: [
            {range: [0,1], color: "#f7f2eb"},
            {range: [1,2], color: "#f3f0e4"},
            {range: [2,3], color: "#e8e6c8"},
            {range: [3,4], color: "#e4e8ae"},
            {range: [4,5], color: "#d4e494"},
            {range: [5,6], color: "#b6cc8a"},
            {range: [6,7], color: "#86be7f"},
            {range: [7,8], color: "#84bb8a"},
            {range: [8,9], color: "#7fb384"}
          ]
      }
    };

    var data = [trace];

    Plotly.newPlot("gauge", data);
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
