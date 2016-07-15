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
        var columns, query, _ref2, rows;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        columns = ['id'];
                        query = 'SELECT ' + selectQueryHelper(columns) + ' FROM ' + tableNameQueryHelper('doorlock') + ' ' + whereQueryHelper(doorlockInfo);
                        _context2.next = 4;
                        return (0, _execCacheQuery2.default)(query);

                    case 4:
                        _ref2 = _context2.sent;
                        rows = _ref2.rows;

                        if (!(rows.length !== 1)) {
                            _context2.next = 8;
                            break;
                        }

                        return _context2.abrupt('return', false);

                    case 8:
                        return _context2.abrupt('return', true);

                    case 9:
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
                        registInfo.GCMRegistrationId = null;
                        registInfo.password = makeRandomString(20);
                        registInfo.registDate = Math.floor(+new Date() / 1000);
                        registInfo.latestAuthDate = registInfo.registDate;
                        registInfo.state = 'registed';

                        query = 'INSERT INTO ' + tableNameQueryHelper('user') + ' ' + insertQueryHelper(registInfo);
                        _context3.next = 9;
                        return (0, _execCacheQuery2.default)(query);

                    case 9:
                        _ref3 = _context3.sent;
                        rows = _ref3.rows;


                        registInfo.id = rows.insertId;

                        return _context3.abrupt('return', registInfo);

                    case 13:
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

//@TODO 주석작성


var unregistUser = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(userId) {
        var query;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        query = 'UPDATE ' + tableNameQueryHelper('user') + ' ' + updateQueryHelper({ state: 'unregisted' }) + ' ' + whereQueryHelper({ id: userId });
                        _context4.next = 3;
                        return (0, _execCacheQuery2.default)(query);

                    case 3:
                        return _context4.abrupt('return', _context4.sent);

                    case 4:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));
    return function unregistUser(_x4) {
        return ref.apply(this, arguments);
    };
}();

/**
 * 특정 유저의 GCMRegistrationId 데이터 갱신
 * @method setGCMRegistrationId
 * @param  {object}             GCMInfo     userId, GCMRegistrationId를 가진 객체
 */

var setGCMRegistrationId = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(GCMInfo) {
        var query;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        query = 'UPDATE ' + tableNameQueryHelper('user') + ' ' + updateQueryHelper({ GCMRegistrationId: GCMInfo.GCMRegistrationId }) + ' ' + whereQueryHelper({ id: GCMInfo.userId });
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
    return function setGCMRegistrationId(_x5) {
        return ref.apply(this, arguments);
    };
}();

/**
 * 인증기록 저장
 * @method saveHistory
 * @param  {object}     historyInfo     userId, doorlockId, state, authtime를 가진 객체
 * @return {Promise}                    Promise객체
 */


var saveHistory = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(historyInfo) {
        var query;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        query = 'INSERT INTO  ' + tableNameQueryHelper('history') + ' ' + insertQueryHelper((0, _assign2.default)({}, historyInfo, { id: null }));
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
    return function saveHistory(_x6) {
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
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(id, latestAuthDate) {
        var query;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        query = 'UPDATE ' + tableNameQueryHelper('user') + ' ' + updateQueryHelper({ latestAuthDate: latestAuthDate }) + ' ' + whereQueryHelper({ id: id });
                        _context7.next = 3;
                        return (0, _execCacheQuery2.default)(query);

                    case 3:
                        return _context7.abrupt('return', _context7.sent);

                    case 4:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));
    return function updateLatestAuthDate(_x7, _x8) {
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
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(doorlockId) {
        var columns, query, _ref4, rows;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        columns = ['GCMRegistrationId'];
                        query = 'SELECT ' + selectQueryHelper(columns) + ' FROM ' + tableNameQueryHelper('user') + ' ' + whereQueryHelper({ doorlockId: doorlockId, state: 'registed' });
                        _context8.next = 4;
                        return (0, _execCacheQuery2.default)(query);

                    case 4:
                        _ref4 = _context8.sent;
                        rows = _ref4.rows;
                        return _context8.abrupt('return', rows.map(function (obj) {
                            return obj.GCMRegistrationId;
                        }));

                    case 7:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));
    return function getDoorlockIdOfGCMRegistrationId(_x9) {
        return ref.apply(this, arguments);
    };
}();

