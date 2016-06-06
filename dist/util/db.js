'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.saveHistory = exports.setGCMRegistrationId = exports.registUser = exports.checkDoorlockKey = exports.login = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var login = exports.login = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(loginInfo) {
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

                        if (!(rows.length !== 1)) {
                            _context.next = 8;
                            break;
                        }

                        throw new Error('login fail');

                    case 8:
                        return _context.abrupt('return', rows[0]);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
    return function login(_x) {
        return ref.apply(this, arguments);
    };
}();

var checkDoorlockKey = exports.checkDoorlockKey = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(doorlockInfo) {
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

                        if (!(rows.length !== 1)) {
                            _context2.next = 7;
                            break;
                        }

                        throw new Error('no match doorlock key');

                    case 7:
                        return _context2.abrupt('return');

                    case 8:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));
    return function checkDoorlockKey(_x2) {
        return ref.apply(this, arguments);
    };
}();

var registUser = exports.registUser = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(registInfo) {
        var query, _ref3, rows;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        registInfo.id = null;
                        registInfo.password = makeRandomString(20);
                        registInfo.registDate = Math.floor(+new Date() / 1000);
                        registInfo.latestAuthDate = registInfo.registDate;

                        query = 'INSERT INTO `doorlock`.`user` ' + objectToInsertQuery(registInfo);
                        _context3.next = 7;
                        return execQuery(query);

                    case 7:
                        _ref3 = _context3.sent;
                        rows = _ref3.rows;


                        registInfo.id = rows.insertId;

                        return _context3.abrupt('return', registInfo);

                    case 11:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));
    return function registUser(_x3) {
        return ref.apply(this, arguments);
    };
}();

var setGCMRegistrationId = exports.setGCMRegistrationId = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(GCMInfo) {
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
                        return _context4.abrupt('return', _context4.sent);

                    case 9:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));
    return function setGCMRegistrationId(_x4) {
        return ref.apply(this, arguments);
    };
}();

var saveHistory = exports.saveHistory = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref5) {
        var userId = _ref5.userId;
        var state = _ref5.state;
        var query;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        query = 'INSERT INTO  `doorlock`.`history` ' + objectToInsertQuery({ userId: userId, state: state, id: null, authtime: getNowDateTime() });
                        _context5.next = 3;
                        return execQuery(query);

                    case 3:
                        return _context5.abrupt('return', _context5.sent);

                    case 4:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));
    return function saveHistory(_x5) {
        return ref.apply(this, arguments);
    };
}();

exports.doorlockInfo = doorlockInfo;

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

function doorlockInfo() {
    return (0, _q2.default)();
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

function getNowDateTime() {
    return parseInt(+new Date() / 1000);
}