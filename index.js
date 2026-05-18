require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

const hubspotHeaders = {
  Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
  'Content-Type': 'application/json',
};

const CUSTOM_PROPERTIES = ['name', 'bio', 'type'];

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
 
  try {
    const response = await axios.get(url, {
      headers: hubspotHeaders,
      params: {
        properties: CUSTOM_PROPERTIES.join(','),
        limit: 100,
      },
    });
 
    const records = response.data.results;
 
    res.render('homepage', {
      title: 'Custom Object Records | Integrating With HubSpot I Practicum',
      records,
      properties: CUSTOM_PROPERTIES,
    });
  } catch (err) {
    console.error('Error fetching custom object records:', err.response?.data || err.message);
    res.status(500).send('Error fetching records from HubSpot.');
  }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
  });
});
 


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
 
  const newRecord = {
  properties: {
    name: req.body.name,
    bio: req.body.bio,
    type: req.body.type,  
  },
};
 
  try {
    await axios.post(url, newRecord, { headers: hubspotHeaders });
    res.redirect('/');
  } catch (err) {
    console.error('Error creating custom object record:', err.response?.data || err.message);
    res.status(500).send('Error creating record in HubSpot.');
  }
});



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));