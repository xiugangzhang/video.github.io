// 数据抓取层，实现数据入库
"use strict";


const cheerio = require('cheerio');
const request = require('request');
const Movie = require('../models/movie');
const moment = require('moment');
const fs = require('fs');
const data = require('../data/index');
const TV = require('../models/tv');
const Comment = require('../models/comment');
const Preview = require('../models/preview');


/**
 * 添加电影的细节信息描述（未插入数据到数据库）
 * @param req
 * @param res
 * @param next
 */
exports.showMovieAddDetails = function (req, res, next) {
    let movieurl = req.app.locals.config.movieurl;
    // console.log(movieurl, '本轮数据抓取开始了');

    // 开始专区数据信息
    getMovieDetails(req, movieurl, function (err, result) {
        if (err) {
            return next(err);
        }

        // 开始返回结果信息（获取的是数组信息）
        if (result) {
            return res.json({
                code: 1,
                movies: result
            });
        }

        // 获取数据失败
        return res.json({
            code: 0,
            msg: 'faild'
        });
    });
}


/**
 * 展示电影详情页面
 * @param req
 * @param res
 * @param next
 */
exports.addMovie = function (req, res, next) {
    let checkNum = req.body.checkNum;
    // console.log('开始进行数据入库了', checkNum, req.app.locals.config.movielist)
    if (checkNum != -9999) {
        // console.log('传参不一致，返回');
        return res.json({
            code: 0,
            msg: '数据入库失败'
        })
    }


    // 开始获取用户抓取的结果
    let movieList = req.app.locals.config.movielist;
    // console.log('读取本地抓取记录', movieList)
    if (movieList) {
        // console.log('数据去重成功……………………, 有效记录', movieList.length - movieList.length, '条', '去重记录', movieList.length + '条')
        // 3. 开始把去重之后的数据插入到数据库
        let successNum = 0;
        movieList.forEach(function (item) {
            // 获取数据信息
            let url = item.url;
            let title = item.title;
            let logo = item.logo;
            let info = item.info;
            let score = item.score;
            let addtime = moment().format('YYYY-MM-DD HH:mm:ss');
            let playnum = 0;
            let commentnum = 0;
            let release_time = moment().format('YYYY-MM-DD HH:mm:ss');
            let type = '电影';

            // 记录下当前的时间点
            // let time = +new Date();
            // saveDir = '/www/uploads/movie/' + time + '.jpg';

            // 构造电影实例对象
            let movie = new Movie({
                title,
                url,
                info,
                logo,
                score,
                playnum,
                commentnum,
                addtime,
                release_time,
                type
            });
            movie.save(function (err, result) {
                if (err) {
                    return next(err);
                }

                result
                // 这个是最终去重之后的数据记录
                if (result.affectedRows > 0) {
                    return res.json({
                        code: 1,
                        msg: '数据入库成功，去除重复记录共计' + (movieList.length - successNum) + '条'
                    });
                }
            });


        })
    }
}


/**
 * 获取电影详细信息
 * @param url
 * @param callback
 */
