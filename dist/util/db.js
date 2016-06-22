/**
 * @module util/db
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * 로그인 시도
 * @method login
 * @param  {object}     loginInfo   id와 password를 가진 객체
 * @return {object}                 { result: 성공/실패여부, user:성공시 유저정보객체 반환, 실패시 null }
 */

var login = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(loginInfo) {
        var columns, query, _ref, rows;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        columns = ['id', 'name', 'password', 'registDate', 'latestAuthDate', 'doorlockId'];
                        query = 'SELECT ' + selectQueryHelper(columns) + ' FROM ' + tableNameQueryHelper('user') + ' ' + whereQueryHelper(loginInfo);
                        _context.next = 4;
                        return (0, _execCacheQuery2.default)(query);

                    case 4:
                        _ref = _context.sent;
                        rows = _ref.rows;
                        //console.log(rows.length);

                        if (!(rows.length !== 1)) {
                            _context.next = 8;
                            break;
                        }

                        return _context.abrupt('return', { result: false, user: null });

                    case 8:
                        return _context.abrupt('return', { result: true, user: rows[0] });

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

/**
 * 도어락 고유키, 아이디 체크
 * @method checkDoorlockKey
 * @param  {object}     doorlockInfo    doorlockId, doorlockKey를 가진 객체
 * @return {boolean}                    일치여부
 */


var checkDoorlockKey = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(doorlockInfo) {
        var query, _ref2, rows;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        query = 'SELECT `id` FROM ' + tableNameQueryHelper('doorlock') + ' ' + whereQueryHelper(doorlockInfo);
                        _context2.next = 3;
                        return (0, _execCacheQuery2.default)(query);

                    case 3:
                        _ref2 = _context2.sent;
                        rows = _ref2.rows;

                        if (!(rows.length !== 1)) {
                            _context2.next = 7;
                            break;
                        }

                        return _context2.abrupt('return', false);

                    case 7:
                        return _context2.abrupt('return', true);

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

/**
 * 유저 등록용 함수
 * @method registUser
 * @param  {object}   registInfo    name, doorlockId를 가진 객체
 * @return {object}                 유저 정보객체(id, password, registDate, latestAuthDate, name, doorlockId)
 */


var registUser = function () {
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

                        query = 'INSERT INTO ' + tableNameQueryHelper('user') + ' ' + insertQueryHelper(registInfo);
                        _context3.next = 7;
                        return (0, _execCacheQuery2.default)(query);

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

/**
 * 특정 유저의 GCMRegistrationId 데이터 갱신
 * @method setGCMRegistrationId
 * @param  {object}             GCMInfo     userId, GCMRegistrationId를 가진 객체
 */

var setGCMRegistrationId = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(GCMInfo) {
        var query, _ref4, rows;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        console.log('GCMInfo', GCMInfo);
                        query = 'SELECT * FROM  ' + tableNameQueryHelper('gcm') + ' ' + whereQueryHelper({ userId: GCMInfo.userId });
                        _context4.next = 4;
                        return (0, _execCacheQuery2.default)(query);

                    case 4:
                        _ref4 = _context4.sent;
                        rows = _ref4.rows;

                        console.log('query', query);
                        if (rows.length >= 1) {
                            //UPDATE
                            query = 'UPDATE ' + tableNameQueryHelper('gcm') + ' ' + updateQueryHelper(GCMInfo) + ' ' + whereQueryHelper({ userId: GCMInfo.userId });
                        } else {
                            //INSERT
                            query = 'INSERT INTO  ' + tableNameQueryHelper('gcm') + ' ' + insertQueryHelper(GCMInfo);
                        }
                        console.log('query', query);
                        _context4.next = 11;
                        return (0, _execCacheQuery2.default)(query);

                    case 11:
                        return _context4.abrupt('return', _context4.sent);

                    case 12:
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

/**
 * 인증기록 저장
 * @method saveHistory
 * @param  {object}     historyInfo     userId, state, authtime를 가진 객체
 * @return {Promise}                    Promise객체
 */


var saveHistory = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(historyInfo) {
        var query;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        query = 'INSERT INTO  ' + tableNameQueryHelper('history') + ' ' + insertQueryHelper((0, _assign2.default)({}, historyInfo, { id: null }));
                        _context5.next = 3;
                        return (0, _execCacheQuery2.default)(query);

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

/**
 * 특정 유저의 최종 인증시간 업데이트
 * @method updateLatestAuthDate
 * @param  {int}        id              업데이트될 user id
 * @param  {int}        latestAuthDate  최종 인증시간
 * @return {Promise}                    Promise객체
 */


var updateLatestAuthDate = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(id, latestAuthDate) {
        var query;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        query = 'UPDATE ' + tableNameQueryHelper('user') + ' ' + updateQueryHelper({ latestAuthDate: latestAuthDate }) + ' ' + whereQueryHelper({ id: id });
                        _context6.next = 3;
                        return (0, _execCacheQuery2.default)(query);

                    case 3:
                        return _context6.abrupt('return', _context6.sent);

                    case 4:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));
    return function updateLatestAuthDate(_x6, _x7) {
        return ref.apply(this, arguments);
    };
}();

/**
 * 특정 doorlockId를 가진 유저의 GCMRegistrationId를 get
 * @method getDoorlockIdOfGCMRegistrationId
 * @param  {int}        doorlockId  특정 doorlock id
 * @return {Promise}                Promise객체
 */


var getDoorlockIdOfGCMRegistrationId = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(doorlockId) {
        var query, _ref5, rows;

        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        query = 'Select gcm.* From ' + tableNameQueryHelper('gcm') + ' INNER JOIN ' + tableNameQueryHelper('user') + ' ON `gcm`.`userId` = `user`.`id` AND `user`.`doorlockId` = \'' + doorlockId + '\'';
                        _context7.next = 3;
                        return (0, _execCacheQuery2.default)(query);

                    case 3:
                        _ref5 = _context7.sent;
                        rows = _ref5.rows;
                        return _context7.abrupt('return', rows.map(function (obj) {
                            return obj.GCMRegistrationId;
                        }));

                    case 6:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));
    return function getDoorlockIdOfGCMRegistrationId(_x8) {
        return ref.apply(this, arguments);
    };
}();

/**
 * 랜덤문자열 생성
 * @method makeRandomString
 * @param  {int}            size 문자열 길이
 * @return {String}              생성된 랜덤문자열
 */


var _execCacheQuery = require('./execCacheQuery');

var _execCacheQuery2 = _interopRequireDefault(_execCacheQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doorlockInfo() {
    return Q();
}function makeRandomString(size) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }return text;
}

