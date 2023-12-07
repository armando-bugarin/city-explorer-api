
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const data = require('./data/weather.json');

// middleware //

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());


// classes //

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}


// routes //

app.get('/', (request, response) => {
  response.send('hello world');
});

app.get('/weather', (request, response) => {
  const { lat, lon, searchQuery } = request.query;
  if (lat && lon) {
    const weather = data.find(city => city.lat === lat && city.lon === lon);
    // response.send(weather);
    console.log(weather);
    if (weather) {
      response.json(weather.data.map(day => new Forecast(day.valid_date, day.weather.description))
      );
    }
    else {
      response.status(404).json({ error: 'cannot find weather data'});
    }
  }
  else if (searchQuery) {
    const weather = data.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());
    console.log(weather);
    if (weather) {
      response.json(weather.data.map(day => new Forecast(day.valid_date, day.weather.description))
      );
    }
    else {
      response.status(404).json({ error: 'cannot find weather data'});
    }
  }
});


// helper functions //


// start the server //
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
