const express = require('express');
const fetch = require('node-fetch');
const _ = require('lodash');

const { key } = require('./config.json');
const data = require('./data.json');

// Since data never changes after the app starts we can cache the origins
const origins = data.map(house => `${house.latitude},${house.longitude}`);
// with the standard plan we can ask for at most 25 origins in one request
const MaxNumOrigins = 25;

const app = express();

// Get the travel times from a list of origins to a destination
function request(origins, destination, mode = 'transit') {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origins}&destinations=${destination}&key=${key}&mode=${mode}`;
  return fetch(url).then(res => res.json());
}

function getDurations(origins, destination) {
  // slice the list of origins into lists with the maximum number of origins permitted by your plan per request
  const originGroups = _.chunk(origins, MaxNumOrigins).map(chunk =>
    chunk.join('|')
  );
  return Promise.all(
    originGroups.map(origins =>
      request(origins, `${destination.lat},${destination.lng}`)
        .then(res => res.rows)
        .then(rows =>
          rows.map(row => {
            const duration = row.elements[0].duration;
            // duration is undefined if there is no route to the destination
            return duration === undefined ? null : duration.value;
          })
        )
    )
  ).then(durationGroups => _.flatten(durationGroups));
}

// returns the geocoding of an address
function getDestination(address) {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`
  )
    .then(res => res.json())
    .then(res => res.results[0].geometry.location);
}

// zip the data and durations by adding a duration parameter to each item
function injectDuration(data, durations) {
  return data.map((item, index) => {
    return Object.assign({}, item, { duration: durations[index] });
  });
}

function filterDataWithMissingData(data) {
  return data.filter(item => item.duration !== null);
}

app.get('/api/items', (req, res) => {
  getDestination(req.query.destination).then(des => {
    getDurations(origins, des)
      .then(durations => {
        // here we have access to both geocoding of the destination and the durations
        const dataZippedWithDuration = injectDuration(data, durations);
        const itemsWithDuration = filterDataWithMissingData(
          dataZippedWithDuration
        );

        res.json({
          nodes: itemsWithDuration,
          destination: { latitude: des.lat, longitude: des.lng }
        });
      })
      .catch(err => {
        res.status(404).json({ error: 'something went wrong' });
      });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
