function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/sample/" + sample;
  
  d3.json(url).then(function(response) {

    var sampleValues = [response.sample_values];
    console.log(sampleValues);
    
    var otuIds = [response.otu_ids];
    var otuLables = [response.otu_labels];

    // @TODO: Build a Pie Chart
    // .slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).
    var trace1 = {
      values: sampleValues.sort((a, b) => b-a).slice(0,10), //sample_values
      labels: otuIds.sort((a, b) => b-a).slice(0,10), //otu_ids
      type: 'pie',
      text: otuLables.sort((a, b) => b-a).slice(0,10) //otu_labels
    };

    var data1 = [trace1];

    var layout1 = {
      height: 500,
      width: 500
    };

    Plotly.plot("pie", data1, layout1);
  });

    // @TODO: Build a Bubble Chart using the sample data
  //   d3.json(url).then(function(response) {

  //     var trace2 = {
  //       x: otuIds,
  //       y: sampleValues,
  //       text: otuLabels,
  //       mode: 'markers',
  //       marker: {
  //         size: sampleValues,
  //         color: otuIds
  //       }
  //     };

  //     var data2 = [trace2];

  //     var layout2 = {
  //       title: "title",
  //       xaxis: "OTU IDs",
  //       yaxis: "Sample Values"
  //     };

  //     Plotly.plot("bubble", data2, layout2);
  //   });
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
