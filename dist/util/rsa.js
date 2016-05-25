"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initRSA = initRSA;
exports.decodeString = decodeString;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPromise = function () {
    var promiseNumberList = getPromiseList(10000);
    //promiseNumberList = promiseNumberList.slice(-3, -1);
    var promiseNumberListLength = promiseNumberList.length;

    return function () {
        return promiseNumberList[Math.floor(Math.random() * promiseNumberListLength)];
    };
}();

function getPromiseList(n) {
    var sieve = _lodash2.default.fill(Array(n), true);
    var max = Math.floor(Math.sqrt(n));
    sieve[0] = false;
    sieve[1] = false;
    for (var i = 2; i <= max; i++) {
        if (sieve[i]) {
            for (var j = i * 2; j <= n; j += i) {
                sieve[j] = false;
            }
        }
    }
    var result = [];
    sieve.forEach(function (check, index, arr) {
        return check && result.push(index);
    });

    return result.filter(function (n) {
        return n >= 32;
    }); // N을 1000이상 값으로 설정하기 위함.
}

function gcd(a, b) {
    return !!b ? gcd(b, a % b) : a;
};

function mod(x, m) {
    return x % m;
}

function powMod(x, p, m) {
    var binary = p.toString(2).split('').reverse().map(function (v, i) {
        return v == '1' ? i : -1;
    });
    var binaryModList = getPowModBinaryList(binary.length, x, m);
    binary = binary.filter(function (v) {
        return v >= 0;
    }).map(function (v) {
        return binaryModList[v];
    });
    return binary.reduce(function (result, val) {
        return mod(result * val, m);
    }, 1);
}

function getPowModBinaryList(max, num, m) {
    var binary = _lodash2.default.fill(Array(max - 1), true);
    var result = [num];
    binary.reduce(function (pre) {
        var val = mod(Math.pow(pre, 2), m);
        result.push(val);
        return val;
    }, num);
    return result;
}

function getRelativelyPrime(num) {
    while (true) {
        var result = 4 + Math.floor(Math.random() * (num - 4));
        if (gcd(num, result) === 1) {
            return result;
        }
    }
}

function extendedEuclid(r1, r2) {
    if (r2 > r1) {
        var _tmp = r1;
        r1 = r2;
        r2 = _tmp;
    }
    var s1 = 1;
    var s2 = 0;
    var t1 = 0;
    var t2 = 1;
    var tmp = r1;

    while (r2) {
        var q = Math.floor(r1 / r2);
        var r = Math.floor(r1 % r2);
        var s = s1 - q * s2;
        var t = t1 - q * t2;

        r1 = r2;
        r2 = r;
        s1 = s2;
        s2 = s;
        t1 = t2;
        t2 = t;
    }

    if (t1 < 0) {
        t1 += tmp;
    }
    return t1;
}

function initRSA() {
    var p = getPromise();
    var q = getPromise();
    while (p == q) {
        q = getPromise();
    }

    var p_1 = p - 1;
    var q_1 = q - 1;

    var N = p * q;
    var phiN = p_1 * q_1;
    var e = getRelativelyPrime(phiN);
    var d = extendedEuclid(e, phiN);

    return {
        N: N, e: e, d: d
    };
}

function incodeRSA(e, d, num) {
    var code = powMod(num, e, N);

    return {
        N: N, e: e, d: d, code: code
    };
}

function decodeRSA(code, d, N) {
    return powMod(code, d, N);
}

function decodeString(screet, d, N) {
    var decodVal = [];
    screet.forEach(function (code) {
        var val = powMod(code, d, N);
        decodVal.push(val);
    });

    var unicodes = [];

    decodVal.forEach(function (val, index) {
        var len = unicodes.length;
        if (index % 2 == 0) {
            unicodes.push(parseInt(zeroFill(val, 3) + '' + zeroFill(decodVal[index + 1], 3)) - 3);
        }
    });

    var strings = '';

    unicodes.forEach(function (unicode) {
        strings += String.fromCharCode(unicode);
    });

    return strings;
}

// 문자를 유니코드로 변경.
// 3글자씩 자른다.
// 0과 1은 암호화가 안되므로 암호화전 +2 복호화 마지막에 -2를 한다.
// 무조건 6자리를 1개문자로 본다. 빈곳은 fill zero

function zeroFill(number, n) {
    n -= number.toString().length;
    if (n > 0) {
        return new Array(n + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}