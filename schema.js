const fetch = require('node-fetch');
const key = require('./keys').key;
const url = `https://www.goodreads.com/author/show/18541?format=xml&key=${key}`;

const x = fetch(url)
.then(response =>  response.text())
.then(data => {
  console.log(data);
});
