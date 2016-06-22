/**
 * @module util/rsa
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _func = require("./func.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 공개키(암호화용) N, e 와 개인키(복호화용) N, d 를 생성 (공개키 N == 개인키 N)
 * 참고: https://ko.wikipedia.org/wiki/RSA_암호
 * @method initRSA
 * @return {object} 객체{N, e, d}
 */
function initRSA() {
    // 서로다른 소수 p와 q 생성
    var p = getPromise();
    var q = getPromise();
    while (p == q) {
        q = getPromise();
    }

    // p-1, q-1 계산
    var p_1 = p - 1;
    var q_1 = q - 1;

    // 공개키 N을 구함
    var N = p * q;

    // phiN 값을 구함
    var phiN = p_1 * q_1;

    // phiN보단 작고 phiN과 서로소인 정수 e를 찾는다.
    //console.log('getRelativelyPrime', phiN);
    var e = getRelativelyPrime(phiN);
    //console.log('e', e);

    // 확장된 유클리드 호제법을 이용하여 d * e를 phiN로 나누었을때
    // 나머지가 1인 정수 d를 찾는다.
    //console.log('extendedEuclid');
    var d = extendedEuclid(e, phiN);
    //console.log('d', d);
    return {
        N: N, e: e, d: d
    };
}

/**
 * 복호화 함수
 * @method decodeRSA
 * @param  {int}        code    공개키 N과 e로 암호화된 값
 *                              _.memoize 함수로 이전에 복호화된 값은 캐싱된다.
 * @param  {int}        d       개인키 d
 * @param  {int}        N       개인키 N
 * @return {promise}            promise 객체
 */
function decodeRSA(code, d, N) {
    return new _promise2.default(function (resolve) {
        return resolve(powMod(code, d, N));
    });
}

/**
 * 암호화된 JSON 문자열 복호화 함수 (암호화된 문자열 -> JSON문자열 -> JSON객체)
 * @method decodeJSON
 * @param  {Array}      screetList  암호화된 값 (int배열)
 * @param  {int}        d           개인키 d
 * @param  {int}        N           개인키 N
 * @return {promise}                promise 객체
 */
function decodeJSON(screetList, d, N) {
    //console.log(screetList, d, N);
    return new _promise2.default(function (resolve) {
        var promiseList = [];
        screetList.forEach(function (code) {
            return promiseList.push(decodeRSA(code, d, N));
        });

        var strings = [];
        _promise2.default.all(promiseList).then(function (decodValList) {
            decodValList.forEach(function (val, index) {
                if (index % 2 == 0) {
                    strings.push(String.fromCharCode(parseInt([zeroFill(val, 3), zeroFill(decodValList[index + 1], 3)].join('')) - 3));
                }
            });

            resolve(JSON.parse(strings.join('')).data);
        });
    });
}

/**
 * 10000 까지의 소수 랜덤 반환
 * @method getPromise
 * @return {int}    랜덤한 소수값
 */
var getPromise = function () {
    var promiseNumberList = getPromiseList(10000);
    var promiseNumberListLength = promiseNumberList.length;

    return function () {
        return promiseNumberList[Math.floor(Math.random() * promiseNumberListLength)];
    };
}();

/**
 * 32에서 max 까지의 소수 목록 반환
 * @method getPromiseList
 * @param  {int}    max 최대값
 * @return {Array}      소수 목록
 */
function getPromiseList(max) {
    var sieve = _lodash2.default.fill(Array(max), true);
    var _max = Math.floor(Math.sqrt(max));
    sieve[0] = false;
    sieve[1] = false;

    for (var i = 2; i <= _max; i++) {
        if (sieve[i]) {
            for (var j = i * 2; j <= max; j += i) {
                sieve[j] = false;
            }
        }
    }
    var result = [];
    sieve.forEach(function (check, index, arr) {
        return check && result.push(index);
    });

    return result.filter(function (promise) {
        return promise >= 32;
    }); // N을 1000이상 값으로 설정하기 위함. (32 * 33 > 1000)
}

