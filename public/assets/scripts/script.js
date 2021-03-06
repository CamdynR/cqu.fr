// script.js

document.addEventListener('DOMContentLoaded', init);

// The initializing function, script starts executing here
function init() {
  bindListeners();
}

function bindListeners() {
  const form = document.querySelector('form');
  const copy = document.querySelector('#copy');

  form.addEventListener('submit', formSubmitListener);
  copy.addEventListener('click', copyText);
  document.addEventListener('keydown', keyShortcuts);
}

// Crafts a shortener query with their input and directs to that page
function formSubmitListener(e) {
  e.preventDefault();
  const url = document.querySelector('input[type="url"]').value;
  fetch(`https://cqu.fr/api/${url}`)
    .then(response => response.json())
    .then(data => {
      const qr = document.querySelector('#qr-code');
      document.querySelector('#output-wrapper').removeAttribute('hidden');
      document.querySelector('output').innerHTML = data.url;
      qr.setAttribute('src', `data:image/jpeg;base64,${data.qr}`);
      qr.removeAttribute('hidden');
      document.querySelector('#copy').click();
    })
    .catch(err => {
      console.error(err);
    });
}

// Copies text to clipboard asynchronously, then displays toast message
function copyText() {
  const url = document.querySelector('output').innerHTML;
  navigator.clipboard.writeText(url)
    .then(() => {
      const copy = document.querySelector('#copy');
      copy.classList.toggle('copied');
      setTimeout(() => {
        copy.classList.toggle('copied');
      }, 100);
    })
    .catch(err => {
      console.error(err);
    });
}

// The keyboard shortcut handler. Currently Focuses the input
// on '/' and de - focuses on escape
function keyShortcuts(e) {
  switch (e.key) {
    case '/':
      document.querySelector('input').focus();
      e.preventDefault();
      break;
    case 'Escape':
      document.querySelector('input').blur();
      e.preventDefault();
      break;
  }
}