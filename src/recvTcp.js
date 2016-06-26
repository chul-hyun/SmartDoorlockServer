import tcp from './util/tcp'
import gcm from './util/gcm'

function onTempWarning(data, clientId){
    gcm.tempWarning({doorlockId: 2});
}

tcp.onRecvData(onTempWarning);
