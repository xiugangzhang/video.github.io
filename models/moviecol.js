const db = require('../models/db');

/**
 * 用户收藏的电影详细信息
 * @param moviecol
 * @constructor
 */
function MovieCol(moviecol) {
    this.movie_url = moviecol.movieurl;
    this.user_id = moviecol.uid;
}



/**
 * 保存用户收藏的电影信息
 * @param callback
 */
MovieCol.prototype.save = function (callback) {
    db.query('insert into colmovie values (null, ?, ?, NOW())',
        [this.movie_url, this.user_id], function (err, result) {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        })
}


/**
 * 获取收藏信息
 * @param callback
 */
MovieCol.getMovieColByUserId = function (params, callback) {
    db.query('select * from colmovie where user_id = ? and movie_url = ?', [params.uid, params.url], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}


/**
 * 直接物理删除用户收藏的电影信息
 * @param uid
 * @param callback
 */
MovieCol.deleteColMovie = function (uid, url, callback) {
    db.query('delete from colmovie where user_id = ? and movie_url = ?', [uid, '' + url + ''],
        function (err, result) {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        })
}


/**
 * 获取用户的收藏电影的详细信息
 * @param uid
 * @param callback
 */
MovieCol.getColMovieDetails = function(uid, callback){
    db.query('select movies.title as title, movies.id as id, movies.info as info, colmovie.addtime as addtime, movies.url as url from movies , colmovie WHERE movies.url = colmovie.movie_url and colmovie.user_id = ?', [
        uid
    ], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}


module.exports = MovieCol;