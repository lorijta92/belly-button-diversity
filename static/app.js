function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  var url = "/metadata/" + sample;
  d3.json(url).then(function(response) {
    console.log(response);
  });

  // Use `.html("") to clear any existing metadata

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  console.log(sample);
  
  var url = "/samples/" + sample;
  console.log(url);

  var test = d3.json(url);
  console.log(test);

  // Pie Chart
  d3.json(url).then(function(response) {

    // var trace1 = {
    //   values:response.sample_values.sort((a, b)=> b-a).slice(0,10),
    //   labels:response.otu_ids.sort((a, b)=> b-a).slice(0,10),
    //   type: "pie",
    //   hoverinfo: response.otu_labels.sort((a, b)=> b-a).slice(0,10)
    // };

    var trace1 = {
      values: response["sample_values"].sort((a, b)=> b-a).slice(0,10),
      labels: response["otu_ids"].sort((a, b)=> b-a).slice(0,10),
      type: "pie",
      hoverinfo: response["otu_labels"].sort((a, b)=> b-a).slice(0,10)
    };

    var data1 = [trace1];

    var layout1 = {
      title: "Top 10 Samples",
      height: 500,
      width: 500
    };

    Plotly.plot("pie", data1, layout1);
  });

  // Bubble Chart
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
