"use strict";


const svgCaptcha = require('svg-captcha');
const User = require('../models/user');
const utility = require('utility');   // 需要的MD5加密工具包
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const utils = require('../utils/utils');
const Userlog = require('../models/userlog');
const moment = require('moment');


/**
 * 展示用户注册的页面信息
 * @param req
 * @param res
 * @param next
 */
exports.showRegister = function (req, res, next) {
    // 由于之前已经配置了页面跳转的中间件，这里就直接跳转到这个注册页面就行
    res.render('register');
}


/**
 * 用户点击注册按钮之后的业务逻辑
 * @param req
 * @param res
 * @param next
 */
exports.doRegister = function (req, res, next) {
    // 1. 获取请求报文信息
    let uname = req.body.uname;
    let email = req.body.email;
    let phone = req.body.phone;
    let pwd = req.body.pwd2;
    // 验证码
    let vcode = req.body.vcode;
    // console.log(req.body);
    let addtime = new Date().toUTCString();
    let session_vcode = req.session.captcha;
    let info = '初来乍到，请多多关照哈！'
    let face = '/www/images/userlogo.gif';


    // 2. 对用户输入的数据进行二次校验，先来看一下输入的验证码是否正常
    if (session_vcode && session_vcode.toLowerCase() !== vcode.toLowerCase()) {
        // 验证码输入错误的话，就直接报错给用户
        return res.json({
            code: 1001,
            msg: '验证码输入错误'
        });
    }


    // 3. 验证码输入正确的前提下，开始去数据库中获取用户名信息，如果没有该用户信息，就把数据信息保存起来存储到数据库中去
    User.getUserByName(uname, function (err, result) {
        if (err) {
            return next(err);
        }
        // 如果已经存在了这个用户的话，就去告诉用户数据已经存在了
        if (result) {
            return res.json({
                code: 1002,
                msg: '用户名已存在'
            });
        }

        // 开始进行数据加密(对用户的密码进行双重加密+加上自己的密匙)
        pwd = utility.md5(pwd);
        // 对密码进行再次加密
        pwd = utility.md5(pwd + req.app.locals.config.secretKey);


        // 开始插入数据到数据库
        let user = new User({
            uname,
            email,
            phone,
            pwd,
            addtime,
            info,
            face
        });
        // 保存失败
        user.save(function (err, result) {
            if (err) {
                return next(err);
            }
            // 插入成功的话就会得到结果
            let uid = result.insertId;
            if (uid === 0) {
                // 插入失败
                return res.json({
                    code: 0,
                    msg: 'faild'
                });
            }

            // 用户注册成功的话，把当前插入的用户ID保存起来（唯一性，后面可以直接通过这个ID去获取这个用户的详细信息）
            user.id = uid;
            req.session.user = user;

            // 一次请求是不能发送两次响应的
            res.json({
                code: 1,
                msg: 'success'
            });
        });

    });

};


/**
 * 开始进入到注册页面
 * @param req
 * @param res
 * @param next
 */
exports.showLogin = function (req, res, next) {
    res.render('login');
}


/**
 * 处理用户提交的数据信息
 * @param req
 * @param res
 * @param next
 */
