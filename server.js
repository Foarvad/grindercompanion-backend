require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const sessionRouter = require('./app/routes/sessionRouter');


const port = 8000;

// Create app and configure it
const app = express();
app.use(express.json());
app.use('/session', sessionRouter);
// Handle errors
app.use((error, request, response, next) => {
  if (error !== null) {
    return response.status(400).json({ message: error });
  }
  return next();
});

// Connect to database
const { DB_USER, DB_PASS, DB_URL, DB_NAME } = process.env;
mongoose.Promise = global.Promise;
mongoose.connect(
  `mongodb://${DB_USER}:${DB_PASS}@${DB_URL}/${DB_NAME}`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log(`Connected to MongoDB on ${DB_URL}`));

// Listen on specified port
app.listen(port, () => {
  console.log('Server started on port ' + port);
});
