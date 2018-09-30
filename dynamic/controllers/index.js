"use strict";

const Movie = require('../models/movie');
const Preview = require('../models/preview');
const TV = require('../models/tv');


/**
 * 显示首页信息
 * @param req
 * @param res
 * @param next
 */
exports.showIndex = function (req, res, next) {
    // 为了实现ajax分页的效果
    let pageNow = req.params.currentPage || 1;
    let pageSize = 20;
    let params = {
        start: (pageNow - 1) * pageSize,
        pageSize: pageSize
    }
    let type = req.body.type;
    if (type === 'tv') {
        // 1. 获取电视列表所有信息
        TV.getTVSByCurrentPage(params, function (err, result) {
            if (err) {
                return next(err);
            }
            result.forEach(function (element) {
                let i = element.url.toString().lastIndexOf('/');
                if (i != -1) {
                    element.url = element.url.substring(i + 1);
                }
            });
            // 2. 获取电视列表的总数量信息
            TV.getTVPageNums(function (err, pageInfo) {
                if (err) {
                    return next(err);
                }
                let pageNum = Math.ceil(pageInfo.pageNum / pageSize);
                return res.json({
                    code: 1,
                    tvs: result,
                    tvPageNum: pageNum,
                });
            })
        })
    } else {
        // 获取首页轮播图效果
        Preview.getPreview(function (err, previews) {
            if (err) {
                return next(err);
            }
            // 设置url地址(传给前端页面)
            previews.forEach(function (element) {
                element.playurl = element.playurl.substring(element.playurl.lastIndexOf('/') + 1);
            });

            // 获取电影的数量信息
            Movie.getMoviePageNums(function (err, pageInfo) {
                if (err) {
                    return next(err);
                }
                // 开始计算分页的数量
                let pageNum = Math.ceil(pageInfo.pageNum / pageSize);
                // 展示首页的时候，开始去数据库中查询数据
                Movie.getMoviesByCurrentPage(params, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    // 这里需要对从数据库中取出来的url地址进行转换
                    // console.log(result);
                    if (result) {
                        // 测试ok
                        result.forEach(function (element) {
                            let i = element.url.toString().lastIndexOf('/');
                            if (i != -1) {
                                element.url = element.url.substring(i + 1);
                            }
                        })
                    }

                    // 用户注册成功的话，就去直接跳转到首页信息(如果是默认请求首页的话)
                    if (pageNow === 1) {
                        // 开始渲染
                        // console.log('开始渲染了')
                        return res.render('index', {
                            user: req.session.user,
                            movies: result,
                            pageNum: pageNum,
                            previews: previews,
                        });
                    }

                    // 主要问题，如果用户直接请求的是url地址，返回的是json 数据， 解决方式，使用POST请求
                    // 其他页面的话，就直接返回json数据信息(为了搜索引擎，这里不适用这种分页方式)
                    return res.json({
                        code: 1,
                        movies: result,
                        pageNum : pageNum
                    })
                })

            })
        })

    }

}