"use strict";

const db = require('./db');


/**
 * 创建一个User对象，用于映射数据中的关系表
 * @param user
 * @constructor
 */
function User(user) {
    this.id = user.id;
    this.uname = user.uname;
    this.pwd = user.pwd;
    this.email = user.email;
    this.phone = user.phone;
    this.info = user.info;
    this.face = user.face;
    this.addtime = user.addtime;
}


/**
 * 获取所有的用户列表信息
 * @param callback
 */
User.getAllUsers = function(callback){
    db.query('select * from users', function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}


/**
 * 静态方法（由于我只需要获取用户信息，因此没必要在使用这个方法之前先去new 一个USER对象）
 * @param uname
 * @param callback
 */
User.getUserByName = function (uname, callback) {
    db.query(`select * from users where uname = ?`, [uname], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
}


/**
 * 根据用户ID编号获取用户详细信息
 * @param uid
 * @param callback
 */
User.getUserById = function (uid, callback) {
    db.query(`select * from users where id = ?`, [uid], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}

User.deleteUserById = function(id, callback){
    db.query('delete from users where id = ?', [id], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}

/**
 * 函数的原型方法（使用之前需要先new 一个实例对象， 然后就可以在线面直接使用this 这个属性了，  原型方法是子类实例都可以循环调用的）
 * @param callback
 */
User.prototype.save = function (callback) {
    // 这里直接使用mysql中内置的这个now()函数获取当前的时间信息
    db.query('insert into users values(null, ?, ?, ?, ?, ?, ?, Now())'
        , [this.uname, this.pwd, this.email, this.phone, this.info, this.face]
        , function (err, result) {
            if (err) {
                return callback(err, null);
            }

            // 返回插入数据的ID编号
            callback(null, result.insertId > 0);
        });

}


/**
 * 修改用户信息
 * @param callback
 */
User.prototype.update = function (callback) {
    //console.log('数据库中信息--------------------------', this)
    db.query('update users set  pwd = ?, email = ?, phone = ?, info = ?, face = ? where id = ?', [
        this.pwd, this.email, this.phone, this.info, this.face, this.id]
        , function (err, result) {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        })
}


/**
 * update user info
 * @param callback
 */
User.prototype.updateinfo = function(callback){
    db.query('update users set email = ?, phone = ?, info = ? where id = ?', [
        this.email, this.phone, this.info, this.id
    ], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


// 把当前的对象暴露出去
module.exports = User;
