/**
 * @module util/tcp
 */

"use strict"

import net from 'net';
import Q from 'q';

/** @type {object}  tcp 서버 객체 */
let server        = null;
/** @type {boolean} tcp 서버 on / off 상태 */
let listened      = false;
/** @type {int}     마지막으로 시작된 포트번호 */
let lastPort      = null;
/** @type {Array}   연결된 client 정보 목록 */
let clients       = [];
/** @type {Array}   client에서 값을 받으면 실행할 함수목록 */
let recvCallbacks = [];

/**
 * TCP 서버 시작
 * @method serverStart
 * @param   {int}       port TCP 서버 포트번호
 * @return  {promise}   promise 객체
 */
function serverStart(port){
    let def = Q.defer();

    if(listened){ // 이미 서버 실행시
        console.log('already create server');
        def.resolve();
        return def.promise;
    }

    listened = true;
    lastPort = port;

    // clients 배열 초기화
    resetClients();

    console.log('create server');

    server = net.createServer((client)=>{
        let clientId       = clients.length; //@TODO 도어락 실제 ID값을 넣으면 좋..겠지만
        let printClientLog = getPrintClientLog(clientId)

        printClientLog(`client connected`);

        // clients 배열에 추가
        addClient({
            client, id: clientId
        });

        client.on('data', (data)=>{
            printClientLog(`get data: ${data} (client num: ${clients.length})`);
            executeCabllacks(data, clientId);
        });

        // error 또는 close 또는 end 이벤트 발생시 clients배열에서 삭제
        client.on('error', () => {
            printClientLog('client error');
            removeClient(clientId);
        });

        client.on('close', () => {
            printClientLog('client close');
            removeClient(clientId);
        });

        client.on('end', () => {
            printClientLog('client disconnected');
            removeClient(clientId);
        });
    });

    server.on('error', (error)=>{ // 서버 에러시 1초후 서버 재시작.
        console.log('server error');
        console.log(error.message);
        console.log('Will soon be restarted');
        setTimeout(()=> serverRestart(port), 1000);
    });

    server.on('close', ()=>{ // 정상종료
        console.log('server closed');
        listened = false;
    });

    server.listen(port, ()=>{ // 서버 시작(listen)
        console.log(`server listen. port: ${port}`);
        def.resolve();
    });

    return def.promise;
}

/**
 * TCP 서버 정지
 * @method serverStop
 * @return  {promise}   promise객체
 */
function serverStop(){
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

/**
 * TCP 서버 재시작
 * @method serverRestart
 * @param   {int}       port 서버 포트
 * @return  {promise}   promise 객체
 */
async function serverRestart(port = lastPort){
    await serverStop();
    await serverStart(lastPort)
}

/**
 * 클라이언트로 데이터를 보낸다
 * @method sendData
 * @param   {string}    data 보낼 데이터
 * @return  {promise}   promise 객체
 */
function sendData(data){ //@TODO 클라이언트 즉, 도어락별로 구분이 필요한데.. ID를 받고싶다
    let def = Q.defer();

    if(!listened){
        console.log('not create server');
        return;
    }

    if(clients.length == 0){
        console.log('No clients are connected.');
        return;
    }

    let pendWriteNumber = clients.length;

    clients.forEach(({client, clientId})=>{
        getPrintClientLog(clientId)(`send data: ${data}`)
        //@TODO promise (async)함수로 변경하는 모듈 사용.
        client.write(data, () => {
            pendWriteNumber--;
            if(pendWriteNumber == 0){
                def.resolve();
            }
        });
    });

    return def.promise;
}

/**
 * 문을 열어라는 TCP 데이터 전송
 * @method dooropen
 * @return  {promise}   promise 객체
 */
async function dooropen(){
    await sendData('dooropen');
}

/**
 * 데이터를 받는 콜백함수 등록
 * @method onRecvData
 * @param   {function}   recvCallback 등록할 함수
 * @return  {void}
 */
function onRecvData(recvCallback){
    recvCallbacks.push(recvCallback);
}

/**
 * 등록된 데이터를 받는 콜백함수 실행
 * @method executeCabllacks
 * @param  {string} data        클라이언트에서 받은 데이터
 * @param  {int}    clientId    데이터를 보낸 clinet id
 * @return {void}
 */
function executeCabllacks(data, clientId){
    recvCallbacks.forEach((recvCallback)=> recvCallback(data, clientId));
}

/**
 * 연결된 클라이언트 정보 저장
 * @method addClient
 * @param   {object}    clientInfo 클라이언트 정보. {id, client객체}
 * @return  {void}
 */
function addClient(clientInfo){
    removeClient(clientInfo.id);
    clients.push(clientInfo);
}

/**
 * 연결 해제된 클라이언트 정보 삭제
 * @method removeClient
 * @param  {int}    clientId 삭제할 클라이언트 id값
 * @return {void}
 */
function removeClient(clientId){
    clients = clients.filter((clientInfo) => clientInfo.id !== clientId );
}

/**
 * 클라이언트 배열 리셋
 * @method resetClients
 * @return {void}
 */
function resetClients(){
    clients = [];
}

/**
 * 특정 클라이언트 전용 log 함수를 만들기 위한 함수
 * @method getPrintClientLog
 * @param  {int}        clientId    로그 출력시 제목의 기준이될 클라이언트 id값
 * @return {function}               특정 클라이언트 전용 log 함수
 */
function getPrintClientLog(clientId){
    return function(log){
        console.log(`client ${clientId} - ${log}`)
    }
}

export default {
    serverStart, serverStop, serverRestart, sendData, dooropen, onRecvData
}
