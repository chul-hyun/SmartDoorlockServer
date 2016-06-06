import express from 'express';

import * as rsa from '../util/rsa';
import * as db from '../util/db';

let router = express.Router();

let rsaInfo = rsa.initRSA();

let interval = 1000 * 10;

setInterval(()=>{
    rsaInfo = rsa.initRSA();
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

    req.body = rsa.decodeJSON(screetData, rsaInfo.d, rsaInfo.N);

    next();
});

router.post('/login', async function (req, res) {
    let loginInfo      = req.body;
    let {result, user} = await db.login(loginInfo);

    if(result){
        res.json({
            result : true,
            user
        });
    }
    else{
        res.json({
            result : false
        });
    }

    res.end();
});

router.post('/regist', async function (req, res) {
    let { name, doorlockId, doorlockKey } = req.body;
    console.log({ name, doorlockId, doorlockKey });

    let result = await db.checkDoorlockKey({ id: doorlockId, secretKey: doorlockKey });

    if(!result){
        res.json({
            result : false
        });
        res.end();
        return;
    }

    console.log('registUser start')
    let user = await db.registUser({ doorlockId, name });
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
});

function getPublishRSAInfo(){
    return {
        N : rsaInfo.N,
        e : rsaInfo.e,
        interval
    }
}

export default router;
