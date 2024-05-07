const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms)); // usun ten helper i wywołanie potem

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //to nie jest niezbędne, ale możemy też parsować nie tylko json body ale też urlencoded

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //pozwalamy każdej domenie sięgać do backendu
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader( // zawęź potem do metod które faktycznie używasz
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS" 
  );
  next();
})

app.use('/entries', async (req, res, next) => {
  const entries = [
    {
      API: 'AdoptAPet',
      Description: 'Resource to help get pets adopted',
      Auth: 'apiKey',
      // "Auth": Auth.APIKey,
      HTTPS: true,
      Cors: 'yes',
      Link: 'https://www.adoptapet.com/public/apis/pet_list.html',
      Category: 'Animals'
    },
    {
      API: 'Axolotl',
      Description: 'Collection of axolotl pictures and facts',
      Auth: '',
      HTTPS: true,
      Cors: 'no',
      Link: 'https://theaxolotlapi.netlify.app/',
      Category: 'Animals'
    }
  ];

  await sleep();
  res.status(200).json({
    count: entries.length,
    entries: entries,
  });
});

module.exports = app;