/**
 * @module route/user
 */

"use strict"

import express from 'express';

import rsa from '../util/rsa';
import db from '../util/db';

/** http://expressjs.com/en/4x/api.html#router */
const router = express.Router();

/** @type {int} rsa키 업데이트 주기 */
const resetRsaInfoInterval = 1000 * 100;

/** @type {Object} 공개키 N, e 그리고 rsa키 업데이트 주기 interval 값 */
let serverRsaInfo;

// rsaInfo 초기화
resetRsaInfo();

// resetRsaInfoInterval 주기로 rsaInfo 초기화
setInterval(resetRsaInfo, resetRsaInfoInterval)

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
router.use((req, res, next)=>(async function () {
    //console.log('rsa/', req.body);
    let { rsaInfo, screetData } = req.body;
    let { N, e }                = rsaInfo;

    // 클라이언트에서 전송한 공개키값들이 불일치시, 올바른 공개키값을 보냄
    if( N != serverRsaInfo.N || e != serverRsaInfo.e ){
        res.json({
            state: 'rsaInfo',
            rsaInfo: getPublishRSAInfo()
        }).end();
        return;
    }

    //복호화

    //console.log('decodeJSON');
    req.body = await rsa.decodeJSON(screetData, serverRsaInfo.d, serverRsaInfo.N);
    // 다음함수 실행
    next();
    return;
})());

// 로그인
router.post('/login', (req, res)=>(async function () {
    let loginInfo      = req.body;
    //로그인 시도
    let {result, user} = await db.login(loginInfo);

    if(result){
        res.json({
            result : true,
            user
        }).end();
    }
    else{
        res.json({
            result : false
        }).end();
    }
    return;
})());

// 유저 등록
router.post('/regist', (req, res)=>(async function () {
    let { name, doorlockId, doorlockKey } = req.body;
    //console.log({ name, doorlockId, doorlockKey });

    // 도어락 고유키, id 체크
    let passDoorlockKey = await db.checkDoorlockKey({ id: doorlockId, secretKey: doorlockKey });

    // 도어락 고유키와 id가 올바르지 않을경우
    if(!passDoorlockKey){
        res.json({
            result : false
        }).end();
        return;
    }

    // 유저등록
    let user = await db.registUser({ doorlockId, name });

    res.json({
        result : true,
        user
    }).end();
    return;
})());

/**
 * 클라이언트에 공개되는 값들을 반환하는 함수.
 * @method getPublishRSAInfo
 * @return {object}          공개값
 */
function getPublishRSAInfo(){
    return {
        N        : serverRsaInfo.N,
        e        : serverRsaInfo.e,
        interval : resetRsaInfoInterval
    }
}

/**
 * rsa 키값들을 변경하는 함수.
 * @method resetRsaInfo
 * @return {void}
 */
function resetRsaInfo(){
    serverRsaInfo = rsa.initRSA();
}

export default router;