//UPDATE  `doorlock`.`user` SET  `name` =  'test2' WHERE  `user`.`id` =98;
//@TODO 주석작성


var changeName = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(id, name) {
        var query;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        query = 'UPDATE ' + tableNameQueryHelper('user') + ' ' + updateQueryHelper({ name: name }) + ' ' + whereQueryHelper({ id: id });
                        _context9.next = 3;
                        return (0, _execCacheQuery2.default)(query);

                    case 3:
                        return _context9.abrupt('return', _context9.sent);

                    case 4:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));
    return function changeName(_x10, _x11) {
        return ref.apply(this, arguments);
    };
}();

//SELECT `id`,`name`,`registDate`,`latestAuthDate` FROM `user` WHERE `doorlockId` = 2
//@TODO 주석작성


var getUsers = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(doorlockId) {
        var columns, query, _ref5, rows;

        return _regenerator2.default.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        columns = ['id', 'name', 'registDate', 'latestAuthDate'];
                        query = 'SELECT ' + selectQueryHelper(columns) + ' FROM ' + tableNameQueryHelper('user') + ' ' + whereQueryHelper({ doorlockId: doorlockId });
                        _context10.next = 4;
                        return (0, _execCacheQuery2.default)(query);

                    case 4:
                        _ref5 = _context10.sent;
                        rows = _ref5.rows;
                        return _context10.abrupt('return', rows.map(function (obj) {
                            return obj;
                        }));

                    case 7:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    }));
    return function getUsers(_x12) {
        return ref.apply(this, arguments);
    };
}();

//@TODO 주석작성


var getHistory = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(doorlockId) {
        var query, _ref6, rows;

        return _regenerator2.default.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        query = 'SELECT history.*, user.name From ' + tableNameQueryHelper('history') + ' LEFT JOIN ' + tableNameQueryHelper('user') + ' ON `history`.`userId` = `user`.`id` WHERE `history`.`doorlockId` = \'' + doorlockId + '\' ORDER BY  `history`.`authtime` ASC';

                        console.log(query);
                        _context11.next = 4;
                        return (0, _execCacheQuery2.default)(query);

                    case 4:
                        _ref6 = _context11.sent;
                        rows = _ref6.rows;
                        return _context11.abrupt('return', rows.map(function (obj) {
                            return obj;
                        }));

                    case 7:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee11, this);
    }));
    return function getHistory(_x13) {
        return ref.apply(this, arguments);
    };
}();

//@TODO 주석작성
//SELECT * FROM  `history` WHERE `userId` =98 AND `authtime` >100 AND `state` = 'success'


var getHistoryFilter = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(doorlockId, filter) {
        var query, _ref7, rows;

        return _regenerator2.default.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        query = 'SELECT history.*, user.name From ' + tableNameQueryHelper('history') + ' LEFT JOIN ' + tableNameQueryHelper('user') + ' ON `history`.`userId` = `user`.`id` WHERE `history`.`doorlockId` = \'' + doorlockId + '\'';


                        if (filter.userID > 0) {
                            query += ' AND `history`.`userId` = \'' + filter.userID + '\'';
                        }

                        query += ' AND `history`.`authtime` >= ' + filter.startDate;

                        query += ' AND `history`.`authtime` <= ' + filter.endDate;

                        if (filter.searchState !== false) {
                            query += ' AND `history`.`state` = \'' + filter.searchState + '\'';
                        }
                        query += ' ORDER BY  `history`.`authtime` ASC';

                        _context12.next = 8;
                        return (0, _execCacheQuery2.default)(query);

                    case 8:
                        _ref7 = _context12.sent;
                        rows = _ref7.rows;

                        console.log(query);
                        return _context12.abrupt('return', rows.map(function (obj) {
                            return obj;
                        }));

                    case 12:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, this);
    }));
    return function getHistoryFilter(_x14, _x15) {
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
    unregistUser: unregistUser,
    doorlockInfo: doorlockInfo,
    setGCMRegistrationId: setGCMRegistrationId,
    saveHistory: saveHistory,
    updateLatestAuthDate: updateLatestAuthDate,
    getDoorlockIdOfGCMRegistrationId: getDoorlockIdOfGCMRegistrationId,
    changeName: changeName,
    getUsers: getUsers,
    getHistory: getHistory,
    getHistoryFilter: getHistoryFilter
};