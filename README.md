## Goal

Use Plotly.js to build a dashboard of interactive charts and deploy on Heroku.

## Process

**Flask**

In the `app.py` file, I used Flask to connect to the SQLite database and reflect the tables, and then created three routes excluding the home route (which would render the homepage in `index.html`). The `/names` route used Pandas to return a list of sample names, the `/metadata` route used SQLAlchemy to return the metadata for a user-selected sample, and the `/samples` route returned `otu_ids`, `otu_labels`, and `sample_values` data based on a user-selected sample.

**Plotly.js**

In the `app.js` file, two functions were created, one for the `/metadata` route and another for the `/samples` route. 

The `buildMetadata()` function accomplished two things; populating the metadata panel on the dashboard with text, and producing a gauge chart whose pointer position would change based on the user input. To retrieve data from the `/metadata` route, I used `d3.json()` and unpacked it with an anonymous function. Because the sample metadata was stored as a dictionary, I used `Object.entries` to access both key and value. I iterated through the data in a for loop, appending each key-value pair to an empty list (`dict`) outside of the loop. Then, using `d3.select` to select the location where I wanted the data to populate, I bound the data from  `dict` to that selection and appended a new line of text for each key-value pair.

The gauge chart was trickier. Plotly.js had documentation on its own gauge charts, but none fit what I was looking for, so I used a different solution based on two resources I found online. The technique was to first make a donut chart, hide half of it, and divide the second half into nine steps (to reflect the frequency of washes, `WFREQ`, per sample). The pointer on the gauge would then point to the respective number of washes based on the selected sample. The pointer was created with a combination of a scatter plot and paths, whose point position changed in accordance with the selected sample.

The `buildCharts()` function used data from the `/samples` route to build a pie chart, and bubble chart. Again using `d3.json()`, I access the data and then created a trace using the first ten samples to plot. Instead of the traditional x and y values, a Plotly.js pie chart takes values and labels. So I used `sample_values` for values and `otu_ids` for labels, specified the chart type as `pie`, and used `hoverinfo` to display the  `otu_lables`. This trace was saved as a list (`data1`) and that was passed into `Plotly.newPlot()` so that a new plot would be created each time a user changed his/her selection. The same technique was used to plot the bubble chart, except that this chart would take x and y values. So I used `otu_ids` for the x-values, `sample_values` for the y-values, and `otu_labels` for the text, which would display extra information. However, I wanted to sizes and colors of the markers to be a function of the sample data, so I set the size of the markers to reflect `sample_values` and the color of the markers to reflect `otu_ids`. This plot too, was made using `Plotly.newPlot()`. 

An `init()` function was created to display a list of available samples as user can select from as well as populate the dashboard with default values when the dashboard is first loaded. The final function (`optionChanged()`) simply called the `buildCharts()` and `buildMetadata()` functions based on the user selection. 

**Heroku**
