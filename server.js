
require('dotenv').config();
const cors = require('cors');
const express = require('express');
// const data = require('./data/weather.json'); // don't need anymore in lab 8?
const axios = require('axios');


// middleware //

const app = express();
const PORT = process.env.PORT || 3001;
const WEATHER_KEY = process.env.WEATHER_API_KEY;
const MOVIE_KEY = process.env.MOVIE_API_KEY; /////////// lab 8.2 addition

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

////////// lab 8.2 addition ///////////////
class Movies {
  constructor(singleMovie) {
    this.title = singleMovie.title;
    this.overview = singleMovie.overview;
    this.averageVotes = singleMovie.averageVotes;
    this.totalVotes = singleMovie.totalVotes;
    this.imageUrl = singleMovie.imageUrl;
    this.popularity = singleMovie.popularity;
    this.releasedOn = singleMovie.releasedOn;
  }
}


// routes //

app.get('/', (request, response) => {
  response.send('hello world');
});

// weather api
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
      response.status(404).json({ error: 'cannot find weather data' });
    }
  }
  else if (searchQuery) {
    const weather = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuery}&key=${WEATHER_KEY}`);
    console.log(weather);
    if (weather) {
      response.json(weather.data.data.map(day => new Forecast(day.datetime, `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`))
      );
    } else {
      response.status(404).json({ error: 'cannot find weather data' });
    }
  }
});

////////////////// lab 8.2 addition /////////////////
app.get('/movies', async (request, response) => {
  const { searchQuery } = request.query;

  if (searchQuery) {
    const movies = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${searchQuery}&api_key=${MOVIE_KEY}`);
    if (movies.data) {
      response.json(movies.data.results.map((movieObject) => new Movies(movieObject)));
      console.log(movies.data.results);
    } else {
      response.status(404).json({ error: 'cannot find movie data' });
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
