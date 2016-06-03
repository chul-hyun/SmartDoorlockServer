'use strict';

var net = require('net');

var port = 9393;
var address = '112.156.58.112';

var client = net.connect(port, address, function () {
    console.log('connected to server!');
});

client.write('ttttttttt');