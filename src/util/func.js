export function argToStr(){
    return JSON.stringify(arguments);
}

/**
 * 현재 시간 반환 (단위: s)
 * @method getNowDateTime
 * @return {int}       초단위 현재시간
 */
export function getNowDateTime(){
    return parseInt(+new Date() / 1000);
}
