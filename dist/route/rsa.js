/**
 * @module route/user
 */

"use strict";

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

var _rsa2 = _interopRequireDefault(_rsa);

var _db = require('../util/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** http://expressjs.com/en/4x/api.html#router */
var router = _express2.default.Router();

/** @type {int} rsa키 업데이트 주기 */
var resetRsaInfoInterval = 1000 * 100;

/** @type {Object} 공개키 N, e 그리고 rsa키 업데이트 주기 interval 값 */
var serverRsaInfo = void 0;

// rsaInfo 초기화
resetRsaInfo();

// resetRsaInfoInterval 주기로 rsaInfo 초기화
setInterval(resetRsaInfo, resetRsaInfoInterval);

// rsaInfo 값 GET
router.post('/get', function (req, res) {
    res.json({
        state: 'rsaInfo',
        rsaInfo: getPublishRSAInfo()
    }).end();
    return;
});

/**
 * 현 라우터로 들어오는 모든 경로 ( /get 은 제외 )는
 * 이 함수를 지나가게 되며
 * 이 함수는 클라이언트에서 보낸 rsaInfo, screetData 데이터를 이용해
 * 암호화 값을 복호화 하여 req.body저장하여 사용할수 있게 하는 함수이다.
 */
router.use(function (req, res, next) {
    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var _req$body,
        //console.log('rsa/', req.body);
        rsaInfo, screetData, N, e;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _req$body = req.body;
                        rsaInfo = _req$body.rsaInfo;
                        screetData = _req$body.screetData;
                        N = rsaInfo.N;
                        e = rsaInfo.e;

                        // 클라이언트에서 전송한 공개키값들이 불일치시, 올바른 공개키값을 보냄

                        if (!(N != serverRsaInfo.N || e != serverRsaInfo.e)) {
                            _context.next = 8;
                            break;
                        }

                        res.json({
                            state: 'rsaInfo',
                            rsaInfo: getPublishRSAInfo()
                        }).end();
                        return _context.abrupt('return');

                    case 8:
                        _context.next = 10;
                        return _rsa2.default.decodeJSON(screetData, serverRsaInfo.d, serverRsaInfo.N);

                    case 10:
                        req.body = _context.sent;

                        // 다음함수 실행
                        next();
                        return _context.abrupt('return');

                    case 13:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }))();
});

// 로그인
router.post('/login', function (req, res) {
    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var loginInfo, _ref,
        //로그인 시도
        result, user;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        loginInfo = req.body;
                        _context2.next = 3;
                        return _db2.default.login(loginInfo);

                    case 3:
                        _ref = _context2.sent;
                        result = _ref.result;
                        user = _ref.user;


                        if (result) {
                            res.json({
                                result: true,
                                user: user
                            }).end();
                        } else {
                            res.json({
                                result: false
                            }).end();
                        }
                        return _context2.abrupt('return');

                    case 8:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }))();
});

// 유저 등록
router.post('/regist', function (req, res) {
    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var _req$body2, name, doorlockId, doorlockKey, passDoorlockKey, user;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _req$body2 = req.body;
                        name = _req$body2.name;
                        doorlockId = _req$body2.doorlockId;
                        doorlockKey = _req$body2.doorlockKey;
                        //console.log({ name, doorlockId, doorlockKey });

                        // 도어락 고유키, id 체크

                        _context3.next = 6;
                        return _db2.default.checkDoorlockKey({ id: doorlockId, secretKey: doorlockKey });

                    case 6:
                        passDoorlockKey = _context3.sent;

                        if (passDoorlockKey) {
                            _context3.next = 10;
                            break;
                        }

                        res.json({
                            result: false
                        }).end();
                        return _context3.abrupt('return');

                    case 10:
                        _context3.next = 12;
                        return _db2.default.registUser({ doorlockId: doorlockId, name: name });

                    case 12:
                        user = _context3.sent;


                        res.json({
                            result: true,
                            user: user
                        }).end();
                        return _context3.abrupt('return');

                    case 15:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }))();
});

/**
 * 클라이언트에 공개되는 값들을 반환하는 함수.
 * @method getPublishRSAInfo
 * @return {object}          공개값
 */
function getPublishRSAInfo() {
    return {
        N: serverRsaInfo.N,
        e: serverRsaInfo.e,
        interval: resetRsaInfoInterval
    };
}

/**
 * rsa 키값들을 변경하는 함수.
 * @method resetRsaInfo
 * @return {void}
 */
function resetRsaInfo() {
    serverRsaInfo = _rsa2.default.initRSA();
}

exports.default = router;