/**
 * where 쿼리 제작 헬퍼
 * @method whereQueryHelper
 * @param  {Object}           obj
 * @return {String}
 */
function whereQueryHelper(obj) {
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

/**
 * insert 쿼리 헬퍼
 * @method insertQueryHelper
 * @param  {Object}           obj
 * @return {String}
 */
function insertQueryHelper(obj) {
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

/**
 * update 쿼리 헬퍼
 * @method updateQueryHelper
 * @param  {Object}           obj
 * @return {String}
 */
function updateQueryHelper(obj) {
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

/**
 * select 쿼리 헬퍼
 * @method selectQueryHelper
 * @param  {Array}           arr
 * @return {String}
 */
function selectQueryHelper(arr) {
    return arr.map(function (val) {
        return '`' + val + '`';
    }).join(', ');
}

/**
 * 테이블명 쿼리 헬퍼
 * @method tableNameQueryHelper
 * @param  {String}           tableName
 * @return {String}
 */
function tableNameQueryHelper(tableName) {
    return '`doorlock`.`' + tableName + '`';
}

exports.default = {
    login: login,
    checkDoorlockKey: checkDoorlockKey,
    registUser: registUser,
    doorlockInfo: doorlockInfo,
    setGCMRegistrationId: setGCMRegistrationId,
    saveHistory: saveHistory,
    updateLatestAuthDate: updateLatestAuthDate,
    getDoorlockIdOfGCMRegistrationId: getDoorlockIdOfGCMRegistrationId
};