// shortener.js

const express = require('express');
const app = express();
const port = 3001;

const shortened = {
  test: 'https://google.com',
};

app.get('/', (req, res) => {
  const url = req.params.u;
  if (!url) {
    res.send('Hello World!');
    return;
  }
  res.send(url);
});

app.get('/:short', (req, res) => {
  if (!req.params.short || !shortened[req.params.short]) {
    res.status(404).send(`This URL does not exist: /${req.params.short}`);
    return;
  } else {
    res.redirect('301', shortened[req.params.short]);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
