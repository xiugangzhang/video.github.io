const db = require('./db');


/**
 * preview table
 * @param preview
 * @constructor
 */
function Preview(preview) {
    this.title = preview.title;
    this.content = preview.content;
    this.playurl = preview.playurl;
    this.imgurl = preview.imgurl;
}


/**
 * 获取电影详细信息
 * @param callback
 */
Preview.getPreview = function (callback) {
    db.query('select * from preview', function (err, result) {
        if (err) {
            callback(err, null);
        }
        callback(null, result);
    });
}


module.exports = Preview;