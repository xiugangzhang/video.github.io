"use strict";
const mysql = require('mysql');
const db = require('../models/db');
const fs = require('fs');
const path = require('path');
const fetchUtil = require('../utils/fetch');

/**
 * 开始进入程序安装的页面
 * @param req
 * @param res
 * @param next
 */
exports.showInstallPage = function (req, res, next) {
    // 检查用户是否已经安装了程序
    fs.exists("./config.properties", function (exists) {
        if (exists) {
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
                            // 开始实现数据抓取
                            fetchUtil.start(true, function (err, finished) {
                                if (err) return next(err);
                                // 成功之后，开始初始化轮播图初始数据信息
                                addPreviews(function (err) {
                                    if (err) return console.log(err);
                                    console.log('开始添加轮播图数据信息')
                                    return res.json({
                                        status: 1,
                                        msg: 'success'
                                    });
                                })
                            });
                        }
                    })
                }
            })
        })
    });
}



/**
 * 添加首页轮播图信息
 * @param callback
 */
function addPreviews(callback) {
    console.log('开始准备轮播图数据！')
    // 轮播图数据预览数据(使用测试数据插入数据库)
    // 开始执行安装（执行SQL语句）
    fs.readFile(path.join(__dirname, '../test.sql'), 'utf-8', function (err, sqlStr) {
        // 开始处理sqlStr语句,8张表
        var sqls = sqlStr.split(';')
        let finished = 0;
        sqls.forEach(sql => {
            if (typeof sql === 'string' && sql.length !== 0) {
                db.query("delete from preview", function (err) {
                    if (err) return console.log(err);
                    sql = sql.trim();
                    if (sql && sql.length === 0) return;
                    db.query(sql, function (error) {
                        //  只要执行成功的个数误差在1个范围内，就执行成功
                        if (error)  return console.log(error);
                        finished++
                        if (finished === sqls.length) {
                            callback(null, true)
                        }
                    })
                })
            }
        })
    });
}
