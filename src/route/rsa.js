import {
    initRSA,
    decodeString
} from "../util/rsa";
import {
    checkDoorlockKey,
    addUser
} from "../util/db";
import express from "express";

var router = express.Router();

var rsaInfo = initRSA();

setInterval(()=>{
    rsaInfo = initRSA();
}, 1000 * 10 )

// middleware that is specific to this router
router.use(function (req, res, next) {
    console.log(req.body);
    let { N, e, screetData } = req.body;
    try{
        if( req.body.rsaInfo.N != rsaInfo.N || req.body.rsaInfo.e != rsaInfo.e ){
            res.json({
                state: 'rsa changed',
                rsaInfo
            });
            res.end();
            return;
        }
    }catch(e){
        res.json({
            state: 'rsa changed',
            rsaInfo
        });
        res.end();
        return;
    }

    req.body.data = JSON.parse(decodeString(screetData, rsaInfo.d, rsaInfo.N));

    next();
});

router.post('/regist', function (req, res) {
    let { name, doorlockID, doorlockKey } = req.body.data;
    console.log({ name, doorlockID, doorlockKey });

    (async function(){
        try{
            await checkDoorlockKey(doorlockID, doorlockKey);

            let { password, registDate } = await addUser(doorlockID, name);

            console.log({
                result : 'success',
                userInfo : {
                    name, registDate,
                    key: password
                }
            });

            res.json({
                result : 'success',
                userInfo : {
                    name, registDate,
                    key: password
                }
            });
            res.end();

        } catch(error) {
            // Handle error
            res.end();
            console.error('4');
            console.error(error);
        }
    })();
});


export default router;
