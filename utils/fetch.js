const FetchUtil = require('../data');
const Movie = require('../models/movie');
const db = require('../models/db')

// 开始抓取数据（每次用户重启服务器，或者3天抓取一次）
exports.start = function (isInstall, callback) {
    let peroid = 3 * 24 * 60 * 60* 1000;  // 3 天抓取一次

    // 这里需要判断一下用户是否为首次安装
    if (isInstall) {
        FetchMovies(function (error, status) {
            if (error) return callback(error, null);
            callback(null, true);
        });
    }else {
        var timer = setInterval(function () {
            console.log('开始本轮数据抓取，默认抓取周期为3天一次');
            FetchMovies(function (error, result) {
                if (error) return callback(error, null);
                callback(null, true);
            });
        }, peroid)
    }
}


/**
 * 抓取电影数据
 * @constructor
 */
function FetchMovies(callback) {
    // 调用数据抓取工具
    FetchUtil.getMoviesOnline(function (err, movies) {
        if (err) return callback(err, null);
        // 保存电影信息到数据库，添加数据之前先删除之前的数据，每次保持数据为最新状态
        db.query('delete from movies', function (err) {
            if (err) return console.log(err);
            let len = 0;
            movies.forEach( movie =>{
                let m = new Movie({
                    title : movie.title,
                    url : movie.url,
                    info : movie.info,
                    logo : movie.logo,
                    score : movie.score,
                    playnum : 0,
                    commentnum : 0,
                    release_time : new Date(),
                    type : '电影'
                })
                len++;
                m.save(function (err) {
                    if (err) console.log(err);
                })
                if (len == movies.length){
                    // 开始下载图片到本地/抓取其他数据
                    FetchUtil.getTVAndImages(function (err, result) {
                        if (err) return console.log(err);
                        console.log('电视剧信息全部入库成功，本轮抓取结束')
                        // 添加成功之后（开始把数据信息保存到文件中去）
                        callback(null, true);
                    })
                }
            })
        })
    });
}