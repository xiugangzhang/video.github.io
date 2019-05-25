//  footer 部分的logo切换开始-----------------------------------------------------------------
/**
 * 切换底部的按钮图片
 */
;(function () {
    $('#lastlogo dd').on('mouseover', function (e) {
        var target = $($.getTarget(e));
        var text = target.text();
        switch (text) {
            case "微信":
                $('#imgshow').css('right', '126px').show();
                break;
            case "QQ群":
                $('#imgshow').css('right', '63px').show();
                break;
            case  "新浪":
                $('#imgshow').css('right', '0px').show();
                break;
            case "邮箱" :
                $('#imgshow').css('right', '-63px').show();
                break;
        }
    }).on('mouseout', function () {
        $('#imgshow').hide();
    });
})();
//  footer 部分的logo切换结束-----------------------------------------------------------------


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

