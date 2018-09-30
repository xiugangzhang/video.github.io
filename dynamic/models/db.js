"use strict";

const mysql = require('mysql');


// 创建一个数据库连接池
var pool = mysql.createPool({
    connectionLimit : 50,
    host : '192.168.1.109',
    database : 'video',
    user : 'root',
    password : '123456'
})

/**
 * 用于执行数据库的SQL语句
 * @param sql
 * @param p
 * @param c
 */
exports.query = function (sql, p, c) {
    // 两个参数/三个参数
    let params = [];
    let callback;


    // 开始进行参数的匹配
    if (arguments.length === 2 && typeof arguments[1] === 'function') {
        // 两个参数的话，第一个参数是SQL语句，第二个参数是回调函数
        callback = p;
    } else if (arguments.length === 3 && Array.isArray(p) && typeof arguments[2] === 'function') {
        params = p;
        callback = c;
    } else {
        throw new Error('Sorry, 参数个数不匹配或参数类型错误！');
    }


    // 从数据库连接池中取出可以使用的链接
    pool.getConnection(function (err, connection) {
        connection.query(sql, params, function (err, rows) {
            // 使用完毕放回去连接池中，然后释放链接
            connection.release();
            callback.apply(null, arguments);
        });
    })
}