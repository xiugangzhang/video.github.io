;(function (angular) {
    // 程序的主入口模块
    angular.module('movielist', [
        'ngRoute',
        'movielist.in_theaters',
        // 注意这里的config参数是一个数组
    ]).config(['$routeProvider', function ($routeProvider) {
        // 主模块中默认跳转到夜歌页面中去
        $routeProvider.otherwise({ redirectTo: '/in_theaters' });
    }]);
})(angular)


