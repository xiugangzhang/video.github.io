
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for colmovie
-- ----------------------------

CREATE TABLE `colmovie` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `movie_url` varchar(50) DEFAULT NULL,
  `user_id` int(20) DEFAULT NULL,
  `addtime` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
CREATE TABLE `comments` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `content` varchar(500) DEFAULT NULL,
  `movie_id` int(20) DEFAULT NULL,
  `user_id` int(20) DEFAULT NULL,
  `addtime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Table structure for interface
-- ----------------------------
CREATE TABLE `interface` (
  `id` int(11) NOT NULL,
  `interface_name` varchar(255) DEFAULT NULL,
  `interface_url` varchar(255) DEFAULT NULL,
  `addtime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

-- ----------------------------
-- Table structure for movies
-- ----------------------------
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
-- Table structure for preview
-- ----------------------------
CREATE TABLE `preview` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) DEFAULT NULL,
  `content` varchar(500) DEFAULT NULL,
  `playurl` varchar(150) DEFAULT NULL,
  `imgurl` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Table structure for tvs
-- ----------------------------
CREATE TABLE `tvs` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `info` varchar(500) DEFAULT NULL,
  `url` varchar(250) DEFAULT NULL,
  `addtime` datetime NOT NULL,
  `type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`,`addtime`)
) ENGINE=InnoDB AUTO_INCREMENT=559 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Table structure for userlog
-- ----------------------------
CREATE TABLE `userlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login_time` datetime DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Table structure for users
-- ----------------------------
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uname` varchar(50) DEFAULT NULL,
  `pwd` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `info` varchar(100) DEFAULT NULL,
  `face` varchar(100) DEFAULT NULL,
  `addtime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=gbk;


