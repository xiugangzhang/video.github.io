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

