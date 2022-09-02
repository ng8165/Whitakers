# Whitaker's Words

[![Netlify Status](https://api.netlify.com/api/v1/badges/b58f4fed-4cbf-4438-9c17-b6f342418f75/deploy-status)](https://app.netlify.com/sites/whitakers/deploys)

The WORDS program parses Latin text into its forms. It can also provide suggestions for Latin words based on an English input.

This program uses Notre Dame University's online host of the WORDS program to create an API (see `app.js`). Try [this query](https://whitakers.herokuapp.com/api?mode=latin&query=actus%20sum)).

There is also a front-end website (see `index.html`, `css/styles.css`, and `js/index.js`) that uses Bootstrap and a fetch request to receive the result of the API call. Visit [whitakers.herokuapp.com](https://whitakers.herokuapp.com/).
