## Goal

Use Plotly.js to build a dashboard of interactive charts and deploy on Heroku.

## Process

In the `app.py` file, I used Flask to connect to the SQLite database and reflect the tables, and then created three routes excluding the home route (which would render the homepage in `index.html`). The `/names` route used Pandas to return a list of sample names, the `/metadata` route used SQLAlchemy to return the metadata for a user-selected sample, and the `/samples` route returned `otu_ids`, `otu_labels`, and `sample_values` data based on a user-selected sample.
