const path = require('path');
const express = require('express');

const port = (process.env.PORT || 3000);
const indexPath = path.join(__dirname, '/public/index.html');
const publicPath = express.static(path.join(__dirname, '/public'));

const app = express();

app.use(publicPath);

app.get('*', function (req, res) { res.sendFile(indexPath); });

app.listen(port);

console.log(`Listening at http://localhost:${port}`);
