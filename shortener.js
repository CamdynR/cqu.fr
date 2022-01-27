// shortener.js

const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

app.use(express.static('public'));

// Stores the associations between links and keys. Keys are unique, but to avoid multiple keys
// for the same URLs, URLs must be unqiue as well. Refreshing the same link a few times will
// always produce the same key.
const keysToURLs = {};
const urlsToKeys = {};

// Banned Keys list to avoid insensitive topics
const bannedKeys = ['KKK'];

// Routes to handle URL inputs
app.get('/:key', keyHandler);
app.get('/http:/:key', (req, res) => { keyHandler(req, res, true) });
app.get('/http:/:key/*', (req, res) => { keyHandler(req, res, true) });
app.get('/https:/:key', keyHandler);
app.get('/https:/:key/*', keyHandler);
app.get('/api/:url', apiHandler);
app.get('/api/http:/:url', (req, res) => { apiHandler(req, res, true) });
app.get('/api/http:/:url/*', (req, res) => { apiHandler(req, res, true) });
app.get('/api/https:/:url', apiHandler);
app.get('/api/https:/:url/*', apiHandler);

// Starts the server
app.listen(port, () => {
  console.log(`Cam's Quick URLs, For Real - listening on port ${port}`);
});

/****************************/
/***   Helper Functions   ***/
/****************************/

/**
 * Checks to see if the given input is either a valid shortened URL or a
 * URL to shorten, then either redirects, rejects, or creates a new route
 * @param {object} req The request object passed in from the route
 * @param {object} res The response object passed in from the route
 * @param {boolean} http Whether or not HTTP is being used (instead of HTTPS)
 */
function keyHandler(req, res, http) {
  // Either the shortened URL or a new URL to shorten
  let keyOrURL = req.params.key;
  // If there are subdirectories, append those to the key
  if (Object.keys(req.params).length > 1) keyOrURL += `/${req.params[0]}`;
  // If there is a queryString, reconstruct it
  if (req.url.includes('?')) {
    const i = req.url.indexOf('?');
    const queryStr = req.url.substr(i);
    keyOrURL += queryStr;
  }

  // If the length is 3, then it must be a key, check if it exists
  if (keyOrURL.length == 3 && keysToURLs[keyOrURL]) {
    let protocol = 'https://';
    if (!http) protocol = 'http://'
    // Redirect to the new URL if it exists
    res.redirect(301, `${protocol}${keysToURLs[keyOrURL]}`);
    return;
  // If it's of length 3 or less and doesn't exist, it's not a URL, just a bad
  // shortened URL
  } else if (keyOrURL.length <= 3 && !keysToURLs[keyOrURL]) {
    res.status(404).send(`This URL does not exist: /${keyOrURL}`);
    return;
  // Else it's an URL
  } else {
    res.sendFile(path.join('__dirname', '/public/index.html'));
    return;
  }
}

/**
 * Checks to see if the given input is either a valid shortened URL or a
 * URL to shorten, then either redirects, rejects, or creates a new route
 * @param {object} req The request object passed in from the route
 * @param {object} res The response object passed in from the route
 * @param {boolean} http Whether or not HTTP is being used (instead of HTTPS)
 */
function apiHandler(req, res, http) {
  // Either the shortened URL or a new URL to shorten
  let url = req.params.url;
  // If there are subdirectories, append those to the key
  if (Object.keys(req.params).length > 1) url += `/${req.params[0]}`;
  // If there is a queryString, reconstruct it
  if (req.url.includes('?')) {
    const i = req.url.indexOf('?');
    const queryStr = req.url.substr(i);
    url += queryStr;
  }

  // If it's a URL that's already been shortened, respond accordingly
  if (urlsToKeys[url]) {
    res.json({
      url: `https://cqu.fr/${urlsToKeys[url]}`,
      num: Object.keys(keysToURLs).length
    });
    return;
  // It must be then a new URL, so create a new code for it
  } else {
    const newKeyCode = generateKey();
    keysToURLs[newKeyCode] = url;
    urlsToKeys[url] = newKeyCode;
    res.json({
      url: `https://cqu.fr/${newKeyCode}`,
      num: Object.keys(keysToURLs).length
    });
  }
}

/**
 * Generates a unique 3 character key to use for a shortend URL
 * @returns {string} The new shortened 3 character path e.g. /PWT
 */
function generateKey() {
  const charSet = 'BCDFGHJKMNPQRSTVWXYZ';
  let shortURL = '';
  do {
    shortURL = '';
    for (let i = 0; i < 3; i++) {
      shortURL += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
  } while (Object.keys(keysToURLs).includes(shortURL) || bannedKeys.includes(shortURL));
  return shortURL;
}
