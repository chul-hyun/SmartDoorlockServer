'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.checkDoorlockKey = checkDoorlockKey;
exports.addUser = addUser;

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pool = _mysql2.default.createPool({
    host: 'localhost',
    user: 'root',
    password: 'wkdTlqkf',
    database: 'doorlock'
});

function execQuery(query) {
    var def = _q2.default.defer();

    pool.query(query, function (err, rows, fields) {
        if (err) {
            console.log('execQuery Error');
            def.reject(err);
        }
        console.log('execQuery');
        console.log(rows);
        def.resolve(rows);
    });

    return def.promise;
}

function checkDoorlockKey(doorlockID, doorlockKey) {
    var def = _q2.default.defer();

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var query, rows;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        query = 'SELECT * FROM  `doorlock` WHERE  `id` =\'' + doorlockID + '\' AND  `secret_key` =  \'' + doorlockKey + '\'';
                        _context.next = 3;
                        return execQuery(query);

                    case 3:
                        rows = _context.sent;

                        console.log('checkDoorlockKey');
                        console.log(rows);
                        if (rows.length === 1) {
                            def.resolve();
                        } else {
                            def.reject('no match doorlock key'); // @TODO ERROR LIST를 상수로 선언해서 이용.
                        }

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }))();

    return def.promise;
}

function addUser(doorlockID, name) {
    var def = _q2.default.defer();;

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var password, registDate, query, rows;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        password = makeRandomString(20);
                        registDate = Math.floor(+new Date() / 1000);
                        query = 'INSERT INTO `doorlock`.`user` (`id`, `name`, `password`, `registDate`, `doorlock_id`) VALUES (NULL, \'' + name + '\', \'' + password + '\', \'' + registDate + '\', \'' + doorlockID + '\')';
                        _context2.next = 5;
                        return execQuery(query);

                    case 5:
                        rows = _context2.sent;

                        console.log('addUser');
                        console.log(rows);

                        def.resolve({ password: password, registDate: registDate });

                    case 9:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }))();

    return def.promise;
}

function makeRandomString(size) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }return text;
}