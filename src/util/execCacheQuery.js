/**
 * @module util/execCacheQuery
 */

//@TODO 특정 조건에서 다중질의 처리로 성능향상을 꾀할수 있다.

"use strict"

import mysql from 'mysql';
import Q from 'q';
import _ from 'lodash'

/** https://github.com/felixge/node-mysql#pooling-connections */
let pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'wkdTlqkf',
    database : 'doorlock'
});

/** @type {Object} 쿼리를 key로 db실행 결과를 값으로 갖는 캐시 객체 */
let queryCache    = {};
/** @type {RegExp} select문 판별용 정규식객체 */
let selectRegex   = /SELECT/gi;
/** @type {Array} db에 있는 테이블 목록 */
let tables        = [];

/** @type {Array} 대기중인 쿼리문 */
let pendQueryList        = [];
/**
 * pendQueryList를 분석하여 특정 쿼리문이 실행시 캐시값을 가지고 있을시 판단하기 위해
 * 특정 쿼리문 이전에 실행 될것으로 예상되는 쿼리를 담는 배열
 * 이렇게 담아진 쿼리문은 clearWillHasCache 함수를 통해 유효한 캐시를 가진
 * (INSERT, UPDATE, DELETE문의 영향을 안받은) 쿼리문만 남게 한다.
 * @type {Array}
 */
let willHasCache         = [];
/** @type {Array} UPDATE문 또는 INSERT문을 담는 배열 */
let willChangDbQueryList = [];
/** @type {Boolean} 쿼리문이 실행중인지 판별 ( 실행 대기중인 쿼리문이 있으면 true ) */
let queryRuning          = true;

// tables 배열 초기화 ( db에 있는 테이블 목록으로 초기화 )
pool.query('SHOW TABLES', function initTables(err, rows, fields){
    tables = rows.map((row)=> `\`doorlock\`.\`${row.Tables_in_doorlock}\``);

    queryRuning = false;
    execQuery();
});

/**
 * select문만을 캐시하는 쿼리문 실행
 * 실제로는 pendQueryList에 쿼리문을 push하여 실행대기 시킨다.
 * @method execCacheQuery
 * @param  {Stirng}       query     실행할 쿼리문
 * @return {Promise}                Promise객체
 */
function execCacheQuery(query){
    let def = Q.defer();

    // 성능 향상을 위한 비동기 실행
    (function(def){
        /** @type {Boolean} 캐시사용 가능 판단용 변수 */
        let canUseCache = false;

        if(selectRegex.test(query)){ // SELECT
            // willHasCache 정리
            clearWillHasCache(willChangDbQueryList.join(';'))

            // willHasCache를 정리했으므로 정리때문에 저장되었던
            // UPDATE, INSERT문들을 비운다.
            willChangDbQueryList = [];

            // willHasCache에 미리 캐시된 쿼리문이 있는지 없는지 판단
            if(willHasCache.some((key)=> key == query)){
                canUseCache = true;
            }else{
                willHasCache.push(query);
            }
        }else{ //UPDATE or INSERT
            willChangDbQueryList.push(query);
        }

        // pendQueryList에 push
        pendQueryList.push({
            query, canUseCache, def
        });

        // 실제 쿼리대기문 실행함수 실행.
        // 이미 실행중이면 execQuery함수내에서 종료 처리한다.
        execQuery();
    })(def)

    return def.promise;
}

/**
 * willHasCache에 담겨진 SELECT쿼리문중
 * INSERT, UPDATE, DELETE문의 영향을 안받은 쿼리문만 남도록 정리
 * @method clearWillHasCache
 * @param  {String}          query INSERT, UPDATE, DELETE문의 쿼리
 * @return {void}
 */
function clearWillHasCache(query){
    /** query에 있는 테이블 목록 */
    let willChangedTables       = queryToTables(query);
    let willChangedTablesLength = willChangedTables.length;

    willHasCache = willHasCache.filter((cacheQuery)=>{
        /** cacheQuery에 있는 테이블 목록 */
        let cacheTables       = queryToTables(cacheQuery);
        let cacheTablesLength = cacheTables.length;

        for(let i = 0 ; i < willChangedTablesLength ; i++){
            for(let j = 0 ; j < cacheTablesLength ; j++){
                // 캐시 쿼리에 INSERT 또는 UPDATE 또는 DELETE문의 영향을 받았을 경우 캐시 삭제.
                if( willChangedTables[i] == cacheTables[j]){
                    return false;
                }
            }
        }

        return true;
    }, [])
}

/**
 * 실제로 쿼리문을 실행하는 함수.
 * pendQueryList에 있는 실행대기 쿼리문을 순차적으로 실행한다.
 * execCacheQuery함수에서 미리 설정된 canUseCache값을 이용하여
 * 캐시를 사용하거나 사용하지 않는다.
 * @method execQuery
 * @return {void}
 */
function execQuery(){
    //이미 실행중이거나, 대기중인 쿼리문이 없을시 종료.
    if(!queryRuning && pendQueryList.length == 0){
        return;
    }

    queryRuning = true;

    let { query, canUseCache, def } = pendQueryList.shift();

    // 캐시 사용 가능시
    if(canUseCache){
        //console.log('use cache', query)
        def.resolve(getCache(query));

        queryRuning = false;
        execQuery();
    }else{
        console.log('exec query', query)
        // 캐시 사용 불가능
        pool.query(query, (err, rows, fields)=> {
            if(err){
                console.log('execQuery Error', query)
                def.reject(err);
            }else{
                //console.log('set cache');
                //console.log(query, { rows, fields });
                setCache(query, { rows, fields });
                //console.log('resolve');
                def.resolve({ rows, fields });
            }

            queryRuning = false;
            execQuery();
        })
    }
}

/**
 * [getCache description]
 * @method getCache
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
function getCache(query){
    return queryCache[query];
}

/**
 * [setCache description]
 * @method setCache
 * @param  {[type]} query [description]
 * @param  {[type]} value [description]
 */
function setCache(query, value){
    queryCache[query] = value;
}

/**
 * 쿼리문에 존재하는 테이블들을 리턴.
 * @method queryToTables
 * @param  {String}     query   분석할 쿼리문
 * @return {[type]}             쿼리문에 있는 테이블들.
 */
let queryToTables = _.memoize(function queryToTables(query){
    return tables.filter((table)=>{ query.match(table) != null })
});

function execNonCacheQuery(query){
    let def = Q.defer();

    pool.query(query, (err, rows, fields)=> {
        if(err){
            console.log('execQuery Error', query)
            def.reject(err);
        }else{
            def.resolve({ rows, fields });
        }
    })

    return def.promise;
}

export default execNonCacheQuery;
