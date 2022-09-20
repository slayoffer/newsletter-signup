/* eslint-disable prefer-destructuring */
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const dc = 'us11';
  const apikey = '9c0879b1bbcd0dca6cd0e36c9e1ee91b-us11';
  const audience = '44670d6979';

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audience}`;

  const options = {
    method: 'POST',
    auth: `medunion:${apikey}`,
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

    response.on('data', (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Running on port 3000');
});

// API key
// 9c0879b1bbcd0dca6cd0e36c9e1ee91b-us11

// List ID
// 44670d6979
