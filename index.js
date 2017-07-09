//Main starting point of the application
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const morgan = require('morgan')

const app = express();
const router = require('./router');

//DB set up
mongoose.connect('mongodb://localhost:auth/auth');

//App setup
app.use(morgan('combined')); //Logging http request
app.use(bodyParser.json({type: '*/*'})); //parsing middleware
router(app);

//Server setup
const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on', port);