function getMovieDetails(req, url, callback) {
    let movieList = [];
    request(url, function (err, res, body) {
        if (err) {
            return callback(err, null);
        }

        // 获取网站内容并转换
        var $ = cheerio.load(body);
        // 拿到电影的列表DOM元素
        let site_piclist = $('.site-piclist_pic_link');
        let site_piclist_info_describe = $('.site-piclist_info_describe');
        let score = $('.score');
        //let desc = $('.site-piclist_info_describe');
        let len = site_piclist.length;

        if (site_piclist && site_piclist.length > 0) {
            site_piclist.each(function (index) {
                var pic_item = site_piclist[index];
                if (pic_item) {
                    let href = $(pic_item).attr('href');
                    let title = $(pic_item).attr('title');
                    let img = $(pic_item).children()['0'];
                    let width = img['attribs']['width'];
                    let height = img['attribs']['height'];
                    // http://pic2.iqiyipic.com/image/20180822/7d/33/v_118006948_m_601_m4_180_236.jpg
                    let imgSrc = 'http:' + img['attribs']['data-src'];

                    //let movieinfoStr = `${href}, ${title}, ${width}, ${height}, ${imgSrc}, ${$(site_piclist_info_describe[index]).text()}, ${$(score[index]).html()}, ${$(desc[index]).text()}`;
                    movieList.push({
                        url: href,
                        title: title,
                        width: width,
                        height: height,
                        logo: imgSrc,
                        info: $(site_piclist_info_describe[index]).text(),
                        score: $(score[index]).html().trim(),
                    });

                }
            })
        }

        // 在这里判断
        if (movieList.length === len) {
            saveImages(movieList, function (err, movieList) {
                if (err) {
                    callback(err, null);
                }

                // 把当前数据挂载起来
                req.app.locals.config.movielist = movieList;
                callback(null, movieList);
            })

        }
    });
}


/**
 * 展示电影添加界面
 * @param req
 * @param res
 * @param next
 */
exports.showMovieAdd = function (req, res, next) {
    // 专门用于添加电影
    res.render('admin/movieadd');
}


/**
 * 当前的搜索电影页面
 * @param req
 * @param res
 * @param next
 */
exports.showSearchMovie = function (req, res, next) {
    res.render('search');
}


/**
 * 数据库中查询数据信息
 * @param req
 * @param res
 * @param next
 */
exports.doSearchMovie = function (req, res, next) {
    // 换一种思路来解析数据， 开始从网上抓取数据信息
    let searchMoviename = req.body.moviename;

    // 这里需要判断一下，如果用户输入的是url地址的话
    if (searchMoviename.startsWith('http')) {
        //searchMoviename = searchMoviename.substring(searchMoviename.lastIndexOf('/') + 1);
        searchMoviename = 'http://jx.598110.com/index.php?url=' + searchMoviename;

        // 开始获取用户评论的数据信息
        let params = {
            start : 0,
            pageSize : 5
        }
        // 获取评论的详细信息
        Comment.getCommentByCurrentPage(params, function (err, comments) {
            if (err) {
                return next(err);
            }

            // 获取评论数量信息
            Comment.getCommentNums(function (err, pageInfo) {
                if (err) {
                    return next(err);
                }
                let pageNum = pageInfo.pageNums;
                // 就直接解析当前地址， 然后播放视频
                return res.render('play', {
                    playUrl : searchMoviename,
                    comments : comments,
                    pageNum : Math.ceil(pageNum / 5),
                });
            })
        })
        return;
    }

    // 直接从爱奇艺网站抓取数据
    data.searchMovie(searchMoviename, function (err, movies) {
        if (err) {
            return next(err);
        }
        // 如果没有找到的话就去数据库中找一下
        if (movies.length === 0) {
            Movie.getMovieByName(searchMoviename, function (err, result) {
                if (err) {
                    return next(err);
                }
                if (result.length > 3) {
                    result = [result[0], result[1], result[2]];
                }
                result.forEach(function (element) {
                    let url = element.url;
                    element.url = url.substring(url.lastIndexOf('/') + 1)
                    element.addtime = moment(element.addtime).format('YYYY-MM-DD');
                    if(element.info.toString().length > 20) {
                        element.info = element.info.toString().substring(0, 30);
                    }
                })
                return res.render('search', {
                    movies: result
                });
            })
        } else {
            movies.forEach(function (element) {
                let url = element.url;
                element.url = url.substring(url.lastIndexOf('/') + 1)
                element.addtime = moment().format('YYYY-MM-DD');
                if(element.info.toString().length > 20) {
                    element.info = element.info.toString().substring(0, 30);
                }
            })
            // 返回抓取的所有信息
            return res.render('search', {
                movies: movies
            });
        }
    })
}


