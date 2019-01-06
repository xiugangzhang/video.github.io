// 用户中心的切换效果实现开始-----------------------------------------------------------------
$('#userinfo li').on('click', function () {
    var text = $(this).text();
    $('#userinfo li').each(function () {
        $(this).css('backgroundColor', '');
        $(this).css('color', 'black');
    });
    $(this).css('color', 'white');
    $(this).css('backgroundColor', '#337AB7');
    console.log(text);
    switch (text) {
        case '会员中心':
            $('.user-center').show();
            $('.user-pwd').hide();
            $('.user-comment').hide();
            $('.user-logininglog').hide();
            $('.user-moviecol').hide();
            break;
        case '修改密码':
            $('.user-center').hide();
            $('.user-pwd').show();
            $('.user-comment').hide();
            $('.user-logininglog').hide();
            $('.user-moviecol').hide();
            break;
        case '评论记录':
            $('.user-center').hide();
            $('.user-pwd').hide();
            $('.user-comment').show();
            $('.user-logininglog').hide();
            $('.user-moviecol').hide();
            break;
        case '登录日志':
            $('.user-center').hide();
            $('.user-pwd').hide();
            $('.user-comment').hide();
            $('.user-logininglog').show();
            $('.user-moviecol').hide();
            break;
        case '收藏电影':
            $('.user-center').hide();
            $('.user-pwd').hide();
            $('.user-comment').hide();
            $('.user-logininglog').hide();
            $('.user-moviecol').show();
            break;
    }
});
// 用户中心的切换效果实现结束-----------------------------------------------------------------

