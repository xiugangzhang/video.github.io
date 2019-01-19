"use strict";

const Movie = require('../models/movie');
const moment = require('moment');
const User = require('../models/user');


/**
 * 进入网站后台管理页面
 * @param req
 * @param res
 * @param next
 */
exports.showAdmin = function (req, res, next) {
    if (req.session.user && req.session.user.id === 1) {
        return res.render('admin/admin');
    }
}


/**
 * 展示电影列表详细信息
 * @param req
 * @param res
 * @param next
 */
exports.showMovieList = function (req, res, next) {
    let pageNow = req.params.currentPage || 1;
    let pageSize = 12;


    // 获取用户搜索的电影名称
    let sMoviename = req.params.moviename;
    if (sMoviename) {
        // 开始搜索电影信息
        Movie.getMovieByName(sMoviename, function (err, result) {
            if (err) {
                return next(err);
            }
            if (result.length === 0) {
                return res.json({
                    code: 0,
                    msg: '未找到相关资源'
                });
            }
            return res.json({
                code: 1,
                movies: result
            });
        })
    } else {
        // undefined 1  0
        //console.log(req.params.currentPage, pageNow, (pageNow - 1) * pageSize);
        let params = {
            start: (pageNow - 1) * pageSize,
            pageSize: pageSize
        }

        // 获取总页码
        Movie.getMoviePageNums(function (err, pageInfo) {
            if (err) {
                return next(err);
            }

            // 开始正式获取电影列表
            Movie.getMoviesByCurrentPage(params, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (result) {
                    // 在这里把时间修改为相对事件
                    result.forEach(function (element) {
                        element.addtime = moment(element.addtime).format('YYYY-MM-DD HH:mm:ss');
                    })
                }
                if (pageNow == 1) {
                    return res.render('admin/movielist', {
                        movies: result,
                        pageNum: Math.ceil(pageInfo.pageNum / pageSize)
                    });
                }

                return res.json({
                    movies: result,
                    pageNum: Math.ceil(pageInfo.pageNum / pageSize)
                });
            })
        })
    }
}


/**
 * 显示会员列表信息
 * @param req
 * @param res
 * @param next
 */
exports.showUserList = function (req, res, next) {
    let username = req.params.username;
    if (username) {
        User.getUserByName(username, function (err, result) {
            if (err) {
                return next(err);
            }
            if (result) {
                return res.json({
                    code : 1,
                    user : result
                })
            }

            res.json({
                code: 0,
                msg: 'error'
            })
        })
    } else {
        //console.log('获取所有用户信息');
        User.getAllUsers(function (err, result) {
            if (err) {
                return next(err);
            }
            if (result) {
                return res.render('admin/userlist', {
                    users: result
                });
            }
            res.json({
                code: 0,
                msg: 'error'
            })
        })
    }
}


/**
 * 执行用户信息的修改
 * @param req
 * @param res
 * @param next
 */
exports.doUser = function (req, res, next) {
    let id = req.body.id;
    let email = req.body.email;
    let phone = req.body.phone;
    let info = req.body.info;

    var user = new User({
        id,
        email,
        phone,
        info
    });

    user.updateinfo(function (err, result) {
        if (err) {
            return next(err);
        }

        // console.log(result);

        // 修改成功， 就会重新渲染
        if (result && result.affectedRows > 0) {
            return res.json({
                code: 1,
                msg: 'success'
            })
        }


        res.json({
            code: 0,
            msg: 'faild'
        });
    });
}


/**
 * 执行删除操作
 * @param req
 * @param res
 * @param next
 */
exports.doDelete = function (req, res, next) {
    var id = req.body.id;
    if (!id) {
        return res, json({
            code: 0,
            msg: 'error'
        });
    }

    User.deleteUserById(id, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result) {
            return res.json({
                code: 1,
                msg: 'success'
            });
        }
        res.json({
            code: 0,
            msg: 'faild'
        });
    })
}


