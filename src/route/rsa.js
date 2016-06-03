import {
    initRSA,
    decodeString
} from '../util/rsa';

import {
    checkDoorlockKey,
    registUser,
    login,
    doorlockInfo,
    setGCMRegistrationId
} from '../util/db';

import {
    sendData
} from '../util/tcp'

import express from 'express';

let router = express.Router();

let rsaInfo = initRSA();

let interval = 1000 * 10;

setInterval(()=>{
    rsaInfo = initRSA();
}, interval )

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
    let { N, e, screetData } = req.body;
    try{
        if( req.body.rsaInfo.N != rsaInfo.N || req.body.rsaInfo.e != rsaInfo.e ){
            res.json({
                state: 'rsaInfo',
                rsaInfo: getPublishRSAInfo()
            });
            res.end();
            return;
        }
    }catch(e){
        res.json({
            state: 'rsaInfo',
            rsaInfo: getPublishRSAInfo()
        });
        res.end();
        return;
    }

    req.body.data = JSON.parse(decodeString(screetData, rsaInfo.d, rsaInfo.N));

    next();
});

router.post('/login', function (req, res) {
    (async function(){ //@TODO async 를 위 function (req, res) 함수랑 합쳐보기
        try{
            let loginInfo = req.body.data;
            let user      = await login(loginInfo);

            console.log({
                result : true,
                user
            });

            res.json({
                result : true,
                user
            });
            res.end();

        } catch(error) {
            // Handle error
            res.json({
                result : false
            });
            res.end();
            console.error(error);
        }
    })();
});

router.post('/regist', function (req, res) {
    let { name, doorlockId, doorlockKey } = req.body.data;
    console.log({ name, doorlockId, doorlockKey });

    (async function(){
        try{
            await checkDoorlockKey({ id: doorlockId, secretKey: doorlockKey });

            console.log('registUser start')
            let user = await registUser({ doorlockId, name });
            console.log('registUser end')

            console.log({
                result : true,
                user
            });

            res.json({
                result : true,
                user
            });
            res.end();

        } catch(error) {
            // Handle error
            res.json({
                result : false
            });
            res.end();
            console.error(error);
        }
    })();
});

router.post('/unlock', function (req, res) {
    (async function(){ //@TODO async 를 위 function (req, res) 함수랑 합쳐보기
        try{
            let loginInfo = req.body.data;
            let user      = await login(loginInfo);
            let doorlock  = await doorlockInfo(user.doorlockId);

            sendData('dooropen');

            res.json({
                result : true
            });
            res.end();

        } catch(error) {
            // Handle error
            res.json({
                result : false
            });
            res.end();
            console.error(error);
        }
    })();
});

router.post('/setGCMRegistrationId', function (req, res) {
    (async function(){ //@TODO async 를 위 function (req, res) 함수랑 합쳐보기
        try{
            let {loginInfo, GCMRegistrationId} = req.body.data;

            let user      = await login(loginInfo);
            await setGCMRegistrationId({userId:user.id, GCMRegistrationId});

            res.json({
                result : true
            });
            res.end();

        } catch(error) {
            // Handle error
            res.json({
                result : false
            });
            res.end();
            console.error(error);
        }
    })();
});

function getPublishRSAInfo(){
    return {
        N : rsaInfo.N,
        e : rsaInfo.e,
        interval
    }
}

export default router;
