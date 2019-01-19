"use strict";

const MovieCol = require('../models/moviecol');

/**
 * 用于处理用户的 收藏电影的请求
 * @param req
 * @param res
 * @param next
 */
exports.doColMovie = function (req, res, next) {
    let movieurl = req.body.url;
    let uid = req.session.user.id;
    let tag = req.params.tag;

    // 去除特殊字符
    movieurl.replace('#', '');
    // 开始还原为最初始的url地址http://www.iqiyi.com/v_19rrk2p2mo.html
    movieurl = 'http://www.iqiyi.com/' + movieurl;

    if (!movieurl || !uid) {
        return res.json({
            code : 0,
            msg : 'faild'
        });
    }
    let colmovie = new MovieCol({
        movieurl,
        uid
    })
    if (tag == 0) {
        // 收藏
        colmovie.save(function (err, result) {
            if (err) {
                return next(err);
            }
            if (!result.insertId > 0) {
                return res.json({
                    code : 0,
                    msg : 'faild'
                });
            }
            res.json({
                code : 1,
                msg : 'success'
            });
        })
    } else if (tag == 1) {
        // 删除 (取消电影收藏的列表信息)
        MovieCol.deleteColMovie(uid, movieurl, function (err, result) {
            if (err) {
                // console.log(err);
                return res.json({
                    code : 0,
                    msg : 'faild'
                });
            }

            return res.json({
                code : 1,
                msg : 'success'
            });
        })
    }

}


/**
 *获取用户收藏的电影信息
 * @param req
 * @param res
 * @param next
 */
exports.showUserColMovie = function (req, res, next) {
    let uid = req.session.user.id;
    let tag = req.body.tag;
    if (tag !== 'comment') {
        return res.json({
            err : 0,
            msg  : 'faild'
        });
    }
    MovieCol.getColMovieDetails(uid, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result.length) {
            result.forEach(function (element) {
                let url = element.url;
                element.url = url.toString().substring(url.lastIndexOf('/')+1)
                element.url = '/play/' + element.url;
            });
        }
        return res.json({
            code : 1,
            msg : result
        });
    })
}