//图片延迟加载：  图片距离body顶部距离+图片的高度<屏幕的高度+卷去的高度
var aImgs = document.getElementsByTagName('img');
var oSearch = document.getElementById('search');
var oBtn = document.getElementById('toTop');//totop安钮
var oneClient = utils.win('clientHeight');//一屏幕的高度

//图片延迟加载
function showImg() {
    // 获取页面中的所有图片
    for (var i = 0; i < aImgs.length; i++) {
        var imgPos = utils.offset(aImgs[i]).top;
        var scrollBottom = utils.win('scrollTop') + utils.win('clientHeight');
        if (imgPos < scrollBottom) {
            lazyImg(aImgs[i]);
        }
    }
};

function lazyImg(img) {
    var realImg = img.getAttribute('realImg');
    if (!realImg || img.loaded) return;
    var tmpImg = new Image;
    tmpImg.src = realImg;
    tmpImg.onload = function () {
        img.src = this.src;
        tmpImg = null;
        img.loaded = true;
    }
};

//搜索栏超过一屏幕的时候显示
function showSearchBar() {
    //浏览器卷去的高度
    var scrollPos = utils.win('scrollTop');
    if (scrollPos > oneClient) {
        oSearch.style.display = 'block';
        oSearch.style.position = 'fixed';
        oSearch.style.zIndex = '3';
    } else {
        oSearch.style.display = 'none';
    }
}


//点击回到顶部
function toTop() {
    var curTop = utils.win('scrollTop'),
        duration = 500,
        interval = 30,
        step = curTop / duration * interval;
    var timer = setInterval(function () {
        curTop = utils.win('scrollTop');
        if (curTop <= step) {
            utils.win('scrollTop', 0);
            clearInterval(timer);
            return;
        }
        curTop -= step;
        utils.win('scrollTop', curTop);
    }, interval)
}

//轮播图部分
(function () {
    var banner = document.getElementById('banner');
    var aImgs = banner.getElementsByTagName('img');
    var oUl = banner.getElementsByTagName('ul')[0];
    var aLis = oUl.getElementsByTagName('li');
    var timer = null;
    var n = -1;

    //轮播
    clearInterval(timer);
    timer = setInterval(autoMove, 2000);

    function autoMove() {
        n++;
        if (n > aImgs.length - 1) {
            n = 0;
        }
        setBanner();

    };

    function setBanner() {
        for (var i = 0; i < aImgs.length; i++) {
            if (i == n) {
                utils.css(aImgs[i], 'zIndex', 1);
                animate(aImgs[i], {opacity: 1}, {
                    duration: 600,
                    callback: function () {
                        var siblings = utils.siblings(this);
                        for (var j = 0; j < siblings.length; j++) {
                            utils.css(siblings[j], {opacity: 0});
                        }
                    }
                })
            } else {
                utils.css(aImgs[i], 'zIndex', 0);
            }
        }
        bannerTip();
    }

    //焦点自动轮播
    function bannerTip() {
        for (var i = 0; i < aLis.length; i++) {
            i == n ? aLis[i].className = 'show' : aLis[i].className = '';
        }
    };
    //鼠标移入停止
    banner.onmouseover = function () {
        clearInterval(timer);
    };
    //鼠标移出继续
    banner.onmouseout = function () {
        timer = setInterval(autoMove, 2000)
    }

    //鼠标经过li时候显示当前图片
    mouseMove();

    function mouseMove() {
        for (var i = 0; i < aLis.length; i++) {
            (function (index) {
                aLis[index].onmouseover = function () {
                    n = index;
                    setBanner();
                }
            })(i)
        }
    }
})()


//函数执行
showImg();
oBtn.onclick = toTop;
window.onscroll = function () {
    var scrollPos = utils.win('scrollTop');
    showImg();
    showSearchBar();
    if (scrollPos > oneClient) {
        oBtn.style.display = 'block';
    } else {
        oBtn.style.display = 'none';
    }
}



// 顶部的加载进度条的实现--------------------------------------------------------------------
// 获取当前的进度条元素
;(function () {
    function Progressbar(progress) {
        this.progress = progress;
        this.prg = 0;
        this.width = document.documentElement.clientWidth;
        this.timer = 0;
    }
    Progressbar.prototype = {
        start : function () {
            var self = this;
            // 架子啊完毕之后的处理事件
            self.onchange();
            //  定义自己的定时器
            self.timer = setInterval(() => {
                // 这里让这个数字也是一个随机数
                if (self.prg >= self.random([40, 80])) {
                    clearInterval(self.timer);
                } else {
                    // 增加的时候使得不均匀增加，需要定义一个速度的变量
                    self.prg += self.random(3);
                }
                // 修改进度条的宽度
                self.progress.style.width = (self.prg / 100 * self.width) + 'px';
            }, 15);
        },
        onchange : function () {
            var self = this;
            document.onreadystatechange = function () {
                if (document.readyState === 'complete') {
                    clearInterval(self.timer);
                    setInterval(() => {
                        if (self.prg >= 100) {
                            clearInterval(self.timer);
                            self.prg = 100;
                            self.progress.style.display = 'none';
                        } else {
                            self.prg += self.random(1);
                        }
                        // 修改进度条的宽度
                        self.progress.style.width = (self.prg / 100 * self.width) + 'px';
                    }, 5);
                }
            }

        },
        random : function (n) {
            if (typeof n === 'object') {
                // 数组的处理
                var offset = n[1] - n[0];
                return (Math.random() * offset)*10 + n[0];
            } else{
                // 会生成一个0-n的随机数
                return Math.random() * n;
            }
        }
    }



    // 启动我的进度条
    var progress = document.getElementById('progress');
    var progressBar = new Progressbar(progress);
    progressBar.start();

})();

// 顶部的加载进度条的结束--------------------------------------------------------------------

