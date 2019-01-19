const db = require('./db');

/**
 * 电视剧列表的对象信息
 * @param tv
 * @constructor
 */
function TV(tv) {
    this.title = tv.title;
    this.info = tv.info;
    this.url = tv.url;
    this.addtime = tv.addtime;
    this.type = tv.type
}


/**
 * 保存抓取的电视剧信息
 * @param callback
 */
TV.prototype.save = function (callback) {
    db.query('insert into tvs values (null, ?, ?, ?, NOW(), ?)', [
        this.title, this.info, this.url, this.type
    ], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        // 插入完成之后开始进行数据去重
        db.query('delete from tvs where url  in ' +
            '   (select url from (select url from tvs group by url having count(url)>1) as tmp1) ' +
            '       and id not in (select id from (select min(id) as id from tvs group by url having count(url)>1) as temp2)', function (err, result) {
            if (err) {
                return  callback(err, null);
            }
            callback(null, result);
        });
    });
}


/**
 * 获取当前页面
 * @param params
 * @param callbaack
 */
TV.getTVSByCurrentPage = function(params, callbaack){
    db.query('select * from tvs limit ?, ?', [
        params.start, params.pageSize
    ], function (err, result) {
        if (err) {
            callbaack(err, null);
        }
        callbaack(null, result);
    });
}


/**
 * 获取电视剧的数量信息
 * @param callback
 */
TV.getTVPageNums = function(callback){
    db.query('select count(*) as pageNum from tvs', function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
}



module.exports = TV;