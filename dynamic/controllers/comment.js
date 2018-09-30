"use strict";

const Comment = require('../models/comment');
const moment = require('moment');

// 使用中文显示时间
moment.locale('zh-cn');


/**
 * 展示用户的评论详细信息
 * @param req
 * @param res
 * @param next
 */
exports.showComment = function (req, res, next) {
    // 获取当前显示的页数
    let pageNow = parseInt(req.params.currentPage);
    let pageSize = req.app.locals.config.pageSize;
    // 每页显示5个
    let params = {
        // (pageNo-1)*pageSize
        start: (pageNow - 1) * pageSize,
        pageSize: pageSize
    }

    // console.log(params);
    //console.log(pageSize, pageNow)

    // 获取
    if (pageNow === 1) {
        let id = req.session.user.id;
        Comment.getCommentsById(id, function (err, result) {
            if (err) {
                return next(err);
            }
            // 修改时间显示的格式
            if (result) {
                // 在这里把时间修改为相对事件
                result.forEach(function (element) {
                    element.addtime = moment(element.addtime).format('YYYY-MM-DD HH:mm:ss');
                })
            }
            let ret = [result[0], result[1], result[2], result[3], result[4]];
            // 向上取整
            let pageNum = Math.ceil(result.length / pageSize);
            //console.log(pageNum, ret)
            return res.render('user', {
                code : 1,
                comments: ret,
                pageNum : pageNum
            });
        })
        return;
    }


    // console.log(params)
    // 开始去数据库中查询数据信息
    Comment.getCommentByCurrentPage(params, function (err, result) {
        if (err) {
            return next(err);
        }

        // 修改时间显示的格式
        result.forEach(function (element) {
            element.addtime = moment(element.addtime).startOf('second').fromNow();
        })

        // console.log(result)
        // 开始渲染数据到前台
        res.json('play', {
            user : req.session.user,
            code: 1,
            comments: result
        });
    });

}

