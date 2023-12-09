
require('dotenv').config();
const cors = require('cors');
const express = require('express');
// const data = require('./data/weather.json');
const axios = require('axios');

// middleware //

const app = express();
const PORT = process.env.PORT || 3001;
const WEATHER_KEY = process.env.WEATHER_API_KEY;

app.use(cors());


// classes //

class Forecast {
  constructor(date, description, lowTemp, highTemp) {
    this.date = date;
    this.description = description;
    this.lowTemp = lowTemp;
    this.highTemp = highTemp;
  }
}


// routes //

app.get('/', (request, response) => {
  response.send('hello world');
});

app.get('/weather', async (request, response) => {
  const { lat, lon, searchQuery } = request.query;

  if (lat && lon) {
    const weather = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_KEY}`);
    // response.send(weather);
    console.log('weather', weather.data.data);
    if (weather) {
      response.json(weather.data.data.map(day => new Forecast(day.datetime, `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`))
      );
    }
    else {
      response.status(404).json({ error: 'cannot find weather data'});
    }
  }
  else if (searchQuery) {
    const weather = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuery}&key=${WEATHER_KEY}`);
    console.log(weather);
    if (weather) {
      response.json(weather.data.data.map(day => new Forecast(day.datetime, `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`))
      );
    }
    else {
      response.status(404).json({ error: 'cannot find weather data'});
    }
  }
});


// helper functions //

app.use((error, request, response) => {
  console.log(`${error} this is the error function`);
  response.status(500).send(error);
});


// start the server //
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
