import execCacheQuery from './execCacheQuery';

export async function login(loginInfo){
    let columns = ['id', 'name', 'password', 'registDate', 'latestAuthDate', 'doorlockId'];
    let query = `SELECT ${arrayToSelectQuery(columns)} FROM ${tableNameQuery('user')} ${objectToWhereQuery(loginInfo)}`;

    let { rows } = await execCacheQuery(query);
    if (rows.length !== 1){
        return {result: false, user: null};
    }

    return {result: false, user: rows[0]};
}

export async function checkDoorlockKey(doorlockInfo){
    let query = `SELECT \`id\` FROM ${tableNameQuery('doorlock')} ${objectToWhereQuery(doorlockInfo)}`;
    let { rows } = await execCacheQuery(query);
    if (rows.length !== 1){
        return false;
    }

    return true;
}

export async function registUser(registInfo){
    registInfo.id             = null;
    registInfo.password       = makeRandomString(20);
    registInfo.registDate     = Math.floor((+new Date())/1000);
    registInfo.latestAuthDate = registInfo.registDate;

    let query = `INSERT INTO ${tableNameQuery('user')} ${objectToInsertQuery(registInfo)}`;

    let { rows } = await execCacheQuery(query);

    registInfo.id = rows.insertId;

    return registInfo;
}

export function doorlockInfo(){
    return Q();
}

export async function setGCMRegistrationId(GCMInfo){
    let query = `SELECT * FROM  ${tableNameQuery('gcm')} ${objectToWhereQuery({userId: GCMInfo.userId})}`;
    let { rows } = await execCacheQuery(query);

    if (rows.length >= 1){
        //UPDATE
        query = `UPDATE ${tableNameQuery('gcm')} ${objectToUpdateQuery(GCMInfo)} ${objectToWhereQuery({userId: GCMInfo.userId})}`;
    }else{
        //INSERT
        query = `INSERT INTO  ${tableNameQuery('gcm')} ${objectToInsertQuery(GCMInfo)}`;
    }

    return await execCacheQuery(query);
}

export async function saveHistory({userId, state, authtime}){
    let query = `INSERT INTO  ${tableNameQuery('history')} ${objectToInsertQuery({userId, state, authtime, id:null})}`;
    return await execCacheQuery(query);
}

export async function updateLatestAuthDate({userId, authtime}){
    //@TODO 구현
}

export async function getDoorlockIdOfGCMRegistrationId(doorlockId){
    //@TODO 구현
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

function tableNameQuery(tableName){
    return `\`doorlock\`.\`${tableName}\``;
}
