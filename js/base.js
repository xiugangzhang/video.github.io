//  footer 部分的logo切换开始-----------------------------------------------------------------
/**
 * 切换底部的按钮图片
 */
toggleLogo();
function toggleLogo() {
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
}

//  footer 部分的logo切换结束-----------------------------------------------------------------
