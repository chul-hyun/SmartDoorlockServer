import express from 'express';

import * as rsa from '../util/rsa';
import * as db from '../util/db';
import * as tcp from '../util/tcp'
import * as gcm from '../util/gcm'

let router = express.Router();

router.use(function (req, res, next) {
    try{
        let {loginInfo}    = req.body;
        let {result, user} = await db.login(loginInfo);

        if(!result){
            res.json({
                loginFailed : true
            });
            res.end();
            return;
        }
    }catch(e){
        res.json({
            loginFailed : true
        });
        res.end();
        return;
    }

    req.body.user = user;
    next();
});

router.post('/unlock', async function (req, res) {
    let user = req.body.user;
    let authtime = getNowDateTime();

    await tcp.dooropen();
    await db.updateLatestAuthDate({userId: user.id, authtime});
    await db.saveHistory({userId: user.id, state: 'success', authtime});
    gcm.doorOpen({user.doorlockId, user.name});

    res.json({
        result : true
    });
    res.end();
});

router.post('/setGCMRegistrationId', async function (req, res) {
    let {GCMRegistrationId} = req.body;

    await db.setGCMRegistrationId({userId:user.id, GCMRegistrationId});

    res.json({
        result : true
    });
    res.end();
});

function getNowDateTime(){
    return parseInt(+new Date() / 1000);
}

export default router;
