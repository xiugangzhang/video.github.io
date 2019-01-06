//首页轮播图效果开始------------------------------------------------------------------------------------------
/**
 * 使用面向对象的方式封装这个轮播图效果
 */
function imgShow() {
}

/**
 * 首页的电影效果轮播图效果实现
 * @type {{imgs: Array, num: number, currentNumber: number, elements: null, start: imgShow.start, init: imgShow.init, initParas: imgShow.initParas, initEvent: imgShow.initEvent, itemMove: imgShow.itemMove, mouseover: imgShow.mouseover, click: imgShow.click, autoPlay: imgShow.autoPlay}}
 */
imgShow.prototype = {
    imgs : [],         // 图片数组
    num : -1,           // 初始的图片下标
    currentNumber : 0,     // 当前展示的图片下表编号
    elements : null,        // 存储获取的DOM元素

    /**
     * 输入图片路径信息之后， 开启轮播图效果
     * @param imgs
     */
    start : function (imgs) {
        this.init(imgs);
    },
    /**
     * 输入参数初始化
     * 事件处理模块初始化
     * @param imgs
     */
    init : function (imgs) {
        // 初始化输入参数
        this.initParas(imgs);
        // 主程序入口
        this.autoPlay();
        // 事件初始化
        this.initEvent();
    },
    /**
     * 输入参数初始化
     * @param imgs
     */
    initParas : function (imgs) {
        this.imgs = imgs;
        this.elements = $('.main-slider ul li');
    },
    /**
     * 事件处理初始化
     */
    initEvent : function () {
        this.mouseover();
        this.click();
    },
    /**
     * 自动移动项的实现（图片随项一起移动）
     * @param index
     */
    itemMove : function (index) {
        // 移动之后，找到相应的li-item，改变他的样式
        var lis = $('.main-slider ul li');
        lis.each(function () {
            var a = this.childNodes[0];
            if (this.className === 'current') {
                this.className = '';
                a.childNodes[0].className = '';
                a.childNodes[1].className = '';
            }
        });

        // 把当前的设置为样式 index = 0, 则切换为第0个li标签
        var current = lis[index+1];
        current.className = 'current';
        current.childNodes[0].childNodes[0].className = 'current-title';
        current.childNodes[0].childNodes[1].className = 'current-content';
    },
    /**
     * 鼠标移动事件处理模块
     */
    mouseover : function () {
        // 获取所有的li标签
        var lis = this.elements;
        var self = this;
        lis.on('mouseover', function () {
            if (this.className === 'first' || this.className === 'last'){
                return;
            }
            lis.each(function () {
                var a = this.childNodes[0];
                if (this.className === 'current') {
                    this.className = '';
                    a.childNodes[0].className = '';
                    a.childNodes[1].className = '';
                }
            });
            // 把当前的设置为样式
            var current = this.childNodes[0];
            this.className = 'current';
            current.childNodes[0].className = 'current-title';
            current.childNodes[1].className = 'current-content';
            //  原始的实现可以通过父节点的所有孩子节点变遍历的方式来判断，srcNode.parentNode.childNodes[index] === srcNode
            // console.log($(this).index())
            // 设置完毕之后， 修改与之相对应的图片样式信息
            $('.main-slider').css('background', 'url(' + self.imgs[$(this).index()-1] + ')').css('background-size', '100%');
        });
    },
    /**
     * 鼠标单击事件处理模块
     */
    click : function () {
        var self = this;
        $('.arrow-l').on('click', function () {
            self.currentNumber--;
            if (self.currentNumber<0){
                self.currentNumber = self.imgs.length-1;
            }
            $('.main-slider').css('background', 'url(' + self.imgs[self.currentNumber] + ')').css('background-size', '100%');

            // 设置为自动移动标签项
            self.itemMove(self.currentNumber);
            self.num = self.currentNumber;
        });

        $('.arrow-r').on('click', function () {
            self.currentNumber++;
            if (self.currentNumber > self.imgs.length-1){
                self.currentNumber = 0;
            }
            $('.main-slider').css('background', 'url(' + self.imgs[self.currentNumber] + ')').css('background-size', '100%');

            // 设置为自动移动
            self.itemMove(self.currentNumber);
            self.num = self.currentNumber;
        });

    },
    /***
     * 轮播图自动播放的实现
     */
    autoPlay : function () {
        var self = this;
        setInterval(function () {
            self.num++;
            $('.main-slider').css('background', 'url(' + self.imgs[self.num % 8] + ')').css('background-size', '100%');
            self.currentNumber = self.num % 8;

            // 开始移动item项
            self.itemMove(self.currentNumber);
        }, 4000);
    },
}


/**
 * 轮播图效果的启动
 * @param ev
 */
window.onload = function () {
    // 图片数组初始化
    var imgs = [
        './images/big0.jpg',
        './images/big1.jpg',
        './images/big2.jpg',
        './images/big3.jpg',
        './images/big4.jpg',
        './images/big5.jpg',
        './images/big6.jpg',
        './images/big7.jpg',
    ];

    // 初始化参数，启动
    var run = new imgShow(imgs);
    run.start(imgs);
}
//首页轮播图效果结束------------------------------------------------------------------------------------------


//首页电影切换菜单开始------------------------------------------------------------------------------------------
$('.movies-type ul li').on('click', function () {
    // 先把其他的颜色都恢复
    var lis = $('.movies-type ul li');
    lis.each(function () {
        $(this).css('backgroundColor', '#ff8b20');
        if ($(this).hasClass('current-click')){
            // this.className = '';
            $(this).removeClass('current-click');
        }
    });
    // 获取标签里面的文本内容
    var text = $(this).text();
    // 改变当前的按钮颜色
    $(this).css('backgroundColor', '#ffbd23');
    if (!$(this).hasClass('current-click')){
        $(this).addClass('current-click');
    }
    switch (text){
        case '电影':
            $('.movies-content').show();
            $('.tvs-content').hide();
            $('.tvshows-content').hide();
            $('.animes-content').hide();
            break;
        case '电视剧':
            $('.movies-content').hide();
            $('.tvs-content').show();
            $('.tvshows-content').hide();
            $('.animes-content').hide();
            break;
        case '综艺':
            $('.movies-content').hide();
            $('.tvs-content').hide();
            $('.tvshows-content').show();
            $('.animes-content').hide();
            break;
        case '动漫':
            $('.movies-content').hide();
            $('.tvs-content').hide();
            $('.tvshows-content').hide();
            $('.animes-content').show();
            break;
    }
}).on('mouseover', function () {
    $(this).css('backgroundColor', '#ffbd23');
}).on('mouseout', function () {
    // 把当前没有点击的，颜色恢复
    if (!$(this).hasClass('current-click')){
        $(this).css('backgroundColor', '#ff8b20');
    }
});

//首页电影切换菜单结束------------------------------------------------------------------------------------------
