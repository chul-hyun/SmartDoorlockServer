import nodeGCM from 'node-gcm';
import db from 'db';

const API_KEY = 'AIzaSyAO6cxu_A2_DtdudkCeGD2fTNzrwDufmlk';
const sender = new nodeGCM.Sender(API_KEY);

function sendGCM({doorlockId, message}){
    let def = Q.defer();

    (async function(){
        let GCMRegistrationIdList = await db.getDoorlockIdOfGCMRegistrationId(doorlockId);
        sender.send((new nodeGCM.Message({
            data: {
                info: {
                    subject:'Smart Doorlock', message
                }
            }
        })), { registrationTokens: GCMRegistrationIdList }, (err, response)=> {
            if(err) def.reject();
            else    def.resolve();
        });
    })();

    return def.promise;
}

export async function doorOpen({doorlockId, userName}){

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
