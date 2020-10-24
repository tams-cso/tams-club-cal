const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || PORT, () =>
    console.log(`Listening on port ${process.env.PORT || PORT}`)
);
