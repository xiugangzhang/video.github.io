"use strict";

const db = require('./db');

/**
 * 用户评论表的处理
 * @param comments
 * @constructor
 */
function Comment(comments) {
    this.id = comments.id;
    this.content = comments.content;
    this.movie_id = comments.movie_id;
    this.user_id = comments.user_id;
    this.addtime = comments.addtime;
}


/**
 * 开始执行数据插入的操作
 * @param callback
 */
Comment.prototype.save = function (callback) {
    // 开始执行数据插入操作
    db.query('insert into comments values (null, ?, ?, ?, ?)', [
        this.content,
        this.movie_id,
        this.user_id,
        this.addtime
    ], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        //console.log('id------------------------------------', result)
        // 直接返回插入的ID编号信息
        callback(null, result);
    });
}


/**
 * 开始去数据中查询数据信息
 * @param id
 * @param callback
 */
Comment.getCommentsById = function (id, callback) {
    db.query('select users.id, users.uname, users.face, comments.addtime, comments.content  from users, comments where users.id = comments.user_id and comments.user_id = ? ORDER BY comments.addtime desc', [
        id
    ], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        // 返回查询到的第一行数据就行了
        callback(null, result);
    })
}


/**
 * 获取所有的评论列表集合
 * @param callback
 */
Comment.getCommentsList = function (callback) {
    // 获取所有用户的详细信息
    db.query('select users.id, users.uname, users.face, comments.addtime, comments.content  from users, comments where users.id = comments.user_id ORDER BY comments.addtime desc', [],
        function (err, result) {
            if (err) {
                return callback(err, null);
            }
            // 返回查询到的结果集合
            callback(null, result);
        })
}


/**
 * 获取当前页面的评论
 * @param params
 * @param callback
 */
Comment.getCommentByCurrentPage = function (params, callback) {
    //console.log(params)
    // select * from table limit (pageNo-1)*pageSize, pageSize;
    db.query('select users.id, users.uname, users.face, comments.addtime, comments.content from users, comments where users.id = comments.user_id ORDER BY comments.addtime desc LIMIT  ?, ?',
        [params.start, params.pageSize],
        function (err, result) {
        if (err) {
            callback(err, null);
        }
        callback(null, result);
    })
}


/**
 * 获取评论的总页数
 * @param callback
 */
Comment.getCommentNums = function (callback) {
    db.query('select count(*) as pageNums from comments', [], function (err, result) {
        if (err) [
            callback(err, null)
        ]
        callback(null, result[0]);
    });
}


/**
 * 用于获取用户的评论信息
 * @param callback
 */
Comment.getUserComment = function (uid, callback) {
    db.query('select * from comments where user_id = ?', [uid],
        function (err, result) {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
}



module.exports = Comment;