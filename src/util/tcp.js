import net from 'net';

var server      = null;
let listened    = false;
let clients     = [];
let callbacks   = []

export function serverStart(port, callback){
    if(listened){
        console.log('already create server');
        return;
    }

    callback = (callback) ? callback : function(){};

    console.log('create server');

    listened = true;
    server = net.createServer((client)=>{
        let id = clients.length;
        let logTitle = `client ${id}`;
        let printLog = ((log) => console.log(`${logTitle} - ${log}`));

        printLog(`client connected`);
        clients.push({
            client, id, logTitle
        });

        client.on('data', (data)=>{
            printLog(`get data: ${data} (client num: ${clients.length})`);
            executeCabllacks(data);
        });

        client.on('error', () => {
            clients = clients.filter((_client) => _client.id !== id );
            printLog('client error');
        });

        client.on('close', () => {
            clients = clients.filter((_client) => _client.id !== id );
            printLog('client close');
        });

        client.on('end', () => {
            clients = clients.filter((_client) => _client.id !== id );
            printLog('client disconnected');
        });

        callback();
    });

    server.on('error', (error)=>{ // server restart
        console.log('server error');
        console.log(error.message);
        console.log('Will soon be restarted');
        setTimeout(() => {
            try{
                serverStop(()=>serverStart(port));
            }catch(err){

            }finally{
                serverStart(port);
            }
        }, 1000);
    });

    server.on('close', ()=>{
        console.log('server closed');
        listened = false;
    });

    server.listen(port, ()=>{
        console.log(`server listen. port: ${port}`);
    });
}

export function serverStop(callback){
    if(!listened){
        console.log('not create server');
        callback();
        return;
    }

    server.close(callback);
    server = null;
}

export function sendData(data){ //@TODO 클라이언트 즉, 도어락별로 구분이 필요한데..
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

export function recvData(callback){
    callbacks.push(callback);
}

function executeCabllacks(data){
    callbacks.forEach( (callback)=> callback(data));
}
