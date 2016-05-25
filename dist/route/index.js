'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (app) {
    app.use('/rsa', _rsa2.default);
};

var _rsa = require('./rsa');

var _rsa2 = _interopRequireDefault(_rsa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }