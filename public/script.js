// script.js

document.addEventListener('DOMContentLoaded', init);

// The initializing function, script starts executing here
function init() {
  const form = document.querySelector('form');
  form.addEventListener('submit', formSubmitListener)
}

// Crafts a shortener query with their input and directs to that page
function formSubmitListener(e) {
  e.preventDefault();
  const url = document.querySelector('input[type="url"]').value;
  fetch(`https://cqu.fr/${url}`)
    .then(response => response.json())
    .then(data => {
      document.querySelector('#output-wrapper').removeAttribute('hidden');
      document.querySelector('output').innerHTML = data.url;
    })
    .catch(err => {
      console.error(err);
    });
}