
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());

// routes
app.get('/', (request, response) => {
  response.send('hello world');
});

// helper functions

// classes

// start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