exports.doLogin = function (req, res, next) {
    // 1. 获取用户输入的参数信息
    let uname = req.body.uname;
    let pwd = req.body.pwd;
    let vcode = req.body.vcode;
    let session_vcode = req.session.captcha;
    let login_time = moment().format('YYYY-MM-DD HH:mm:ss');
    if (!uname || !pwd || !vcode || !session_vcode) {
        return res.json({
            code : -1,
            msg : '请求解析失败'
        });
    }
    // 开始获取用户的默认IP信息
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    // 开始获取用户的地址信息
    let address = '未知地址';
    if (session_vcode && vcode.toLowerCase() !== session_vcode.toLowerCase()) {
        return res.json({
            code: 1001,
            msg: '验证码输入错误'
        });
    }

    let ipInfo = utils.getIPInfo(ip);
    let area = ipInfo.Area && ipInfo.Area.indexOf('本机地址') !== -1 ? ipInfo.Area : '';
    address = `${ipInfo.Country}${area}`;

    // 2. 开始校验（防止用户端禁用js）， 查询比对的实际上是加密过后的数据信息
    // 开始进行数据加密(对用户的密码进行双重加密+加上自己的密匙)
    pwd = utility.md5(pwd);
    // 对密码进行再次加密
    pwd = utility.md5(pwd + req.app.locals.config.secretKey);

    // 3. 开始具体的业务逻辑校验
    // 3.1 用户是否存在（根据用户名查询出来用户记录信息）
    User.getUserByName(uname, function (err, result) {
        // 如果结果不存在的话
        if (!result) {
            // 用户不存在
            return res.json({
                code: 0,
                msg: '该用户不存在'
            });
        }

        // 用户存在的话就开始校验密码是否正确
        if (pwd !== result.pwd) {
            return res.json({
                code: 0,
                msg: '密码错误'
            });
        }
        // 写入数据到session
        req.session.user = result;
        // 获取用户的ID信息
        let user_id = result.id;


        // console.log(login_time, ip, address, user_id);
        // 用户登录成功之后，开始吧用户的登录日志写入到数据库
        let userlog = new Userlog({
            login_time,
            ip,
            address,
            user_id
        });
        // console.log(address, userlog, result);
        // 3.2 密码是否正确,如果密码正确，就直接写入数据到session，跳转到首页
        userlog.save(function (err, result) {
            if (err) {
                return next(err);
            }
            //console.log('用户的登录日志文件已经成功写入到数据库！', result)
        })

        // 跳转到首页
        res.json({
            code: 1,
            msg: 'success'
        });
    });
}


/**
 * 进入用户管理中心的界面
 * @param req
 * @param res
 * @param next
 */
exports.showUser = function (req, res, next) {
    res.render('user', {
        // 为了使得头部的显示正常
        user: req.session.user
    });
}


/**
 * 实现用户的退出
 * @param req
 * @param res
 * @param next
 */
exports.doLogout = function (req, res, next) {
    // 清空user的session，然后退出首页
    req.session.user = null;
    // 直接跳转到首页
    res.redirect('/');
}


/**
 * 处理文件上传的请求
 * @param req
 * @param res
 * @param next
 */
exports.uploadImage = function (req, res, next) {
    // 获取上传的目录
    let form = new formidable.IncomingForm();
    // 默认把用户上传的图片放在了一个临时目录中， 但是这个文件是没有后缀名称的(文件上传路径)
    // 这里从配置文件中读取数据信息
    // form.uploadDir = './www/uploads';
    form.uploadDir = req.app.locals.config.avatarDir;  // 绝对路径

    // console.log("开始上传文件了");
    // 如果只在这里接受图片类型。需要进行后缀名判断
    // 这个第三方包默认是把路径放在了一个临时文件夹下面（temp文件夹）
    form.parse(req, function (err, fileds, files) {
        if (err) {
            return next(err);
        }

        // filds里面存储了传递过来的字段信息（使用FormData可以实现异步上传一个二进制文件 ）
        // console.log(files);
        // 开始移动文件到我的网站目录下面(键值对的方式来获取图片数据)[这里要与前台的键值对一致]
        let pic = files.pic;
        let size = pic.size;
        // 1MB 的大小
        if (size > 1024 * 1024) {
            return res.json({
                code: 0,
                msg: '请不要上传大于1MB的文件！'
            });
        }


        // 不包含文件后缀
        let tempPath = pic.path;
        let extName = path.extname(pic.name);
        // 新的文件路径名称(包含文件后缀)
        let newpath = tempPath + extName;
        req.session.user.face = `/www/uploads/avatar/${path.basename(newpath)}`;
        // console.log(req.session.user.face);

        //【error】 原生的nodejs是不支持跨盘符来移动数据的
        // 移动文件到新的目录下面（临时目录到网站的根目录）
        fs.rename(tempPath, newpath, function (err) {
            if (err) {
                return next(err);
            }

            // 刷新当前页面信息（这里类似于302 重定向）
            // 【注意】对于ajax请求这里是不能这样操作的
            // ajax这里需要返回一个JSON字符串,
            // 前台页面的刷新window.location..reload('') 和 window.location.href ='' (会跳转到一个新的URL地址)
            res.json({
                code: 1,
                msg: `/www/uploads/avatar/${path.basename(newpath)}${extName}`
            });


            // 修改服务器端的图片大小
            // 开始修改图片的大小(! 表示强制裁剪图像)
            /*gm(newpath).resize(100, 100).write(newpath, function (err) {
                if (err) {
                    return next(err);
                }
            })*/

        });
    });
}


