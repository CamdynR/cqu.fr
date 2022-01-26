// shortener.js

const express = require('express');
const app = express();
const port = 3001;

const shortened = {};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/:short', (req, res) => {
  const short = req.params.short;
  if (short.length == 3 && shortened[short]) {
    res.redirect(301, shortened[short]);
    return;
  } else if (short.length <= 3 && !shortened[short]) {
    res.status(404).send(`This URL does not exist: /${short}`);
    return;
  } else {
    const newShortCode = generateShortURL();
    shortened[newShortCode] = short;
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
  const charSet = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  let shortURL = '';
  while (Object.keys(shortened).includes(shortURL)) {
    shortURL = '';
    for (let i = 0; i < 3; i++) {
      shortURL += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
  }
  return shortURL;
}
