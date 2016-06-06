"use strict"

import net from 'net';
import Q from 'q';

let server        = null;
let listened      = false;
let clients       = [];
let recvCallbacks = [];

export function serverStart(port){
    let def = Q.defer();

    if(listened){
        console.log('already create server');
        def.resolve();
        return;
    }
    listened = true;
    resetClients();

    console.log('create server');

    server = net.createServer((client)=>{
        printLog(`client connected`);

        let clientId = clients.length; //@TODO 도어락 실제 ID값을 넣으면 좋..겠지만
        let logTitle = `client ${clientId}`;
        let printLog = ((log) => console.log(`${logTitle} - ${log}`));

        addClient({
            client, id: clientId, logTitle
        });

        client.on('data', (data)=>{
            printLog(`get data: ${data} (client num: ${clients.length})`);
            executeCabllacks(data);
        });

        client.on('error', () => {
            printLog('client error');
            removeClient(clientId);
        });

        client.on('close', () => {
            printLog('client close');
            removeClient(clientId);
        });

        client.on('end', () => {
            printLog('client disconnected');
            removeClient(clientId);
        });
    });

    server.on('error', (error)=>{ // server restart
        console.log('server error');
        console.log(error.message);
        console.log('Will soon be restarted');
        setTimeout(()=> serverRestart(port), 1000);
    });

    server.on('close', ()=>{
        console.log('server closed');
        listened = false;
    });

    server.listen(port, ()=>{
        console.log(`server listen. port: ${port}`);
        def.resolve();
    });

    return def.promise;
}

export async function serverRestart(port){
    await serverStop();
    serverStart(port)
}

export function serverStop(){
    let def = Q.defer();

    if(!listened){
        console.log('not create server');
        def.resolve();
    }else{
        server.close(()=>def.resolve());
        server = null;
    }

    return def.promise;
}

export async function sendData(data){ //@TODO 클라이언트 즉, 도어락별로 구분이 필요한데.. ID를 받고싶다
    if(!listened){
        console.log('not create server');
        return;
    }

    if(clients.length == 0){
        console.log('No clients are connected.');
        return;
    }

    clients.forEach(({client, logTitle})=>{
        console.log(`${logTitle} - send data: ${data}`);
        client.write(data);
    })
}

export async function dooropen(){
    await sendData('dooropen');
}

export function recvData(recvCallback){
    recvCallbacks.push(recvCallback);
}

function executeCabllacks(data){
    recvCallbacks.forEach((recvCallback)=> recvCallback(data));
}

function addClient(clientInfo){
    removeClient(clientInfo.id);
    clients.push(clientInfo);
}

function removeClient(clientId){
    clients = clients.filter((clientInfo) => clientInfo.id !== clientId );
}

function resetClients(){
    clients = [];
}
