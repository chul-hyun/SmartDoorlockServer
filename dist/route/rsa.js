'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _rsa = require('../util/rsa');

var rsa = _interopRequireWildcard(_rsa);

var _db = require('../util/db');

var db = _interopRequireWildcard(_db);

var _tcp = require('../util/tcp');

var tcp = _interopRequireWildcard(_tcp);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import * as gcm from '../util/gcm'

var router = _express2.default.Router();

var rsaInfo = rsa.initRSA();

var interval = 1000 * 10;

setInterval(function () {
    rsaInfo = rsa.initRSA();
}, interval);

router.post('/get', function (req, res) {
    res.json({
        state: 'rsaInfo',
        rsaInfo: getPublishRSAInfo()
    });
    res.end();
});

// middleware that is specific to this router
router.use(function (req, res, next) {
    console.log(req.body);
    var _req$body = req.body;
    var N = _req$body.N;
    var e = _req$body.e;
    var screetData = _req$body.screetData;

    try {
        if (req.body.rsaInfo.N != rsaInfo.N || req.body.rsaInfo.e != rsaInfo.e) {
            res.json({
                state: 'rsaInfo',
                rsaInfo: getPublishRSAInfo()
            });
            res.end();
            return;
        }
    } catch (e) {
        res.json({
            state: 'rsaInfo',
            rsaInfo: getPublishRSAInfo()
        });
        res.end();
        return;
    }

    req.body.data = JSON.parse(rsa.decodeString(screetData, rsaInfo.d, rsaInfo.N));

    next();
});

router.post('/login', function (req, res) {
    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var loginInfo, user;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        loginInfo = req.body.data;
                        _context.next = 4;
                        return db.login(loginInfo);

                    case 4:
                        user = _context.sent;


                        console.log({
                            result: true,
                            user: user
                        });

                        res.json({
                            result: true,
                            user: user
                        });
                        res.end();

                        _context.next = 15;
                        break;

                    case 10:
                        _context.prev = 10;
                        _context.t0 = _context['catch'](0);

                        // Handle error
                        res.json({
                            result: false
                        });
                        res.end();
                        console.error(_context.t0);

                    case 15:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 10]]);
    }))();
});

router.post('/regist', function (req, res) {
    var _req$body$data = req.body.data;
    var name = _req$body$data.name;
    var doorlockId = _req$body$data.doorlockId;
    var doorlockKey = _req$body$data.doorlockKey;

    console.log({ name: name, doorlockId: doorlockId, doorlockKey: doorlockKey });

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var user;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return db.checkDoorlockKey({ id: doorlockId, secretKey: doorlockKey });

                    case 3:

                        console.log('registUser start');
                        _context2.next = 6;
                        return db.registUser({ doorlockId: doorlockId, name: name });

                    case 6:
                        user = _context2.sent;

                        console.log('registUser end');

                        console.log({
                            result: true,
                            user: user
                        });

                        res.json({
                            result: true,
                            user: user
                        });
                        res.end();

                        _context2.next = 18;
                        break;

                    case 13:
                        _context2.prev = 13;
                        _context2.t0 = _context2['catch'](0);

                        // Handle error
                        res.json({
                            result: false
                        });
                        res.end();
                        console.error(_context2.t0);

                    case 18:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 13]]);
    }))();
});

router.post('/unlock', function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res) {
        var loginInfo, user;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        loginInfo = req.body.data;
                        user = void 0;
                        _context3.prev = 2;
                        _context3.next = 5;
                        return db.login(loginInfo);

                    case 5:
                        user = _context3.sent;

                        tcp.sendData('dooropen');
                        _context3.next = 16;
                        break;

                    case 9:
                        _context3.prev = 9;
                        _context3.t0 = _context3['catch'](2);

                        // Handle error
                        res.json({
                            result: false
                        });
                        res.end();

                        _context3.next = 15;
                        return db.saveHistory({ userId: null, state: 'fail' });

                    case 15:

                        //@TODO user.doorlockId 를 가진 user의 GCMRegistrationId로 send GCM

                        console.error(_context3.t0);

                    case 16:
                        _context3.next = 18;
                        return db.saveHistory({ userId: user.id, state: 'success' });

                    case 18:

                        res.json({
                            result: true
                        });
                        res.end();

                        //@TODO user.doorlockId 를 가진 user의 GCMRegistrationId로 send GCM

                    case 20:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[2, 9]]);
    }));
    return function (_x, _x2) {
        return ref.apply(this, arguments);
    };
}());

router.post('/setGCMRegistrationId', function (req, res) {
    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        var _req$body$data2, //@TODO async 를 위 function (req, res) 함수랑 합쳐보기
        loginInfo, GCMRegistrationId, user;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.prev = 0;
                        _req$body$data2 = req.body.data;
                        loginInfo = _req$body$data2.loginInfo;
                        GCMRegistrationId = _req$body$data2.GCMRegistrationId;
                        _context4.next = 6;
                        return db.login(loginInfo);

                    case 6:
                        user = _context4.sent;
                        _context4.next = 9;
                        return db.setGCMRegistrationId({ userId: user.id, GCMRegistrationId: GCMRegistrationId });

                    case 9:

                        res.json({
                            result: true
                        });
                        res.end();

                        _context4.next = 18;
                        break;

                    case 13:
                        _context4.prev = 13;
                        _context4.t0 = _context4['catch'](0);

                        // Handle error
                        res.json({
                            result: false
                        });
                        res.end();
                        console.error(_context4.t0);

                    case 18:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this, [[0, 13]]);
    }))();
});

function getPublishRSAInfo() {
    return {
        N: rsaInfo.N,
        e: rsaInfo.e,
        interval: interval
    };
}

exports.default = router;