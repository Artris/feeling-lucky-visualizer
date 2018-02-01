const fetch = require('node-fetch');
const _ = require('lodash');
const fs = require('fs');

const rawData = require('./raw-data.json');
const config = require('./src/config.json');
const { key, destination: { latitude, longitude } } = config;

const request = (origins, destination, key) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origins}&destinations=${destination}&key=${key}`;
  return fetch(url).then(res => res.json());
};
const getDurations = locations => {
  const originGroups = _.chunk(locations, 25).map(chunk => chunk.join('|'));
  return Promise.all(
    originGroups.map(origins =>
      request(origins, `${latitude},${longitude}`, key)
        .then(res => res.rows)
        .then(rows => rows.map(row => row.elements[0].duration.value))
    )
  ).then(durationGroups => _.flatten(durationGroups));
};

const locations = rawData.map(house => `${house.latitude},${house.longitude}`);
getDurations(locations)
  .then(durations => {
    return rawData.map((house, index) => {
      const price = +house.price.replace('$', '');
      const images = house.images.map(img => img.url);
      return Object.assign({}, house, {
        price,
        images: Array.from(new Set(images)),
        duration: durations[index]
      });
    });
  })
  .then(data => data.filter(d => d.duration !== undefined))
  .then(data => {
    fs.writeFile('./src/data.json', JSON.stringify(data), 'utf8', err =>
      console.log(err)
    );
  })
  .catch(err => console.log(err));
