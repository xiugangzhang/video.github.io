"use strict";

const Comments = require('../models/comment');
const moment = require('moment');
moment.locale('zh-cn');
const Movie = require('../models/movie');
const MovieCol = require('../models/moviecol');
const xss = require('xss');

/**
 * 电影播放页面
 * @param req
 * @param res
 * @param next
 */
exports.showPlay = function (req, res, next) {
    // 开始播放url地址中的视频http://www.iqiyi.com/v_19rr7pi4k4.html
    let url = req.params.url;
    // v_19rr7pi4k4.html
    url = 'http://www.iqiyi.com/' + url;
    let tempUrl = url;
    let parseUrl = req.app.locals.config.parseUrl;
    let playUrl = parseUrl + url;


    // 如果用户在切换电影（上一个/下一个），我就随机从数据库中查询出来一条数据返回给用户
    let index = req.params.index;
    if (index == 0) {
        Movie.getOneRandomMovie(function (err, result) {
            if (err) {
                return next(err);
            }
            if (result.length) {
                let url = result[0].url;
                url = url.toString().substring(url.toString().lastIndexOf('/') + 1)
                result[0].url = url;
            }
            return res.json({
                code: 1,
                movie: result
            });
        })
        return;
    }


    // 根据Url地址获取电影的详细信息（其他的所有情况处理）
    Movie.getMovieByUrl(url, function (err, movie) {
        if (err) {
            return next(err);
        }
        if (movie.length) {
            movie = movie[0];
            movie.addtime = moment(movie.addtime).format('YYYY-MM-DD')
            movie.score = movie.score.toString().match(/\d/g).toString().replace(',', '.');
        }

        // 每次进来之后，开始去数据库中修改这个电影的播放次数信息
        Movie.updatePlayNumsByUrl(url, function (err, result) {
            if (err) {
                return next(err);
            }

            // 获取评论信息数量
            Comments.getCommentNums(function (err, pageInfo) {
                if (err) {
                    return next(err);
                }
                // console.log(pageInfo);
                // 每页显示5个
                let params = {
                    // (pageNo-1)*pageSize
                    start: 0,
                    pageSize: 5
                }
                let pageNums = pageInfo.pageNums;
                //console.log('页面评论总数量', pageNums, Math.ceil(pageNums / 5))

                //console.log('数据库记录' + pageNums);
                // 获取当前页面的所有评论信息
                Comments.getCommentByCurrentPage(params, function (err, comments) {
                    if (err) {
                        return next(err);
                    }

                    // 获取得到的结果数组，修改日期的格式信息
                    comments.forEach(function (element) {
                        // 设置为时间格式，几天前
                        element.addtime = moment(element.addtime).startOf('second').fromNow();
                    })


                    // 获取用户收藏的电影信息
                    let isCollectMovie = false;
                    if (req.session.user) {
                        let uid = req.session.user.id;
                        let parmas = {
                          uid : uid,
                          url : tempUrl
                        };
                        // 获取电影收藏的详细信息
                        MovieCol.getMovieColByUserId(parmas, function (err, result) {
                            if (err) {
                                return next(err);
                            }
                            // console.log(result);
                            // 如果用户收藏了这个电影的话
                            if (result.length > 0) {
                                isCollectMovie = true;
                            }
                            //console.log(movie);
                            return res.render('play', {
                                user: req.session.user,
                                comments: comments,
                                pageNum: Math.ceil(pageNums / 5),
                                playUrl: playUrl,
                                movie: movie,
                                comemntNum: pageNums,
                                isCollectMovie: isCollectMovie
                            });
                        })
                        return;
                    }

                    //console.log(movie);
                    res.render('play', {
                        user: req.session.user,
                        comments: comments,
                        pageNum: Math.ceil(pageNums / 5),
                        playUrl: playUrl,
                        movie: movie,
                        comemntNum: pageNums,
                        isCollectMovie: isCollectMovie
                    });
                })
            })
        })
    })
}


/**
 * 开始发布用户评论
 * @param req
 * @param res
 * @param next
 */
exports.doPlay = function (req, res, next) {
    // 1. 接受用户提交的数据信息
    let content = req.body.content;
    // 直接把当前时间转换为标准时间格式HH是24小时的，hh是12小时的
    let addtime = moment().format('YYYY-MM-DD HH:mm:ss')
    // 用户的ID编号
    let user_id = req.session.user.id;

    content = xss(content) + '';
    content = content.trim();
    if (content.length == 0) {
        return res.json({
            code : -1,
            msg : '参数解析失败'
        });
    }

    //console.log('当前的用户ID是：' + user_id);
    // 2. 基本的数据校验
    // 3. 开始进行业务逻辑处理
    let comments = new Comments({
        content,
        addtime,
        user_id
    })
    comments.save(function (err, result) {
        if (err) {
            return next(err);
        }

        let insertId = result.insertId;
        if (insertId <= 0) {
            return res.json({
                code: 0,
                msg: 'faild'
            });
        }

        // 向客户端返回状态信息
        return res.json({
            code: 1,
            id: insertId,
            msg: 'success'
        });
    })

}


