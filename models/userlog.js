"use strict";
const db = require('./db');


/**
 * 用户日志表
 * @param user
 * @constructor
 */
function Userlog(user) {
    this.user_id = user.user_id;
    this.login_time = user.login_time;
    this.ip = user.ip;
    this.address = user.address;
}


/**
 * 保存用户的登录日志信息
 * @param callback
 */
Userlog.prototype.save = function (callback) {
    db.query('insert into userlog values(null, ?,  ?, ?, ?)', [
        this.login_time, this.ip, this.address, this.user_id
    ], function (err, result) {
        if (err) {
            callback(err, null);
        }
        callback(null, result);
    })
}


/**
 * 获取用户的日志详细记录
 * @param id
 * @param callback
 */
Userlog.getUserlogsById = function (id, callback) {
    // 这里默认只能查询最近30记录
    db.query('select * from userlog where user_id = ? order by login_time desc limit ?, ?', [id, 0, 30],
        function (err, result) {
            //console.log(result);
            if (err) {
                callback(err, null);
            }
            callback(null, result);
        });
}


// 导出这个方法类(区分module.exports一般用于导出一个方法类， exports一般用于导出一个函数的某一个方法)
module.exports = Userlog;