/**
 * 최대 공약수 함수
 * @method gcd
 * @param  {int}    a
 * @param  {int}    b
 * @return {int}        a와 b의 최대 공약수
 */
function gcd(a, b) {
    return !!b ? gcd(b, a % b) : a;
}

/**
 * 고속 누승 알고리즘 구현.
 * x^p mod(m) 계산
 * 참고: http://a.nex.kr.pe/wordpress/2015/10/21/제-6강-고속-누승-알고리즘과-모듈러/
 * @method powMod
 * @param  {int}    x   피제수
 * @param  {int}    p   지수
 * @param  {int}    m   제수
 * @return {int}        x^p mod(m) 계산 결과값
 */
function powMod(a, b, n) {
    var result = 1;

    while (b) {
        if (b & 1) {
            result = result * a % n;
        }
        b = parseInt(b / 2);
        a = a * a % n;
    }
    return result;
}

/**
 * num보단 작고 num과 서로소인 랜덤한 정수를 찾는다.
 * @method getRelativelyPrime
 * @param  {int}           num [description]
 * @return {int}               [description]
 */
function getRelativelyPrime(num) {
    while (true) {
        var result = 4 + Math.floor(Math.random() * (num - 4));
        if (gcd(num, result) === 1) {
            return result;
        }
    }
}

/**
 * 확장된 유클리드 알고리즘
 * http://bbolmin.tistory.com/45
 * @method extendedEuclid
 * @param  {int}    a   r1
 * @param  {int}    b   r2
 * @return {int}        t1
 */
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

/**
 * number값을 n자리수만큼 빈곳을 0으로 채운 문자열 반환.
 * @method zeroFill
 * @param  {int}    number  바꿀 수
 * @param  {int}    n       자리수
 * @return {string}         0으로 채워진 문자열
 * @example zeroFill(10, 4) = '0010'
 */
