'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.login = login;
exports.checkDoorlockKey = checkDoorlockKey;
exports.registUser = registUser;
exports.doorlockInfo = doorlockInfo;
exports.setGCMRegistrationId = setGCMRegistrationId;

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

    console.log(query);

    pool.query(query, function (err, rows, fields) {
        if (err) {
            console.log('execQuery Error');
            def.reject(err);
        }
        console.log('execQuery');
        def.resolve({ rows: rows, fields: fields });
    });

    return def.promise;
}

function login(loginInfo) {
    var def = _q2.default.defer();;

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var columns, query, _ref, rows;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        columns = ['id', 'name', 'password', 'registDate', 'latestAuthDate', 'doorlockId'];
                        query = 'SELECT ' + arrayToSelectQuery(columns) + ' FROM `user` ' + objectToWhereQuery(loginInfo);
                        _context.next = 4;
                        return execQuery(query);

                    case 4:
                        _ref = _context.sent;
                        rows = _ref.rows;

                        if (rows.length === 1) {
                            def.resolve(rows[0]);
                        } else {
                            def.reject('login fail'); // @TODO ERROR LIST를 상수로 선언해서 이용.
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

function checkDoorlockKey(doorlockInfo) {
    var def = _q2.default.defer();

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var query, _ref2, rows;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        query = 'SELECT `id` FROM `doorlock` ' + objectToWhereQuery(doorlockInfo);
                        _context2.next = 3;
                        return execQuery(query);

                    case 3:
                        _ref2 = _context2.sent;
                        rows = _ref2.rows;

                        console.log('checkDoorlockKey');
                        if (rows.length === 1) {
                            def.resolve();
                        } else {
                            def.reject('no match doorlock key'); // @TODO ERROR LIST를 상수로 선언해서 이용.
                        }

                    case 7:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }))();

    return def.promise;
}

function registUser(registInfo) {
    console.log('registUser');
    var def = _q2.default.defer();;

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var query, _ref3, rows;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        console.log('async registUser');
                        registInfo.id = null;
                        console.log('1');
                        registInfo.password = makeRandomString(20);
                        console.log('2');
                        registInfo.registDate = Math.floor(+new Date() / 1000);
                        console.log('3');
                        registInfo.latestAuthDate = registInfo.registDate;
                        console.log('4');

                        console.log(registInfo);
                        query = 'INSERT INTO `doorlock`.`user` ' + objectToInsertQuery(registInfo);

                        console.log(query);

                        _context3.next = 14;
                        return execQuery(query);

                    case 14:
                        _ref3 = _context3.sent;
                        rows = _ref3.rows;


                        registInfo.id = rows.insertId;

                        def.resolve(registInfo);

                    case 18:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }))();

    return def.promise;
}

function doorlockInfo() {
    return (0, _q2.default)();
}

function setGCMRegistrationId(GCMInfo) {
    var def = _q2.default.defer();

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        var query, _ref4, rows;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        query = 'SELECT * FROM  `gcm` ' + objectToWhereQuery({ userId: GCMInfo.userId });
                        _context4.next = 3;
                        return execQuery(query);

                    case 3:
                        _ref4 = _context4.sent;
                        rows = _ref4.rows;


                        if (rows.length >= 1) {
                            //UPDATE
                            query = 'UPDATE `doorlock`.`gcm` ' + objectToUpdateQuery(GCMInfo) + ' ' + objectToWhereQuery({ userId: GCMInfo.userId });
                        } else {
                            //INSERT
                            query = 'INSERT INTO  `doorlock`.`gcm` ' + objectToInsertQuery(GCMInfo);
                        }

                        _context4.next = 8;
                        return execQuery(query);

                    case 8:

                        def.resolve();

                    case 9:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
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

function objectToWhereQuery(obj) {
    var query = [];
    for (var key in obj) {
        var val = obj[key];
        if (val === null || val === undefined) {
            val = 'NULL';
        } else {
            val = '\'' + obj[key] + '\'';
        }

        query.push('`' + key + '` = ' + val);
    }
    return 'WHERE ' + query.join(' AND ');
}

function objectToInsertQuery(obj) {
    var keys = [];
    var vals = [];
    for (var key in obj) {
        var val = obj[key];
        keys.push('`' + key + '`');
        if (val === null || val === undefined) {
            vals.push('NULL');
        } else {
            vals.push('\'' + val + '\'');
        }
    }
    return '(' + keys.join(', ') + ') VALUES (' + vals.join(', ') + ')';
}

function objectToUpdateQuery(obj) {
    var query = [];
    for (var key in obj) {
        var val = obj[key];
        if (val === null || val === undefined) {
            val = 'NULL';
        } else {
            val = '\'' + obj[key] + '\'';
        }

        query.push('`' + key + '` = ' + val);
    }
    return 'SET ' + query.join(', ');
}

function arrayToSelectQuery(arr) {
    return arr.map(function (val) {
        return '`' + val + '`';
    }).join(', ');
}