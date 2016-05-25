"use strict"

import _ from "lodash";

let getPromise = (function(){
    let promiseNumberList       = getPromiseList(10000);
    //promiseNumberList = promiseNumberList.slice(-3, -1);
    let promiseNumberListLength = promiseNumberList.length;

    return function(){
        return promiseNumberList[Math.floor(Math.random() * promiseNumberListLength)]
    }
})()

function getPromiseList(n){
    let sieve = _.fill(Array(n), true);
    let max = Math.floor(Math.sqrt(n));
    sieve[0] = false;
    sieve[1] = false;
    for(let i = 2 ; i <= max ; i++){
        if(sieve[i]){
            for(let j = i * 2 ; j <= n ; j += i){
                sieve[j] = false;
            }
        }
    }
    let result = [];
    sieve.forEach((check, index, arr)=>((check) && result.push(index)));

    return result.filter(n => n >= 32); // N을 1000이상 값으로 설정하기 위함.
}

function gcd(a, b) {
    return !!b ? gcd(b, a % b) : a;
};

function mod(x, m){
    return x%m;
}

function powMod(x, p, m){
    let binary = (p).toString(2).split('').reverse().map((v, i) => (v == '1') ? i : -1);
    let binaryModList = getPowModBinaryList(binary.length, x, m);
    binary = binary.filter(v => v >= 0).map(v => binaryModList[v]);
    return binary.reduce((result, val) => mod(result * val, m), 1);
}

function getPowModBinaryList(max, num, m){
    let binary = _.fill(Array(max - 1), true);
    let result = [num];
    binary.reduce(pre => {
      let val = mod(Math.pow(pre, 2), m);
      result.push(val);
      return val;
    }, num)
    return result;
}

function getRelativelyPrime(num){
    while(true){
        let result = 4 + Math.floor( Math.random() * (num - 4));
        if(gcd(num, result) === 1) {
            return result;
        }
    }
}

function extendedEuclid(r1, r2){
    if(r2 > r1){
        let tmp = r1;
        r1 = r2;
        r2 = tmp;
    }
    let s1  = 1;
    let s2  = 0;
    let t1  = 0;
    let t2  = 1;
    let tmp = r1;

    while(r2){
        let q = Math.floor(r1 / r2);
        let r = Math.floor(r1 % r2);
        let s = s1 - q*s2;
        let t = t1 - q*t2;

        r1 = r2;
        r2 = r;
        s1 = s2;
        s2 = s;
        t1 = t2;
        t2 = t;
    }

    if(t1 < 0){
        t1 += tmp;
    }
    return t1;
}

export function initRSA(){
    let p = getPromise();
    let q = getPromise();
    while(p == q){
        q = getPromise();
    }

    let p_1 = p-1;
    let q_1 = q-1;

    let N = p * q;
    let phiN =  p_1 * q_1;
    let e = getRelativelyPrime(phiN);
    let d = extendedEuclid(e, phiN)

    return {
        N, e, d
    }
}

function incodeRSA(e, d, num){
    let code = powMod(num, e, N);

    return {
        N, e, d, code
    }
}

function decodeRSA(code, d, N){
    return powMod(code, d, N);
}

export function decodeString(screet, d, N){
    let decodVal = [];
    screet.forEach((code) => {
        let val = powMod(code, d, N);
        decodVal.push(val);
    })

    let unicodes = [];

    decodVal.forEach((val, index) => {
        let len = unicodes.length;
        if(index % 2 == 0){
            unicodes.push(parseInt(zeroFill(val, 3) + '' + zeroFill(decodVal[index + 1], 3)) - 3);
        }
    })

    let strings = '';

    unicodes.forEach(unicode => {
        strings += String.fromCharCode(unicode);
    })

    return strings;
}

// 문자를 유니코드로 변경.
// 3글자씩 자른다.
// 0과 1은 암호화가 안되므로 암호화전 +2 복호화 마지막에 -2를 한다.
// 무조건 6자리를 1개문자로 본다. 빈곳은 fill zero

function zeroFill(number, n){
    n -= number.toString().length;
    if ( n > 0 )
    {
        return new Array( n + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number + ""; // always return a string
}
