"use strict";

var http = require('http');


/**
 * 获取IP的详细信息
 * @param ip
 * @param callback
 */
exports.getIPInfo = function (ip, callback) {
    var taobao_server = 'http://ip.taobao.com/service/getIpInfo.php?ip=';
    var url = taobao_server + ip;
    http.get(url, function(res) {
        var code = res.statusCode;
        if (code == 200) {
            res.on('data', function(data) {
                try {
                    callback(null, JSON.parse(data));
                } catch (err) {
                    callback(err, null);
                }
            });
        } else {
            callback({ code: code });
        }
    }).on('error', function(e) { callback(e, null); });
}

