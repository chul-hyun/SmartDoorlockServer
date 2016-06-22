console.log('started');

import express from 'express';
import bodyParser from 'body-parser';

import route from './route';

import tcp from './util/tcp'

const app = express();

console.log('import modules')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

console.log('set http option')

route(app);

console.log('set http route')

app.get('/', (req, res)=> {
  res.send('Smart Doorlock');
});

app.listen(3000, ()=> {
  console.log('http server listening on port 3000!');
});

tcp.serverStart(9393, ()=>{
    console.log('tcp server listening on port 9393!');
})
