SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tvs
-- ----------------------------
DROP TABLE IF EXISTS `tvs`;
CREATE TABLE `tvs` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `info` varchar(500) DEFAULT NULL,
  `url` varchar(250) DEFAULT NULL,
  `addtime` datetime NOT NULL,
  `type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`,`addtime`)
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of tvs
-- ----------------------------
INSERT INTO `tvs` VALUES ('1', '等到烟暖雨收第一季', '元气少女蜜恋冷峻公子', 'http://www.iqiyi.com/v_19rqzkkspw.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('2', '娘道', '岳丽娜谱写母爱传奇', 'http://www.iqiyi.com/v_19rqzc25ao.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('3', '舌害', '宋祖儿探秘娱乐圈', 'http://www.iqiyi.com/v_19rqzepgjs.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('4', '为了你我愿意热爱整个世界', '罗晋郑爽相恋二十年', 'http://www.iqiyi.com/v_19rr1bx534.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('5', '小棉袄', '单身酷爸斗萌娃', 'http://www.iqiyi.com/v_19rr25mfj8.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('6', '爱情公寓4', '大牌客串爆笑升级', 'http://www.iqiyi.com/v_19rrgzy5ls.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('7', '1006的房客', '跨越时空奇幻爱恋', 'http://www.iqiyi.com/v_19rr1l5xmw.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('8', '盗墓笔记', '地下惊奇世界探秘之旅', 'http://www.iqiyi.com/v_19rrohr1jc.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('9', '请回答1988', '双门洞胡同的温情故事', 'http://www.iqiyi.com/v_19rrlkh3ag.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('10', '老九门', '热血收官九门同心', 'http://www.iqiyi.com/v_19rrmbr34s.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('11', '卧底归来', '缉毒警察智斗毒枭', 'http://www.iqiyi.com/v_19rrax0owk.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('12', '再创世纪 粤语', '金融漩涡 逆转胜负', 'http://www.iqiyi.com/v_19rqzpsrgw.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('13', '幸福就好', '首部一线记者的青春剧', 'http://www.iqiyi.com/v_19rqzps8c0.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('14', '灵魂摆渡', '中国恐怖故事', 'http://www.iqiyi.com/v_19rrgxmoiw.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('15', '钟馗捉妖记', '杨旭文杨蓉热血捉妖', 'http://www.iqiyi.com/v_19rr0lwsfs.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('16', '玄门大师', '玄门少年团拯救人间', 'http://www.iqiyi.com/v_19rrd41zjs.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('17', '调香师第二季', '历劫千年复活哥哥肉身', 'http://www.iqiyi.com/v_19rqz2kbj4.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('18', '太阳的后裔', '宋仲基宋慧乔定情作', 'http://www.iqiyi.com/v_19rrkxmiss.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('19', '凤囚凰', '关晓彤宋威龙传奇虐恋', 'http://www.iqiyi.com/v_19rrevkcf0.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('20', '灵魂摆渡2', '原班人马颤栗回归', 'http://www.iqiyi.com/v_19rrksx6gs.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('21', '琅琊榜之风起长林', '琅琊风云再起', 'http://www.iqiyi.com/v_19rrf3e07c.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('22', '天泪传奇之凤凰无双', '王丽坤深宫权谋', 'http://www.iqiyi.com/v_19rr8s9o0k.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('23', '失宠王妃之结缘', '爱与救赎的故事', 'http://www.iqiyi.com/v_19rrfjsr6o.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('24', '走火', '于毅领衔铁警打击罪案', 'http://www.iqiyi.com/v_19rr0cvkk4.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('25', '杨光的快乐生活之好好先生', '逗贫杨光再次来袭', 'http://www.iqiyi.com/v_19rqz2p8og.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('26', '家有儿女初长成VIP独享版', '升级版家有儿女欢乐多', 'http://www.iqiyi.com/v_19rr0n2kjo.html', '2018-09-11 22:07:38', '电视剧');
INSERT INTO `tvs` VALUES ('27', '灵魂摆渡3', '铁三角身份揭秘', 'http://www.iqiyi.com/v_19rr9evutk.html', '2018-09-11 22:07:38', '电视剧');
