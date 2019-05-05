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
    let pageNow = parseInt(req.params.currentPage) || 1;
    let pageSize = req.app.locals.config.pageSize;
    // 每页显示5个
    let params = {
        start: (pageNow - 1) * pageSize,
        pageSize: pageSize
    }
    // 开始查询总的数量信息
    Comment.getCommentNums(function (err, result) {
        if (err) {
            return next(err);
        }
        result = result.pageNums || 1;
        let pageNum = Math.ceil(result / pageSize);
        // 开始查询数据
        Comment.getCommentByCurrentPage(params, function (err, result) {
            if (err) {
                return next(err);
            }
            // 修改时间显示的格式
            result.forEach(function (element) {
                element.addtime = moment(element.addtime).startOf('second').fromNow();
            })
            // 开始渲染数据到前台
            res.json({
                code: 1,
                comments: result,
                pageNum : pageNum
            });
        });
    })

}

