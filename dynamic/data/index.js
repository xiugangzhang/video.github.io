"use strict";


const https = require('https');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const qs = require('querystring');


// 初始化抓取的url地址信息
let option1 = {
    hostname: 'so.iqiyi.com',
    path: 'http://so.iqiyi.com/so/q_' + qs.escape('战狼2'),  // 默认的搜索内容
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'utf-8',  //这里设置返回的编码方式 设置其他的会是乱码
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'Host': 'so.iqiyi.com',
        'Referer': 'http://so.iqiyi.com/so/q_%E6%88%98%E7%8B%BC2?source=history&sr=1242959264208',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
    }
};

let option2 = {
    hostname: 'www.iqiyi.com',
    path: 'http://vip.iqiyi.com/hot.html?cid=2',  // 默认的搜索内容
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'utf-8',  //这里设置返回的编码方式 设置其他的会是乱码
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'Host': 'so.iqiyi.com',
        'Referer': 'www.iqiyi.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
    }
};


/**
 * 用于获取搜索
 */
exports.searchMovie = function (keyword, callback) {
    // 开始抓取之前先修改数据
    option1.path = 'http://so.iqiyi.com/so/q_' + qs.escape(keyword);
    // 开始发送http请求（get方式）
    https.get(option1, function (res) {
        let html = '';
        // 设置编码为二进制方式
        res.setEncoding('utf-8');
        // 开始监听数据的抓取，以流的方式获取数据
        res.on('data', function (chunk) {
            html += chunk;
        });
        // 接受完毕之后的响应事件
        res.on('end', function () {
            let $ = cheerio.load(html);
            let figures = $('.figure');
            let infos = $('.result_info_txt');
            let res = [];
            figures.each(function (index) {
                let href = $(this).attr('href');
                if (res.length < 3) {
                    res.push({
                        title: keyword,
                        url: href,
                        info: $(infos[index]).text().trim()
                    });
                }
            })
            callback(null, res);
        });
    }).on('err', function (err) {
        callback(err, null);
    });
}


/**
 * 获取电视剧列表信息
 * @param callback
 */
exports.getTVsOnline = function (callback) {
    https.get(option2, function (res) {
        let html = '';
        res.setEncoding('utf-8');
        //监听data事件，每次取一块数据
        res.on('data', function (chunk) {
            html += chunk;
        });
        let  result = [];
        res.on('end', function () {
            let $ = cheerio.load(html);
            let tvs = $('.site-piclist_pic_link');
            let infos = $('.site-piclist_info_describe');
            tvs.each(function (index) {
                let title = $(this).attr('title').trim();
                let href = $(this).attr('href');
                let info = $(infos[index]).text().trim();
                result.push({
                    url : href,
                    title : title,
                    info : info
                })
            })
            callback(null, result);
        }).on('err', function (err) {
            if (err) {
                callback(err, null);
            }
        });
    });
}


/**
 * 在线抓取电影列表的详细信息
 * @param callback
 */
exports.getMoviesOnline = function (url, callback) {
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

        return;
        // 在这里判断
        if (movieList.length === len) {
            saveImages(movieList, function (err, movieList) {
                if (err) {
                    callback(err, null);
                }

                //console.log('本轮抓取到数据共计' + len + '条---------------------------------------------')
                // 把当前数据挂载起来
                req.app.locals.config.movielist = movieList;


                callback(null, movieList);
            })

        }
    });
}


/**
 * 保存抓取的图像到本地
 * @param movieList
 * @param callback
 */
function saveImages(movieList, callback) {
    let nums = movieList.length;
    let tempArr = [];
    if (movieList && movieList.length > 0) {
        movieList.forEach(function (item) {
            // 保存成功之后，开始下载图片到本地 saveDir = '/www/uploads/movie/' + time + '.jpg';
            let url = item.url.substring(item.url.lastIndexOf('/')+1);
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