/**
 * 保存图片信息到本地
 * @param movieList
 */
function saveImages(movieList, callback) {
    let nums = movieList.length;
    let tempArr = [];
    if (movieList && movieList.length > 0) {
        movieList.forEach(function (item) {
            // 保存成功之后，开始下载图片到本地 saveDir = '/www/uploads/movie/' + time + '.jpg';
            let url = item.url.substring(item.url.lastIndexOf('/') + 1);
            if (url) {
                tempArr = url.toString().split('.');
                if (tempArr.length === 2) {
                    url = tempArr[0];
                }
                let newPath = './www/uploads/movie/' + (+new Date()) + url + '.jpg';
                // 开始下载图片数据信息
                request(item.logo).pipe(fs.createWriteStream(newPath));
                nums--;
                if (nums === 0) {
                    callback(null, movieList);
                }
            }
        })
    }
}




/**
 * 使用get请求获取电影的方式(使用get方式搜索需要设置权限)
 * @param req
 * @param res
 * @param next
 */
exports.doSearchMovieOnline = function (req, res, next) {
    let searchMoviename = req.params.content;
    if (!searchMoviename) {
        return;
    }

    // 这里需要判断一下，如果用户输入的是url地址的话
    if (searchMoviename.startsWith('http')) {
        //searchMoviename = searchMoviename.substring(searchMoviename.lastIndexOf('/') + 1);
        searchMoviename = 'http://jx.598110.com/index.php?url=' + searchMoviename;

        // 开始获取用户评论的数据信息
        let params = {
            start : 0,
            pageSize : 5
        }
        // 获取评论的详细信息
        Comment.getCommentByCurrentPage(params, function (err, comments) {
            if (err) {
                return next(err);
            }

            // 获取评论数量信息
            Comment.getCommentNums(function (err, pageInfo) {
                if (err) {
                    return next(err);
                }
                let pageNum = pageInfo.pageNums;
                // 就直接解析当前地址， 然后播放视频
                return res.render('play', {
                    playUrl : searchMoviename,
                    comments : comments,
                    pageNum : Math.ceil(pageNum / 5),
                });
            })
        })
        return;
    }

    // 直接从爱奇艺网站抓取数据
    data.searchMovie(searchMoviename, function (err, movies) {
        if (err) {
            return next(err);
        }
        // 如果没有找到的话就去数据库中找一下
        if (movies.length === 0) {
            Movie.getMovieByName(searchMoviename, function (err, result) {
                if (err) {
                    return next(err);
                }
                if (result.length > 3) {
                    result = [result[0], result[1], result[2]];
                }
                result.forEach(function (element) {
                    let url = element.url;
                    element.url = url.substring(url.lastIndexOf('/') + 1)
                    element.addtime = moment(element.addtime).format('YYYY-MM-DD');
                    if(element.info.toString().length > 20) {
                        element.info = element.info.toString().substring(0, 30);
                    }
                })
                return res.render('search', {
                    movies: result
                });
            })
        } else {
            movies.forEach(function (element) {
                let url = element.url;
                element.url = url.substring(url.lastIndexOf('/') + 1)
                element.addtime = moment().format('YYYY-MM-DD')
                if(element.info.toString().length > 20) {
                    element.info = element.info.toString().substring(0, 30);
                }
            })
            // 返回抓取的所有信息
            return res.render('search', {
                movies: movies
            });
        }
    })
}


/**
 * 获取今日热点电影数据
 * @param req
 * @param res
 * @param next
 */
exports.getTodayHotMovies = function (req, res, next) {
    // 开始获取Previews数据
    // 开始随机获取六个电影
    Movie.getRandomMovies(6, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result.length) {
            result.forEach(movie => {
                let url = movie.url + '';
                movie.url = url.substring(url.lastIndexOf('/') + 1)
            });
        }
        return res.json({
            code : 1,
            movies : result
        });
    })
}
