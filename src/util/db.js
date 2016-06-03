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

    console.log(query);

    pool.query(query, function(err, rows, fields) {
        if(err){
            console.log('execQuery Error')
            def.reject(err);
        }
        console.log('execQuery');
        def.resolve({ rows, fields });
    })

    return def.promise;
}

export function login(loginInfo){
    let def = Q.defer();;

    (async function(){
        let columns = ['id', 'name', 'password', 'registDate', 'latestAuthDate', 'doorlockId'];
        let query = `SELECT ${arrayToSelectQuery(columns)} FROM \`user\` ${objectToWhereQuery(loginInfo)}`;

        let { rows } = await execQuery(query);
        if (rows.length === 1){
            def.resolve(rows[0]);
        }else{
            def.reject('login fail'); // @TODO ERROR LIST를 상수로 선언해서 이용.
        }
    })();

    return def.promise;
}

export function checkDoorlockKey(doorlockInfo){
    let def = Q.defer();

    (async function(){
        let query = `SELECT \`id\` FROM \`doorlock\` ${objectToWhereQuery(doorlockInfo)}`;
        let { rows } = await execQuery(query);
        console.log('checkDoorlockKey');
        if (rows.length === 1){
            def.resolve();
        }else{
            def.reject('no match doorlock key'); // @TODO ERROR LIST를 상수로 선언해서 이용.
        }
    })();

    return def.promise;
}

export function registUser(registInfo){
    console.log('registUser');
    let def = Q.defer();;

    (async function(){
        console.log('async registUser');
        registInfo.id             = null;
        console.log('1');
        registInfo.password       = makeRandomString(20);
        console.log('2');
        registInfo.registDate     = Math.floor((+new Date())/1000);
        console.log('3');
        registInfo.latestAuthDate = registInfo.registDate;
        console.log('4');

        console.log(registInfo);
        let query = `INSERT INTO \`doorlock\`.\`user\` ${objectToInsertQuery(registInfo)}`;
        console.log(query);

        let { rows } = await execQuery(query);

        registInfo.id = rows.insertId;

        def.resolve(registInfo);
    })();

    return def.promise;
}

export function doorlockInfo(){
    return Q();
}

export function setGCMRegistrationId(GCMInfo){
    let def = Q.defer();

    (async function(){
        let query = `SELECT * FROM  \`gcm\` ${objectToWhereQuery({userId: GCMInfo.userId})}`;
        let { rows } = await execQuery(query);

        if (rows.length >= 1){
            //UPDATE
            query = `UPDATE \`doorlock\`.\`gcm\` ${objectToUpdateQuery(GCMInfo)} ${objectToWhereQuery({userId: GCMInfo.userId})}`;
        }else{
            //INSERT
            query = `INSERT INTO  \`doorlock\`.\`gcm\` ${objectToInsertQuery(GCMInfo)}`;
        }

        await execQuery(query);

        def.resolve();
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

function objectToWhereQuery(obj){
    let query = [];
    for(let key in obj){
        let val = obj[key];
        if(val === null || val === undefined){
            val = `NULL`;
        }else{
            val = `'${obj[key]}'`;
        }

        query.push(`\`${key}\` = ${val}`);
    }
    return 'WHERE ' + query.join(' AND ');
}

function objectToInsertQuery(obj){
    let keys = [];
    let vals = [];
    for(let key in obj){
        let val = obj[key];
        keys.push(`\`${key}\``);
        if(val === null || val === undefined){
            vals.push(`NULL`);
        }else{
            vals.push(`'${val}'`);
        }
    }
    return `(${keys.join(', ')}) VALUES (${vals.join(', ')})`;
}

function objectToUpdateQuery(obj){
    let query = [];
    for(let key in obj){
        let val = obj[key];
        if(val === null || val === undefined){
            val = `NULL`;
        }else{
            val = `'${obj[key]}'`;
        }

        query.push(`\`${key}\` = ${val}`);
    }
    return 'SET ' + query.join(', ');
}

function arrayToSelectQuery(arr){
    return arr.map((val)=> `\`${val}\``).join(', ');
}
