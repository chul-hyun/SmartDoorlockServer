import tcp from './util/tcp'
import gcm from './util/gcm'
import db from './util/db'
import { getNowDateTime } from './util/func'
import Buffer from 'buffer'

function onTemperWarning(data, clientId){
    console.log('data', data, data.slice(0,14).toString());
    if(data.slice(0,14).toString() == 'temper warning'){
        console.log('temper warning 명령 실행')
        let authtime = getNowDateTime();
        // 인증 기록 저장
        db.saveHistory({userId: null, doorlockId: 2, state: 'warning', authtime});
        gcm.temperWarning({doorlockId: 2});
    }
}

function onOpenDoor(data, clientId){
    console.log('data', data, data.slice(0,11).toString());
    if(data.slice(0,11).toString() == 'door opened'){
        console.log('opened 명령 실행')
        // 문 열린 것을 알리는 GCM 전송
        gcm.authSuccess({doorlockId: 2});
    }
}

tcp.onRecvData(onTemperWarning);
tcp.onRecvData(onOpenDoor);
