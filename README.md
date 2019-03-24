## 在线体验地址:http://vip.52tech.tech/
## 项目预览
![image](https://github.com/xiugangzhang/vip.github.io/blob/master/static/images/preview.gif)
- 主页面
![image](https://github.com/xiugangzhang/vip.github.io/blob/master/static/images/preview.jpg)
- 搜索页面
![image](https://github.com/xiugangzhang/vip.github.io/blob/master/static/images/search.png)
- 登录页面
![image](https://github.com/xiugangzhang/vip.github.io/blob/master/static/images/login.jpg)
- 注册页面
![image](https://github.com/xiugangzhang/vip.github.io/blob/master/static/images/register.jpg)
- 会员中心
![image](https://github.com/xiugangzhang/vip.github.io/blob/master/static/images/user.jpg)
- 电影播放页面
![image](https://github.com/xiugangzhang/vip.github.io/blob/master/static/images/play.jpg)
- 电影弹幕功能
![image](https://github.com/xiugangzhang/vip.github.io/blob/master/static/images/danmu.gif)
![image](https://github.com/xiugangzhang/vip.github.io/blob/master/static/images/05.jpg)



## 视频网站项目已经完功能如下：
### v1.0.3（当前最新版本）
 - 1. 增加自动抓取功能，网站数据定期实时更新
    - 电影和电视剧数据抓取
    - 电影数据信息前端展现
 - 2. 电影页面图片的自动抓取、下载和展示
 - 3. 代码结构调整
### v1.0.2
 - 1. 简化程序安装流程，新增可视化安装界面
    - 用户可直接输入数据库名、数据库地址、数据库用户名、数据库密码信息一键完成程序的安装
 - 2. 页面部分结构的调整 
### v1.0.1
 - 1. 用户中心的管理
    - 对于已经注册的用户，实现用户基本信息的修改
    - 用户密码的修改
    - 用户评论记录的查看
    - 用户收藏电影的查看和播放
    - 用户登录日志的查看
 - 2. 电影搜索功能（特色功能）
    - 实现了根据视频播放地址和视频名称全网视频的搜索和播放功能
    - 实现了正在热映，即将上映和TOP250的电影列表的展示
    - 电影收藏和取消功能  
 - 3. 弹幕功能（特色功能）
   - 类似于B站等其他视频网站的弹幕功能，用户在登录之后可以实现在线发言 
### v1.0.0
 - 1. 用户主页的搭建：
    - 实现了主页轮播图的显示和切换，用户可以从数据库中自由配置和切换轮播图的显示
    - 实现了主页电影列表的显示：从数据库文件读取电影和电视剧列表信息并在前台显示
 - 2. 用户登录和注册页面的搭建：
    - 实现了用户的登录和注册功能
    - 用户注册和登录验证码提示功能
 - 3. 电影播放页面的搭建
    - 对于其他页面的任意可以展现电影列表的页面，用户可以直接点击列表，直接进入播放页面
    - 播放页面电影详细信息的展现
    - 对于加载速度较慢的视频，用户可以自由切换播放接口进行加速
    - 用户可以在相应的播放页面查看其他用户已经发表的评论，同时也可以在登录之后自由发表评论
### 其他
 - 1. 页面整体的风格模仿了Discuz等论坛网站的布局
 - 2. 网站首页的轮播图效果模仿了优酷、爱奇艺、腾讯视频等主流视频网站的轮播图效果，并且对该部分的效果实现进行了代码封装
 - 3. 电影底部的的友情链接，使用了大部分网站的分栏布局，用户可以添加自己的QQ群以及微信公众号方便增加自己网站的人气
 - 4. 主要列表的分页功能，对于一些内容显示较多的不能再一页显示完整的页面，使用了ajax无刷新分页对数据进行多条展示，提高了用户的体验
 - 5. 目前主流浏览器中也做了相应测试，建议大家使用谷歌或者火狐浏览器，效果可能会更好
 - 6. 未使用其他第三方框架，首页和播放页均为纯原生的HTML，CSS， js实现（至于这个xframe-min-1.0.js文件可以参见我的GitHub xframe.js这个开源项目）
 - 7. 电影播放页面：此处也是类似于当前主流网站的的播放页面，左侧为播放窗口，右侧部分为电影的详细信息
 - 8. 底部导航：使用分栏的方式实现了底部的导航，前面的为友情链接，后面的一个为网站的微信，Q微博等联系方式
 - 9. 用户中心：这部分实现了修改密码，评论，登录，日志管理，收藏电影的功能，用户可以自由切换

## 程序目录结构说明
```
vip.github.io:
├─controllers               // 控制层
├─data                      // 数据抓取层
├─logs                      // 后台日志
│  ├─errlog                 // 错误日志
│  ├─othlog                 // 其他日志
│  └─reqlog                 // 请求日志
├─models                    // 模型层
├─static                    // 静态页
│  ├─css                    // 样式表
│  ├─images                 // 静态图片资源
│  └─js                     // js脚本
├─utils                     // 工具相关
├─views                     // 视图层
└─www                       // 静态资源
    ├─css                   // 样式表
    ├─html                  // html文件
    ├─images                // 静态图片资源
    ├─js                    // js脚本
    │  └─movielist          // 搜索页电影列表
    │      ├─components     // top250/即将上映
    │      └─in_theaters    // 正在热映
    └─uploads               // 文件上传目录
        ├─avatar            // 用户图像
        └─movie             // 电影图标

```

## 程序安装方法

 - 1. 确保电脑已经安装了NodeJS环境，运行版本尽量保持最新（V8以上吧），选择本地的一个路径，然后运行命令：
 ```
    git clone https://github.com/xiugangzhang/vip.github.io.git
 ```
 - 2. 进入程序的主目录（包含app.js的那个文件夹）运行命令：npm install，系统就会自动安装该程序的依赖包；
 - 3. 在以上的步骤都执行完成且正确的情况下，就可以在程序主目录下面（有app.js的那个目录）,运行命令
 ```
    node app.js
 ```
 之后就会自动在浏览器中打开本程序安装的主界面，如执行以上命令程序没有自动跳转到安装界面，请手动在浏览器输入服务器IP地址访问即可；
 - 4. 本程序提供了可视化的安装。用户可在程序的安装界面输入数据库名、数据库主机地址、数据库用户名、数据库密码，之后点击按钮立即安装即可，在输入的参数全部正确的情况下，就会后台自动安装程序，安装成功之后会自动跳转到网站首页；
 
  ![image](https://github.com/xiugangzhang/vip.github.io/blob/master/static/images/install.jpg)
 - 8. 在线演示站点：http://vip.52tech.tech
 - 9. 对于安装和使用的过程中如果有什么问题和建议，也欢迎交流和提出建议，可以在issue去发起话题讨论，或直接联系邮箱：tech52admin@126.com
 - 10. 最后，也欢迎大家star哈！








