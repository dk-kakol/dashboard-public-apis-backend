const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const resourcesRoutes = require('./routes/resources');
const userRoutes = require('./routes/user');
const apiEntriesRoutes = require('./routes/apiEntries');

const app = express();
mongoose.connect(process.env.MONGO_URL)
  .then(()=> {
    console.log('Connected to database');
  })
  .catch((error)=> {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join(process.env.PATH_IMAGES)));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //allow all domains to reach backend
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader( // allowed methods
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  next();
})

app.use('/resources', resourcesRoutes);
app.use('/user', userRoutes);
app.use('/api-entries', apiEntriesRoutes);

module.exports = app;