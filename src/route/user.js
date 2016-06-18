/**
 * @module route/user
 */

"use strict"

import express from 'express';

import db from '../util/db';
import tcp from '../util/tcp'
import gcm from '../util/gcm'

/** http://expressjs.com/en/4x/api.html#router */
const router = express.Router();

/**
 * 현 라우터로 들어오는 모든 경로는
 * 이 함수를 지나가게 되며
 * 이 함수는 클라이언트에서 보낸 loginInfo 데이터를 이용해
 * 로그인을 시도, 실패시 loginFailed : true를 보내고 종료하게 된다.
 * 성공시 다음 라우터 함수 실행
 */
router.use(async function (req, res, next) {
    let {loginInfo}    = req.body;
    // 로그인 시도
    let {result, user} = await db.login(loginInfo);

    if(!result){
        res.json({
            loginFailed : true
        });
        return;
    }

    // 유저정보 저장
    req.body.user = user;
    // 다음함수 실행
    next();
});

// 도어락 문열기
router.post('/unlock', async function (req, res) {
    let user = req.body.user;
    let authtime = getNowDateTime();

    // 도어락 문열기 시도
    await tcp.dooropen();
    // 최근 인증 날짜 업데이트
    await db.updateLatestAuthDate({userId: user.id, authtime});
    // 인증 기록 저장
    await db.saveHistory({userId: user.id, state: 'success', authtime});
    // 인증된것을 알리는 GCM 전송
    await gcm.authSuccess({doorlockId: user.doorlockId, name: user.name});

    res.json({
        result : true
    });
});

// GCMRegistrationId 값 업데이트
router.post('/setGCMRegistrationId', async function (req, res) {
    let GCMRegistrationId = req.body.data;

    // GCMRegistrationId 값 업데이트 시도
    await db.setGCMRegistrationId({userId:user.id, GCMRegistrationId});

    res.json({
        result : true
    });
});

/**
 * 현재 시간 반환 (단위: s)
 * @method getNowDateTime
 * @return {int}       초단위 현재시간
 */
function getNowDateTime(){
    return parseInt(+new Date() / 1000);
}

export default router;
