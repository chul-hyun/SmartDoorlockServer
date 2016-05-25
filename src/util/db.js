import mysql from 'mysql';
import Q from 'q';

let pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'wkdTlqkf',
    database : 'doorlock'
});

function execQuery(query){
    let def = Q.defer();

    pool.query(query, function(err, rows, fields) {
        if(err){
            console.log('execQuery Error')
            def.reject(err);
        }
        console.log('execQuery');
        console.log(rows);
        def.resolve(rows);
    })

    return def.promise;
}


export function checkDoorlockKey(doorlockID, doorlockKey){
    let def = Q.defer();

    (async function(){
        let query = `SELECT * FROM  \`doorlock\` WHERE  \`id\` ='${doorlockID}' AND  \`secret_key\` =  '${doorlockKey}'`;
        let rows = await execQuery(query);
        console.log('checkDoorlockKey');
        console.log(rows);
        if (rows.length === 1){
            def.resolve();
        }else{
            def.reject('no match doorlock key'); // @TODO ERROR LIST를 상수로 선언해서 이용.
        }
    })();

    return def.promise;
}

export function addUser(doorlockID, name){
    let def = Q.defer();;

    (async function(){
        let password   = makeRandomString(20);
        let registDate = Math.floor((+new Date())/1000);
        let query      = `INSERT INTO \`doorlock\`.\`user\` (\`id\`, \`name\`, \`password\`, \`registDate\`, \`doorlock_id\`) VALUES (NULL, '${name}', '${password}', '${registDate}', '${doorlockID}')`;

        let rows = await execQuery(query);
        console.log('addUser');
        console.log(rows);

        def.resolve({ password, registDate });
    })();

    return def.promise;
}

function makeRandomString(size){
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < size; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
