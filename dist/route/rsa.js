"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _rsa = require("../util/rsa");

var _db = require("../util/db");

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var rsaInfo = (0, _rsa.initRSA)();

setInterval(function () {
    rsaInfo = (0, _rsa.initRSA)();
}, 1000 * 10);

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
                state: 'rsa changed',
                rsaInfo: rsaInfo
            });
            res.end();
            return;
        }
    } catch (e) {
        res.json({
            state: 'rsa changed',
            rsaInfo: rsaInfo
        });
        res.end();
        return;
    }

    req.body.data = JSON.parse((0, _rsa.decodeString)(screetData, rsaInfo.d, rsaInfo.N));

    next();
});

router.post('/regist', function (req, res) {
    var _req$body$data = req.body.data;
    var name = _req$body$data.name;
    var doorlockID = _req$body$data.doorlockID;
    var doorlockKey = _req$body$data.doorlockKey;

    console.log({ name: name, doorlockID: doorlockID, doorlockKey: doorlockKey });

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var _ref, password, registDate;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return (0, _db.checkDoorlockKey)(doorlockID, doorlockKey);

                    case 3:
                        _context.next = 5;
                        return (0, _db.addUser)(doorlockID, name);

                    case 5:
                        _ref = _context.sent;
                        password = _ref.password;
                        registDate = _ref.registDate;


                        console.log({
                            result: 'success',
                            userInfo: {
                                name: name, registDate: registDate,
                                key: password
                            }
                        });

                        res.json({
                            result: 'success',
                            userInfo: {
                                name: name, registDate: registDate,
                                key: password
                            }
                        });
                        res.end();

                        _context.next = 18;
                        break;

                    case 13:
                        _context.prev = 13;
                        _context.t0 = _context["catch"](0);

                        // Handle error
                        res.end();
                        console.error('4');
                        console.error(_context.t0);

                    case 18:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 13]]);
    }))();
});

exports.default = router;