import express from 'express';
import bodyParser from 'body-parser';

import route from './route';

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

route(app);

app.get('/', function (req, res) {
  res.send('cc+');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
