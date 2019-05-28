"use strict";

const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
let propertis = getProperties();
const _config = require('../config');



// 数据库配置
let config = {
    connectionLimit : 500,
    host : _config.host,
    database : _config.database,
    user : _config.user,
    password : _config.password
};

// 创建一个数据库连接池
let pool = mysql.createPool(config)



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

    if(propertis.database === undefined || propertis.user === undefined || propertis.password === undefined || propertis.host === undefined){
        propertis = getProperties();
        config = {
            connectionLimit : 50,
            host : propertis['host'],
            database : propertis['database'],
            user : propertis['user'],
            password : propertis['password']
        };
        pool = mysql.createPool(config)
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



/**
 * 安装状态查询
 * @param pool
 * @param sql
 */
exports.queryInstall = function (pool, callback) {
    // 开始创建一个连接池
    pool.getConnection(function (err, connection) {
        if (err)
            return callback(err.sqlMessage || err, null);
        callback(null, {status : true});
    })
}


/**
 * 开始批量执行程序的sql语句
 * @param pool
 * @param sql
 * @param callback
 */
exports.batchExecuteSQL = function (pool, sql, callback) {
    // 从数据库连接池中取出可以使用的链接
    pool.getConnection(function (err, connection) {
        connection.query(sql, function (err, rows) {
            // 使用完毕放回去连接池中，然后释放链接
            connection.release();
            callback.apply(null, arguments);
        });
    })
}


/**
 * 根据属性值获取数据值
 * @param name
 */
function getProperties(name) {
    try {
        var result = fs.readFileSync(path.join(__dirname, '../config.properties'), 'utf-8'),
            res = {};
        if (typeof result === 'string' && result.length !== 0){
            let properties = result.split('\n');
            properties.forEach(item=>{
                let ret = item.split('=');
                if (ret.length === 2) {
                    res[ret[0]] = ret[1];
                }
            })
        }
        return res;
    }catch (e) {
        return {
            host : undefined,
            database: undefined,
            user : undefined,
            password: undefined
        }
    }

}