function zeroFill(number, n) {
    n -= number.toString().length;
    if (n > 0) {
        return new Array(n + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

//@TODO 아래함수들은 삭제예정.

/**
 * 확장된 유클리드 알고리즘
 * http://a.nex.kr.pe/wordpress/2015/10/21/제-5강-확장-유클리드-알고리즘-function/
 * @method oldExtendedEuclid
 * @param  {int}    a   r1
 * @param  {int}    b   r2
 * @return {int}        t1
 */
function oldExtendedEuclid(a, b) {
    var r1 = void 0,
        r2 = void 0,
        q = void 0,
        r = void 0,
        t = void 0,
        t1 = void 0,
        t2 = void 0;
    r1 = a;
    r2 = b;
    t1 = 0;
    t2 = 1;

    while (r1 != 1) {
        q = r2 / r1;
        r = r2 - r1 * q;
        t = t1 - t2 * q;
        r2 = r1;
        r1 = r;
        t1 = t2;
        t2 = t;
    }

    if (t2 < 0) {
        t2 = t2 + b;
    }

    return t2;
}

/**
 * Successive Squaring 구현.
 * x^p mod(m) 계산
 * 참고: http://egloos.zum.com/dragon1307/v/5159065
 * @method oldPowMod
 * @param  {int}    x   피제수
 * @param  {int}    p   지수
 * @param  {int}    m   제수
 * @return {int}        x^p mod(m) 계산 결과값
 */
function oldPowMod(x, p, m) {
    // oldPowMod(7, 327, 853) 을 예시로 들고 주석 작성

    // 지수값p를 2진수로 변환후 1인 값에 그 인덱스값을 넣는다.
    // 327 -> 101000111 -> [1, 0, 1, 0, 0, 0, 1, 1, 1] ->
    // [1, 1, 1, 0, 0, 0, 1, 0, 1] -> 111000101 ->
    // [0, 1, 2, null, null, null, 6, null, 8]
    var binary = p.toString(2).split('').reverse().map(function (v, i) {
        return v == '1' ? i : null;
    });

    // 지수값p 2진수의 길이만큼 x^n(mod m) 값을 배열에 저장. (0 <= n < p값 2진수 길이)
    // 7^(2^0) ≡ 7 ≡ 7 (mod 853)
    // 7^(2^1) ≡ (7^(2^0))^2 ≡ 7^2 ≡ 49 ≡ 49 (mod 853)
    // 7^(2^2) ≡ (7^(2^1))^2 ≡ 49^2 ≡ 2401 ≡ 695 (mod 853)
    // 7^(2^3) ≡ (7^(2^2))^2 ≡ 695^2 ≡ 483025 ≡ 227 (mod 853)
    // 7^(2^4) ≡ (7^(2^3))^2 ≡ 227^2 ≡ 51529 ≡ 349 (mod 853)
    // 7^(2^5) ≡ (7^(2^4))^2 ≡ 349^2 ≡ 121801 ≡ 675 (mod 853)
    // 7^(2^6) ≡ (7^(2^5))^2 ≡ 675^2 ≡ 455625 ≡ 123 (mod 853)
    // 7^(2^7) ≡ (7^(2^6))^2 ≡ 123^2 ≡ 15129 ≡ 628 (mod 853)
    // 7^(2^8) ≡ (7^(2^7))^2 ≡ 628^2 ≡ 394384 ≡ 298 (mod 853)
    // [7, 49, 695, 227, 349, 675, 123, 628, 298]
    var binaryModList = getPowModBinaryList(binary.length, x, m);

    // 지수값 p를 2의 멱승형태로 나타내기
    // 327 = 2^8 + 2^7 + 2^2 +2^1 + 2^0
    // 이를 이용하여 mod계산을 제외한 본래식을 변형
    // 7^327 = 7^(2^8 + 2^7 + 2^2 + 2^1 + 2^0)
    // = 7^(2^8) * 7^(2^7) * 7^(2^2) * 7^(2^1) * 7^(2^0)
    // 여기에 mod계산을 추가
    // (7^(2^8) * 7^(2^7) * 7^(2^2) * 7^(2^1) * 7^(2^0))(mod 853)
    // = (7^(2^8))(mod 853) * (7^(2^7))(mod 853) * (7^(2^2))(mod 853) *
    // (7^(2^1))(mod 853) * (7^(2^0))(mod 853)
    // = 298(mod 853) * 123(mod 853) * 695(mod 853) * 49(mod 853) * 7(mod 853)
    //
    // 위 방법을 아래와 같이 배열로 표현
    // [0,  1,  2,   null,   null,   null,   6,     null,   8] 와
    // [7,  49, 695, 227,    349,    675,    123,   628,    298] 를 조합하여
    // [7,  49, 695,                         123,           298] 를 만들어냄
    binary = binary.filter(function (v) {
        return v !== null;
    }).map(function (v) {
        return binaryModList[v];
    });

    // 아래와 같이 계산하여 결과 도출
    // 7(mod 853) * 49(mod 853) * 123(mod 853) * 298(mod 853) * 695(mod 853)
    // = ((((7(mod 853) * 49)(mod 853) * 123)(mod 853) * 298)(mod 853) * 695)(mod 853)
    return binary.reduce(function (result, val) {
        return mod(result * val, m);
    }, 1);
}

/**
 * max값 크기의 배열에 num^(2^n) mod(m) 의 값을 넣는다.
 * @method getPowModBinaryList
 * @param  {int}    max 계산 배열 크기
 * @param  {int}    num 피제수
 * @param  {int}    m   제수
 * @return {Array}      계산 결과값 배열
 */
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

/**
 * 나머지 연산 함수
 * @method mod
 * @param  {int}    x   피제수
 * @param  {int}    m   제수
 * @return {int}        x / m 나머지값
 */
function mod(x, m) {
    return x % m;
}

exports.default = {
    initRSA: initRSA, decodeJSON: decodeJSON
};