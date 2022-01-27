// shortener.js

const express = require('express');
const app = express();
const port = 3001;

const keysToURLs = {};
const urlsToKeys = {};
const bannedShorts = ['KKK'];

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).send();
});

app.get('/:short', (req, res) => {
  const short = req.params.short;
  if (short.length == 3 && keysToURLs[short]) {
    res.redirect(301, `https://${keysToURLs[short]}`);
    return;
  } else if (short.length <= 3 && !keysToURLs[short]) {
    res.status(404).send(`This URL does not exist: /${short}`);
    return;
  } else if (urlsToKeys[short]) {
    res.json({
      url: `https://cqu.fr/${urlsToKeys[short]}`
    });
    return;
  } else {
    const newShortCode = generateShortURL();
    console.log(newShortCode);
    keysToURLs[newShortCode] = short;
    urlsToKeys[short] = newShortCode;
    res.json({
      url: `https://cqu.fr/${newShortCode}`
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/****************************/
/***   Helper Functions   ***/
/****************************/

/**
 * Takes in a URL and creates a unique, short URL for it
 * @returns {string} The new shortened 4 character path e.g. /mdpk
 */
function generateShortURL() {
  const charSet = 'BCDFGHJKMNPQRSTVWXYZ';
  let shortURL = '';
  do {
    shortURL = '';
    for (let i = 0; i < 3; i++) {
      shortURL += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
  } while (Object.keys(keysToURLs).includes(shortURL) || bannedShorts.includes(shortURL));
  return shortURL;
}
