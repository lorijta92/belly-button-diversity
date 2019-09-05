function buildMetadata(sample) {
  
  var url = "/metadata/" + sample;

  d3.json(url).then(function(response) {
    var dict = [];

    for (let [key, value] of Object.entries(response)) {
      dict.push({
        key: key,
        value: value
      });
    }

    console.log(dict);

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
}

function buildCharts(sample) {
  
  var url = "/samples/" + sample;

  // Pie Chart
  d3.json(url).then(function(response) {

    var trace1 = {
      values:response.sample_values.slice(0,10),
      labels:response.otu_ids.slice(0,10),
      type: "pie",
      hoverinfo: response.otu_labels.slice(0,10)
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
      showlegend: false,
      width: 1200
    };

    Plotly.plot("bubble", data2, layout2);
  });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
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
