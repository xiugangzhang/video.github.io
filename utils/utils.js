"use strict";

const libqqwry = require('lib-qqwry');
const qqwry = libqqwry.init();


/**
 * 获取IP的详细信息
 * @param ip
 * @param callback
 */
exports.getIPInfo = function (ip, callback) {
    return qqwry.searchIP(ip);
}

