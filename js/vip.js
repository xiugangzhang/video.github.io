<div style="overflow:hidden; margin: 0 auto; width:810px;padding:10px;">
    <div style="float:left;">
    <input type="text" id="myContent"
style="border:1px solid #75B100; width:600px; line-height:30px; padding:6px; display:block; float:left; color: red; font-size: 19px;"
value="战狼2"/>
    <a href="http://www.52tech.tech/portal.php?mod=topic&topicid=1" onclick="beginSearch()"><img src="http://www.52tech.tech/data/attachment/forum/201801/18/aiqiyi.jpg" style="width:175px; margin-left:15px;"></a>

    </div>
    <div style="float: left">
    <input type="text" id="link"
style="border:1px solid #00a0e9; width:600px; line-height:30px; padding:6px; display:block; float:left; color: red; font-size: 19px;"
value="http://www.iqiyi.com/v_19rre19on4.html"/>
    <input type="submit"
style="width:100px; cursor:pointer; line-height:40px; background-color:#00a0e9; border:1px solid #FFF; display:block; float:right; color:#fff;"
value="关闭视频" onclick="Clo()"/>
    <input type="submit"
style="width:100px; cursor:pointer; line-height:40px; background-color:#00a0e9; border:1px solid #FFF; display:block; float:right; color:#fff;"
value="提交视频地址" onclick="Tip()"/>
    <a href="http://www.52tech.tech/forum.php?mod=viewthread&tid=160&page=1&extra=#pid240">
    <div id="mytitle"
style="width:805px; cursor:pointer; text-align: center; padding-top: 16px; height:20px; background-color:#63b3ff; border:5px solid #FFF; display:block; float:left; color:#fff; color: red; font-weight: bold;font-size: 15px; height: 60px;">
    <a  href="http://www.52tech.tech/forum.php?mod=viewthread&tid=160&page=1&extra=#pid240" style="text-decoration: none; color:blue; font-size: 18px; font-family: 微软雅黑;">
    在上方输入VIP视频地址后按<font style="color: orangered;" > Alt+数字1-6</font>选择解析接口后即可观看。支持爱奇艺，芒果TV，优酷，腾讯，乐视等网站。<font style="color:red; size: 12px;">(手机端访问可以直接输入视频地址后点击提交视频地址即可在线观看)</font></a>
</div>
</a>


</div>


</div>
<div style="overflow:hidden; margin: 0 auto; width:810px; color: red;">
    <iframe id="video_iframe" src="http://www.52tech.tech/data/attachment/forum/201712/02/video.jpg"
style="height:500px;width:801px;frameborder:0;marginheight:0px;marginwidth:0px;background:#000000;border:2px solid #00a0e9">
    </iframe>
    </div>

    <script>
var num = 0
var link = document.getElementById('link').value;
document.getElementById("video_iframe").src = 'http://www.wmxz.wang/video.php?url=' + link;

function beginSearch(){
    //获取搜索框中的内容
    var searchContent = document.getElementById('myContent').value;
    var searchLink = "http://so.iqiyi.com/so/q_"+searchContent+"?source=input&sr=355236699219";
    //alert("ok");
    //alert(searchContent);
    window.open(searchLink, "_blank");
}

//关闭连接
function Clo() {
    document.getElementById("video_iframe").src = "http://www.52tech.tech/data/attachment/forum/201712/02/video.jpg";
}

//提交链接
function Tip() {
    var link = document.getElementById('link').value;
    if (link != '') {
        document.getElementById("video_iframe").src = 'http://www.wmxz.wang/video.php?url=' + link;
    } else {
        alert("提交视频地址后，按All+数字1-6选择解析接口");
    }
}


//让body全局监听
document.body.onkeydown = function (event) {
        if (event.keyCode == 13) {
            alert("提交视频地址后，按Alt+数字1-6选择解析接口");
        }
        ;
        if (event.keyCode == 18) {
            num = 1
        }
        ;
        if (num == 1) {
            if (event.keyCode == 49 | event.keyCode == 97) {
                var link = document.getElementById('link').value;
                document.getElementById("video_iframe").src = 'http://www.wmxz.wang/video.php?url=' + link;
                num = 0;
            }

            if (event.keyCode == 50 | event.keyCode == 98) {
                var link = document.getElementById('link').value;
                document.getElementById("video_iframe").src = 'http://mt2t.com/yun?url=' + link;
                num = 0;
            }

            if (event.keyCode == 51 | event.keyCode == 99) {
                var link = document.getElementById('link').value;
                document.getElementById("video_iframe").src = 'http://api.baiyug.cn/vip/index.php?url=' + link;
                num = 0;
            }

            if (event.keyCode == 52 | event.keyCode == 100) {
                var link = document.getElementById('link').value;
                document.getElementById("video_iframe").src = 'http://v.72du.com/api/?url=' + link;
                num = 0;
            }

            if (event.keyCode == 53 | event.keyCode == 101) {
                var link = document.getElementById('link').value;
                document.getElementById("video_iframe").src = 'http://g.o.t.o.tutulai.cn/?url=' + link;
                num = 0;
            }

            if (event.keyCode == 54 | event.keyCode == 102) {
                var link = document.getElementById('link').value;
                document.getElementById("video_iframe").src = 'http://2gty.com/apiurl/yun.php?url=' + link;
                num = 0;
            }
        }

    }

    </script>