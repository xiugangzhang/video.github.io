"use strict";
const mysql = require('mysql');
const db = require('../models/db');
const fs = require('fs');
const path = require('path');


/**
 * 开始进入程序安装的页面
 * @param req
 * @param res
 * @param next
 */
exports.showInstallPage = function (req, res, next) {
    // 检查用户是否已经安装了程序
    fs.exists("./config.properties",function(exists){
        if(exists){
            // 用户已经安装的话
            return res.redirect('/');
        }
        return res.render('install');
    })
}


/**
 * 开始安装程序
 * @param req
 * @param res
 * @param next
 */
exports.doInstall = function (req, res, next) {
    var dbname = req.body.dbname,
        dbip = req.body.dbip,
        username = req.body.username,
        password = req.body.password,
        pool = mysql.createPool({
            connectionLimit: 50,
            host: dbip,
            database: dbname,
            user: username,
            password: password,
            multipleStatements: true
        })
    db.queryInstall(pool, function (err) {
        if (err)
            return res.json({
                status: -1,
                msg: err
            })

        // 开始执行安装（执行SQL语句）
        fs.readFile(path.join(__dirname, '../video.sql'), 'utf-8', function (err, sqlStr) {
            // 开始处理sqlStr语句,8张表
            var sqls = sqlStr.split(';')
            let finished = 0;
            sqls.forEach(sql => {
                if (typeof sql === 'string' && sql.length !== 0) {
                    db.batchExecuteSQL(pool, sql.trim(), function (error) {
                        //  只要执行成功的个数误差在1个范围内，就执行成功
                        finished++
                        if (finished === sqls.length) {
                            // 开始写入配置文件
                            var configInfo = `database=${dbname}\nhost=${dbip}\nuser=${username}\npassword=${password}`;
                            fs.writeFileSync(path.join(__dirname, '../config.properties'), configInfo);
                            // 添加成功之后（开始把数据信息保存到文件中去）
                            return res.json({
                                status: 1,
                                msg: 'success'
                            });
                        }
                    })
                }
            })
        })
    });
}