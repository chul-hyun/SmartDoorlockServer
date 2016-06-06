import mysql from 'mysql';
import Q from 'q';
import _ from 'lodash'

let pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'wkdTlqkf',
    database : 'doorlock'
});

let queryCache    = {};

let selectRegex   = /SELECT/gi;
let tables        = [];
let pendQueryList = [];
let willHasCache  = [];
let changDbQueryList = [];
let queryRuning   = true;

pool.query('SHOW TABLES', function(err, rows, fields){
    tables = rows.map((row)=> `\`doorlock\`.\`${row.Tables_in_doorlock}\``);

    queryRuning = false;
    execQuery();
})

default function execCacheQuery(query){
    let def = Q.defer();

    let useCache = false;
    if(selectRegex.test(query)){ // SELECT
        clearWillHasCache(changDbQueryList.join(';'))
        changDbQueryList = [];
        if(willHasCache.some((key)=> key == query)){
            useCache = true;
        }else{
            willHasCache.push(query);
        }
    }else{ //UPDATE or INSERT
        changDbQueryList.push(query);
    }

    pendQueryList.push({
        query, useCache, def
    });

    execQuery();

    return def.promise;
}

function clearWillHasCache(query){
    let willChangedTables       = queryToTables(query);
    let willChangedTablesLength = willChangedTables.length;

    willHasCache = willHasCache.filter((cacheKey)=>{
        let cacheTables       = queryToTables(cacheKey);
        let cacheTablesLength = cacheTables.length;

        for(let i = 0 ; i < willChangedTablesLength ; i++){
            for(let j = 0 ; j < cacheTablesLength ; j++){
                if( willChangedTables[i] == cacheTables[j]){
                    return false;
                }
            }
        }

        return true;
    }, [])
}


function execQuery(){
    if(!queryRuning && pendQueryList.length == 0){
        return;
    }
    queryRuning = true;

    let { query, useCache, def } = pendQueryList.shift();

    console.log('execQuery', query);

    if(useCache){
        def.resolve(getCache(query));

        queryRuning = false;
        execQuery();
    }else{
        pool.query(query, (err, rows, fields)=> {
            if(err){
                console.log('execQuery Error', query)
                def.reject(err);
            }else{
                setCache(query, { rows, fields });
                def.resolve({ rows, fields });
            }

            queryRuning = false;
            execQuery();
        })
    }
}

function getCache(query){
    return queryCache[query];
}

function setCache(query, value){
    queryCache[query] = value;
}

let queryToTables = _.memoize(function queryToTables(query){
    return tables.filter((table)=>{ query.match(table) != null })
});
