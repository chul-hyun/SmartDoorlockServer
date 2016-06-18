/**
 * @module route
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {
  app.use('/rsa', _rsa2.default);
  app.use('/rsa/user', _user2.default);
};

var _rsa = require('./rsa');

var _rsa2 = _interopRequireDefault(_rsa);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }