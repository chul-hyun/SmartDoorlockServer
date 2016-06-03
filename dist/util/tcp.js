'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.serverStart = serverStart;
exports.serverStop = serverStop;
exports.sendData = sendData;
exports.recvData = recvData;

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = null;
var listened = false;
var clients = [];
var callbacks = [];

function serverStart(port, callback) {
    if (listened) {
        console.log('already create server');
        return;
    }

    callback = callback ? callback : function () {};

    console.log('create server');

    listened = true;
    server = _net2.default.createServer(function (client) {
        var id = clients.length;
        var logTitle = 'client ' + id;
        var printLog = function printLog(log) {
            return console.log(logTitle + ' - ' + log);
        };

        printLog('client connected');
        clients.push({
            client: client, id: id, logTitle: logTitle
        });

        client.on('data', function (data) {
            printLog('get data: ' + data + ' (client num: ' + clients.length + ')');
            executeCabllacks(data);
        });

        client.on('error', function () {
            clients = clients.filter(function (_client) {
                return _client.id !== id;
            });
            printLog('client error');
        });

        client.on('close', function () {
            clients = clients.filter(function (_client) {
                return _client.id !== id;
            });
            printLog('client close');
        });

        client.on('end', function () {
            clients = clients.filter(function (_client) {
                return _client.id !== id;
            });
            printLog('client disconnected');
        });

        callback();
    });

    server.on('error', function (error) {
        // server restart
        console.log('server error');
        console.log(error.message);
        console.log('Will soon be restarted');
        setTimeout(function () {
            try {
                serverStop(function () {
                    return serverStart(port);
                });
            } catch (err) {} finally {
                serverStart(port);
            }
        }, 1000);
    });

    server.on('close', function () {
        console.log('server closed');
        listened = false;
    });

    server.listen(port, function () {
        console.log('server listen. port: ' + port);
    });
}

function serverStop(callback) {
    if (!listened) {
        console.log('not create server');
        callback();
        return;
    }

    server.close(callback);
    server = null;
}

function sendData(data) {
    //@TODO 클라이언트 즉, 도어락별로 구분이 필요한데..
    if (!listened) {
        console.log('not create server');
        return;
    }

    if (clients.length == 0) {
        console.log('No clients are connected.');
        return;
    }

    clients.forEach(function (_ref) {
        var client = _ref.client;
        var logTitle = _ref.logTitle;

        console.log(logTitle + ' - send data: ' + data);
        client.write(data);
    });
}

function recvData(callback) {
    callbacks.push(callback);
}

function executeCabllacks(data) {
    callbacks.forEach(function (callback) {
        return callback(data);
    });
}