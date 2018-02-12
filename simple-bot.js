const scrapeIt = require('scrape-it');
const buildUrl = require('build-url');
const fs = require('fs');

const { bot: config } = require('./config.json');
const baseURL = buildUrl(config.path, { queryParams: config.params });

/**
 * A recursive function to collect URLs to the search items from search pages into a list
 * @param {String} startingWith is the starting search page URL
 * @param {Array} prevLinks is a list of URLs to the search items from the previous pages
 * @returns a promise for a list of URLs to the search items
 */
function collectLinks(startingWith, prevLinks = []) {
  return scrapeIt(startingWith, config['lv1-selectors']).then(
    ({ data, response }) => {
      // lv1-selectors specifies the CSS selector for the next page URL and search item URLs
      const { links, next } = data;
      // add the search item URLs from this page to the ones from the previous pages
      const linksSoFar = [...prevLinks, ...links.map(e => e.url)];
      if (next.lenght > 0) {
        return getPages(next, linksSoFar);
      } else {
        // We have reached the last page
        return linksSoFar;
      }
    }
  );
}

/**
 * Extracts data from each search item URL
 * @param {Array} links is a list of search item URLs
 */
function collectItems(links) {
  return Promise.all(
    links.map(link => {
      // lv0-selectors specifies the CSS selectors for the data we are interested in
      return scrapeIt(link, config['lv0-selectors']).then(
        ({ data: item, response }) =>
          // we want to keep a search item URLs close the data we have extracted from it
          Object.assign({}, item, { link })
      );
    })
  );
}

/**
 * A search Item is only valid when all its values are non empty
 * @param {Object} item represents the extracted information for a search item
 */
function isAValidItem(item) {
  const hasMissingValue = Object.keys(item).some(key => {
    const value = item[key];
    return value.length === 0;
  });
  return !hasMissingValue;
}

/**
 * you might have to change this function if you update the config.json
 */
function clean(items) {
  return items.map(item => {
    return Object.assign({}, item, {
      price: +item.price.replace('$', ''),
      images: item.images.map(img => img.url)
    });
  });
}

collectLinks(baseURL)
  .then(links => collectItems(links))
  .then(items => items.filter(item => isAValidItem(item)))
  .then(items => clean(items))
  .catch(err => console.log(err))
  .then(data => {
    fs.writeFile('./data.json', JSON.stringify(data), 'utf8', err =>
      console.log(err)
    );
  });
