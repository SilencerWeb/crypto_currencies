const express = require('express');
const db = require('./models');

console.log(db);

const app = express();
const port = process.env.PORT || 5000;

require('./routes')(app);

app.listen(port);