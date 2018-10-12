SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for movies
-- ----------------------------
DROP TABLE IF EXISTS `movies`;
CREATE TABLE `movies` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) DEFAULT NULL,
  `url` varchar(250) DEFAULT NULL,
  `info` varchar(500) DEFAULT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `score` varchar(50) DEFAULT NULL,
  `playnum` int(50) DEFAULT NULL,
  `commentnum` int(50) DEFAULT NULL,
  `release_time` datetime DEFAULT NULL,
  `addtime` datetime DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=130569 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of movies
-- ----------------------------
INSERT INTO `movies` VALUES ('130183', '铁道飞虎', 'http://www.iqiyi.com/v_19rr9tqg20.html', '成龙带你干票大的！', 'http://pic5.iqiyipic.com/image/20180219/96/38/v_111512405_m_601_m3_180_236.jpg', '<strong class=\"num\">9</strong>.0', '0', '0', '2018-09-03 22:41:42', '2018-09-03 22:41:41', '电影');
INSERT INTO `movies` VALUES ('130184', '环太平洋：雷霆再起', 'http://www.iqiyi.com/v_19rr7qhfyg.html', '景甜开挂拯救世界', 'http://pic7.iqiyipic.com/image/20180623/75/24/v_112855233_m_601_m7_180_236.jpg', '<strong class=\"num\">8</strong>.2', '1', '0', '2018-09-03 22:41:42', '2018-09-03 22:41:41', '电影');
INSERT INTO `movies` VALUES ('130321', '王牌逗王牌', 'http://www.iqiyi.com/v_19rr97rjk0.html', '华仔黄晓明夺宝救世界', 'http://pic3.iqiyipic.com/image/20180219/94/56/v_111197428_m_601_m4_180_236.jpg', '<strong class=\"num\">8</strong>.5', '0', '0', '2018-09-04 08:24:50', '2018-09-04 08:24:48', '电影');
INSERT INTO `movies` VALUES ('130325', '疯狂的麦克斯3', 'http://www.iqiyi.com/v_19rr9uqbg8.html', '日战士勇破雷电堡', 'http://pic1.iqiyipic.com/image/20180219/37/d2/v_111660609_m_601_m3_180_236.jpg', '<strong class=\"num\">8</strong>.0', '0', '0', '2018-09-04 08:24:50', '2018-09-04 08:24:48', '电影');
INSERT INTO `movies` VALUES ('130351', '鬼手传奇之寒食帖', 'http://www.iqiyi.com/v_19rrc3cm80.html', '三垣五相古玩做局', 'http://pic8.iqiyipic.com/image/20180424/fc/99/v_115642361_m_601_m3_180_236.jpg', '<strong class=\"num\">7</strong>.9', '3', '0', '2018-09-04 08:24:50', '2018-09-04 08:24:48', '电影');
INSERT INTO `movies` VALUES ('130356', '特种部队2：全面反击', 'http://www.iqiyi.com/v_19rrfxa8lw.html', '忍者悬崖狂厮杀', 'http://pic6.iqiyipic.com/image/20180212/06/9f/v_50625966_m_601_m7_180_236.jpg', '<strong class=\"num\">8</strong>.8', '0', '0', '2018-09-04 08:24:50', '2018-09-04 08:24:48', '电影');
INSERT INTO `movies` VALUES ('130360', '我在黑社会的日子', 'http://www.iqiyi.com/v_19rrjasd24.html', '发哥打造古惑仔雏形', 'http://pic3.iqiyipic.com/image/20180717/3f/68/v_50087260_m_601_m7_180_236.jpg', '<strong class=\"num\">8</strong>.5', '0', '0', '2018-09-04 08:24:50', '2018-09-04 08:24:48', '电影');
INSERT INTO `movies` VALUES ('130366', '玩命', 'http://www.iqiyi.com/v_19rrc9drvg.html', '中国硬汉绝不认命', 'http://pic1.iqiyipic.com/image/20180331/55/0f/v_115367665_m_601_m3_180_236.jpg', '<strong class=\"num\">8</strong>.1', '2', '0', '2018-09-04 08:24:50', '2018-09-04 08:24:48', '电影');
INSERT INTO `movies` VALUES ('130372', '末代皇帝（上）', 'http://www.iqiyi.com/v_19rr7mmpfg.html', '奥斯卡金像奖最佳影片', 'http://pic6.iqiyipic.com/image/20180220/e3/91/v_112891805_m_601_m2_180_236.jpg', '<strong class=\"num\">8</strong>.5', '1', '0', '2018-09-04 08:24:50', '2018-09-04 08:24:48', '电影');
INSERT INTO `movies` VALUES ('130373', '百变星君', 'http://www.iqiyi.com/v_19rrk62ru4.html', '周星驰化身百变金刚', 'http://pic4.iqiyipic.com/image/20180212/cc/a9/v_50236128_m_601_m4_180_236.jpg', '<strong class=\"num\">9</strong>.1', '1', '0', '2018-09-04 08:24:50', '2018-09-04 08:24:48', '电影');
INSERT INTO `movies` VALUES ('130374', '脱皮爸爸', 'http://www.iqiyi.com/v_19rr7p4964.html', '吴镇宇爆笑“穿越”', 'http://pic6.iqiyipic.com/image/20180607/d6/8e/v_112875593_m_601_m5_180_236.jpg', '<strong class=\"num\">8</strong>.1', '0', '0', '2018-09-04 08:24:50', '2018-09-04 08:24:48', '电影');
INSERT INTO `movies` VALUES ('130375', '天地玄门', 'http://www.iqiyi.com/v_19rrho5yi0.html', '林正英穿梭时空五百年', 'http://pic1.iqiyipic.com/image/20180213/19/1e/v_62646217_m_601_m5_180_236.jpg', '<strong class=\"num\">8</strong>.5', '0', '0', '2018-09-04 08:24:50', '2018-09-04 08:24:48', '电影');
INSERT INTO `movies` VALUES ('130377', '杀手之王', 'http://www.iqiyi.com/v_19rrifm5kn.html', '杀手之王抢夺复仇基金', 'http://pic0.iqiyipic.com/image/20180212/75/ac/v_50347099_m_601_m3_180_236.jpg', '<strong class=\"num\">8</strong>.9', '0', '0', '2018-09-04 08:24:50', '2018-09-04 08:24:48', '电影');
INSERT INTO `movies` VALUES ('130554', '异形魔怪', 'http://www.iqiyi.com/v_19rrhx25to.html', '蠢蠢欲动的异形怪兽', 'http://pic0.iqiyipic.com/image/20180216/e8/ae/v_106695857_m_601_m4_180_236.jpg', '<strong class=\"num\">8</strong>.1', '0', '0', '2018-09-04 17:10:17', '2018-09-04 17:10:14', '电影');
INSERT INTO `movies` VALUES ('130560', '空中监狱', 'http://www.iqiyi.com/v_19rrjbauxc.html', '杀人狂魔劫机全纪录', 'http://pic0.iqiyipic.com/image/20180211/3b/fb/v_50075927_m_601_m13_180_236.jpg', '<strong class=\"num\">8</strong>.8', '0', '0', '2018-09-04 17:10:17', '2018-09-04 17:10:14', '电影');
INSERT INTO `movies` VALUES ('130563', '师兄撞鬼', 'http://www.iqiyi.com/v_19rrj55ek0.html', '冤死警察变鬼破案', 'http://pic7.iqiyipic.com/image/20180211/c3/62/v_50014879_m_601_m4_180_236.jpg', '<strong class=\"num\">8</strong>.8', '0', '0', '2018-09-04 17:10:17', '2018-09-04 17:10:14', '电影');
INSERT INTO `movies` VALUES ('130566', '少林木人巷', 'http://www.iqiyi.com/v_19rrk4b63o.html', '成龙傻小子变大侠', 'http://pic9.iqiyipic.com/image/20180212/2e/7e/v_50268386_m_601_m5_180_236.jpg', '<strong class=\"num\">8</strong>.2', '0', '0', '2018-09-04 17:10:17', '2018-09-04 17:10:14', '电影');
INSERT INTO `movies` VALUES ('130568', '东北往事之破马张飞', 'http://www.iqiyi.com/v_19rr9ssm48.html', '马丽贾乃亮热血开战', 'http://pic0.iqiyipic.com/image/20180219/d1/db/v_111518215_m_601_m3_180_236.jpg', '<strong class=\"num\">7</strong>.9', '0', '0', '2018-09-04 17:10:17', '2018-09-04 17:10:14', '电影');
