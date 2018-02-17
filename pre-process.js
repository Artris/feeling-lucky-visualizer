const fs = require('fs');
const fetch = require('node-fetch');

const { key } = require('./config.json');
const rawData = require('./raw-data.json');

/**
 * Get the latitude and longitude for an address
 */
function getGeoCodes(address) {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`
  )
    .then(res => res.json())
    .then(res => res.results[0].geometry.location)
    .then(res => ({ latitude: res.lat, longitude: res.lng }))
    .catch(err => undefined);
}

// add the latitude and longitude information to data
function injectGeoCodes(data, geocodes) {
  return data.map((item, index) => {
    return Object.assign({}, item, geocodes[index]);
  });
}

// remove data point with missing latitude or longitude
function filterDataWithMissingGeoCode(data) {
  return data.filter(item => item.latitude !== undefined);
}

function clean(items) {
  return items.map(item => {
    return Object.assign({}, item, {
      price: +item.price.replace('$', ''),
      images: item.images.map(img => img.url)
    });
  });
}

Promise.all(
  rawData.map(item => {
    if (item.address) {
      return getGeoCodes(item.address);
    }
    return {};
  })
)
  .then(geoCodes =>
    filterDataWithMissingGeoCode(injectGeoCodes(rawData, geoCodes))
  )
  .then(items => clean(items))
  .then(processedData => {
    fs.writeFile('./data.json', JSON.stringify(processedData), 'utf8', err => {
      if (err) throw err;
      console.log(`processed ${processedData.length} items successfully`);
    });
  })
  .catch(err => console.error(err));
