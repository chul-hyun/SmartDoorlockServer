var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'wkdTlqkf'
});

connection.connect();

connection.query("SELECT * FROM  `doorlock` WHERE  `id` ="++" AND  `key` =  '"++"'", function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});

connection.end();

app.get('/', function (req, res) {
  res.send('cc+');
});

app.post('/regist', function (req, res) {
    var name        = req.body.name;
    var doorlockID  = req.body.doorlockID;
    var doorlockKey = req.body.doorlockKey;
    res.json({message:'ccc+'});
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
