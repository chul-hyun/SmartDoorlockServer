/**
 * @module util/gcm
 */

"use strict"

import nodeGCM from 'node-gcm';
import Q from 'q';

import db from './db';

/** @type {String} GCM 서버용 비밀키 */
const API_KEY = 'AIzaSyAO6cxu_A2_DtdudkCeGD2fTNzrwDufmlk';
/** @type {nodeGCM.Sender} 참고 : https://github.com/ToothlessGear/node-gcm*/
const sender = new nodeGCM.Sender(API_KEY);

/**
 * GCM을 보내기 위한 값
 * @method send
 * @param  {int}        doorlockId  이 도어락 id를 가진 유저에게만 메세지를 전송
 * @param  {String}     message     전송할 메세지
 * @param  {String}     type        메세지 타입 (메세지 구분용)
 * @return {Promise}                Promise객체
 */
function send({doorlockId, message, type}){
    //console.log('started send');
    let def = Q.defer();

    (async function(def){
        //console.log('getDoorlockIdOfGCMRegistrationId')
        let GCMRegistrationIdList = await db.getDoorlockIdOfGCMRegistrationId(doorlockId);
        console.log('GCMRegistrationIdList', GCMRegistrationIdList);
        sender.send((new nodeGCM.Message({
            data: {
                info: {
                    subject:'Smart Doorlock',
                    type,
                    message
                }
            }
        })), { registrationTokens: GCMRegistrationIdList }, (err, response)=> {
            if(err) def.reject();
            else    def.resolve();
        });
    })(def);

    return def.promise;
}

/**
 * 인증 성공 멘세지 전송
 * @method authSuccess
 * @param  {[type]} doorlockId  이 도어락 id를 가진 유저에게만 메세지를 전송
 * @return {Promise}            Promise객체
 */
async function authSuccess({doorlockId, name}){
    //@TODO message 알맞게 처리
    //console.log('send')
    return await send({
        doorlockId,
        message: `문이 열렸습니다. (${name})`,
        type: 'auth success'
    })
}

/**
 * 인증 실패 메세지 전송
 * @method authFail
 * @param  {[type]} doorlockId  이 도어락 id를 가진 유저에게만 메세지를 전송
 * @return {Promise}            Promise객체
 */
async function authFail({doorlockId}){
    //@TODO message 알맞게 처리
    return await send({
        doorlockId,
        message: '',
        type: 'auth fail'
    })
}

/**
 * 실내 온도 경고 메세지 전송
 * @method tempWarning
 * @param  {[type]} doorlockId  이 도어락 id를 가진 유저에게만 메세지를 전송
 * @return {Promise}            Promise객체
 */
async function tempWarning({doorlockId}){
    //@TODO message 알맞게 처리
    return await send({
        doorlockId,
        message: '',
        type: 'temp warning'
    })
}

export default {
    authSuccess, authFail, tempWarning
}


/*

curl -X POST -H "Authorization: key=AIzaSyAO6cxu_A2_DtdudkCeGD2fTNzrwDufmlk" -H "Content-Type: application/json" -d '
{
  "data": {
    "info": {
      "subject": "Hello GCM2",
      "message": "Hello from the server side!"
    }
  },
  "to" : "cmi8978x4ts:APA91bEoKezYDph1_e5BfY8F7vMMgE5N3sEw_4oSA07MMBUvyERdAwlfO_JPARLUgpDlfJWLPOpCyZ79OI3-Ns2F8IEPsHQ_VA9vROljyTNti_2Srs7watdKYiP7hmxww8inhcKlRQrQ"
}' 'https://gcm-http.googleapis.com/gcm/send'

*/
