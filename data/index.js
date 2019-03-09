"use strict";


const https = require('https');
const fs = require('fs');
const path = require('path');
const db = require('../models/db');
const request = require('request');
const cheerio = require('cheerio');
const qs = require('querystring');
const Movie = require('../models/movie');
const TV = require('../models/tv');


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

// get tvs
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

// getmovies
let option3 = {
    hostname: 'www.iqiyi.com',
    path: 'http://vip.iqiyi.com/hot.html?cid=1',  // 默认的搜索内容
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'utf-8',  //这里设置返回的编码方式 设置其他的会是乱码
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'Host': 'vip.iqiyi.com',
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
        let result = [];
        res.on('end', function () {
            let $ = cheerio.load(html);
            let tvs = $('.site-piclist_pic_link');
            let infos = $('.site-piclist_info_describe');
            tvs.each(function (index) {
                let title = $(this).attr('title').trim();
                let href = $(this).attr('href');
                let info = $(infos[index]).text().trim();
                result.push({
                    url: href,
                    title: title,
                    info: info,
                    type : '电视剧'
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
exports.getMoviesOnline = function (callback) {
    let movieList = [];
    https.get(option3, function (res) {
        let html = '';
        res.setEncoding('utf-8');
        //监听data事件，每次取一块数据
        res.on('data', function (chunk) {
            html += chunk;
        });
        res.on('end', function () {
            // 获取网站内容并转换
            var $ = cheerio.load(html);
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

                        // 在这里判断
                        if (movieList.length === len) {
                            console.log('本轮抓取到数据共计' + len + '条---------------------------------------------')
                            callback(null, movieList);
                        }
                    }
                })
            }
        }).on('err', function (err) {
            if (err) {
                callback(err, null);
            }
        });
    })
}



/**
 * 专门用于下载数据库中的电影图片到本地，以电影编号的ID来命名
 * @param req
 * @param res
 * @param next
 */
exports.getTVAndImages = function (callback) {
    // 下载图片之前，开始抓取电视剧信息
    console.log('开始抓取电视剧信息')
    this.getTVsOnline(function (err, result) {
        if (err) {
            return console.log(err);
        }
        // 开始插入数据到数据库, 插入到数据库之前，先删除之前的数据信息
        db.query("delete from tvs", function (err) {
            if (err) return console.log(err);
            let index = 0;
            if (result.length > 0) {
                result.forEach(function (element) {
                    let title = element.title;
                    let info = element.info;
                    let url = element.url;
                    let type = element.type;
                    let tv = new TV({
                        title,
                        info,
                        url,
                        type
                    });
                    tv.save(function (err, res) {
                        if (err) {
                            return console.log(err);
                        }
                        index++;
                        if (result.length === index) {
                            console.log('本轮抓取全部电视剧信息成功')
                            callback(null, true);

                            // 添加轮播图信息
                            downloadImages(function (err, result) {
                                if (err) return console.log(err)
                                console.log('本轮数据抓取结束！')
                            });
                        }
                    });
                })
            }
        })
    })
}


/**
 * 抓取图片
 * @param callback
 */
function downloadImages(callback) {
    setTimeout(function () {
        // 先清空之前的数据
        delDir('./www/uploads/movie/');
        // 然后创建新的文件夹
        if (!fs.existsSync('./www/uploads/movie/')) {
            fs.mkdirSync("./www/uploads/movie/");
        }



        // 下载数据库图片到本地
        Movie.getAllMovies(function (err, result) {
            if (err) {
                return callback(err, null);
            }
            console.log('开始抓取图片信息…………………………');
            let len = 0;
            result.forEach(function (element) {
                let newPath = './www/uploads/movie/' + element.id+ '.jpg';
                // 开始下载图片数据信息
                request(element.logo).pipe(fs.createWriteStream(newPath));
                len++;
                if (len == result.length) callback(null, {status : true});
            });
        })
    }, 1000*20)     // 20s 之后，开始下载图片
}

function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
    }
}