/**
 * 用于修改用户的详细信息
 * @param req
 * @param res
 * @param next
 */
exports.doUser = function (req, res, next) {
    // 1. 获取表单参数信息
    let id = req.session.user.id;
    let uname = req.body.uname || req.session.user.uname;
    let pwd = req.session.user.pwd;
    let email = req.body.email || req.session.user.email;
    let phone = req.body.phone || req.session.user.phone;
    let info = req.body.info || req.session.user.info;
    // face 可以直接从修改之后的session中获取
    let face = req.session.user.face;

    // console.log('邮件修改前后对比：' + req.body.email, req.session.user.email, email)
    let pwd1 = req.body.pwd1;
    // 如果用户修改了密码的话
    let pwd2 = req.body.pwd2;
    // 用于修改密码
    let pwd3 = req.body.pwd3;  // pwd3

    // console.log(req.session.user);  // ok
    // 检测初始密码是否正确
    if (pwd3) {
        // 旧密码
        pwd1 = utility.md5(pwd1);
        // 对密码进行再次加密
        pwd1 = utility.md5(pwd1 + req.app.locals.config.secretKey);
        // 开始进行密码检验
        if (pwd1 !== pwd) {
            return res.json({
                code: 0,
                msg: 'error'
            });
        }

    }
    // console.log('密码校验结束', pwd, pwd1, pwd2, pwd3);
    // 为了实现修改密码和会员中心修改的同步性，使用这个变量用来区分会员中心和修改密码这两个模块的信息修改
    if (pwd3) {
        // console.log('我是要开始修改密码了');
        // 开始修改密码
        pwd2 = utility.md5(pwd2);
        // 对密码进行再次加密
        pwd = utility.md5(pwd2 + req.app.locals.config.secretKey);
    }

    let user = new User({
        id,
        uname,
        pwd,
        email,
        phone,
        info,
        face
    });


    // console.log(user, req.session.user.id);
    user.update(function (err, result) {
        // console.log(result);
        if (err) {
            return next(err);
        }

        if (result.changedRows > 0) {
            // 开始修改
            // 保存成功之后， 清空用户的session
            req.session.user = null;

            // 如果是修改密码的话，就直接跳转到登录首页(修改成功)
            // 跳转到首页
            /*res.json({
                code: 1,
                msg: 'success'
            });*/
            return res.json({
                code: 1,
                msg: 'success'
            });
        }

        // console.log(result.changedRows, result);
        return res.json({
            code: 0,
            msg: 'faild'
        });

    });
}


/**
 * 获取用户的日志详细记录信息
 * @param req
 * @param res
 * @param next
 */
exports.showUserlogs = function (req, res, next) {
    let id = req.session.user.id;
    // console.log(id);
    Userlog.getUserlogsById(id, function (err, result) {
        if (err) {
            return next(err);
        }
        // 转换日期格式信息
        if (result) {
            // 获取得到的结果数组，修改日期的格式信息
            result.forEach(function (element) {
                element.login_time = moment(element.login_time).format('YYYY-MM-DD HH:mm:ss');
            })

            res.json({
                code: 1,
                userlogs: result
            });
        }
    })
}


/**
 * 用户发送get请求的时候获取验证码
 * @param req
 * @param res
 * @param next
 */
exports.getCaptcha = function (req, res, next) {
    // 获取验证码
    //res.send('123456');
    let captcha = svgCaptcha.create();
    // 把数据写入到session对象里面（第一次访问的话默认是没有验证码信息的）
    req.session.captcha = captcha.text;
    //console.log('获取验证码！', req.session.captcha)
    // 设置类型
    res.type('svg');
    // console.log(captcha.data)
    res.status(200).send(captcha.data);
}



