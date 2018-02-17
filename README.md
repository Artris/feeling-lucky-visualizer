# Feeling Lucky

A simple visualization app that uses React + D3 to help students find a place close to school and cheap to rent!

## How to get started

First, you need to update the `config.json` file and provide your Google Maps API key, a target URL and the CSS selectors you care about.

* You should familiarize yourself with _attr_, _selector_, and _listItem_ parameters of [scrape-it](https://github.com/IonicaBizau/scrape-it)
* You have to be careful when adding the CSS selectors.
  There may be multiple dom elements matching the same selector when you only need one element. This can cause unexpected behaviour

You can then run the bot,

```js
npm run bot
```

which scrapes all the data you specified in the `config.json` file into a list and writes it into `data.json`

Next, run the app

```js
npm start
```

Now when the client sends a get request to `/api/items` specifying the destination as a parameter, we return a list of items with duration like the following

```json
[
  {
    "price": 800,
    "images": ["an Image URL"],
    "latitude": "49.2797",
    "longitude": "122.9188",
    "link": "link to the original posting",
    "duration": 3600
  }
]
```

## Resources

* "[Building, home, house](https://www.iconfinder.com/icons/384890/building_home_house_icon)" icon by [Alex Timashenka](https://www.iconfinder.com/Oppossume) used under "free for commercial use" license.
* [D3v4 forceSimulation with React](https://medium.com/walmartlabs/d3v4-forcesimulation-with-react-8b1d84364721) by [Jack Herrington](https://medium.com/@jherr)
* [Static Force Layout](https://bl.ocks.org/mbostock/1667139) by [Mike Bostock](https://bl.ocks.org/mbostock)
* [Step 4 - Voronoi Scatterplot - Extra interactions](http://bl.ocks.org/nbremer/801c4bb101e86d19a1d0) by [Nadieh Bremer](https://bl.ocks.org/nbremer)
* [How to get create-react-app to work with a Node.js back-end API](https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0) by [Esau Silva](https://medium.freecodecamp.org/@_esausilva)
