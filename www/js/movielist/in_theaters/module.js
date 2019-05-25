(function(angular) {
    'use strict';

    // ========================================知识点总结=============================================
    // 将控制器代码中重用的部分抽象为服务
    // 将视图中重用的代码抽象成指令
    // ========================================知识点总结=============================================

    // 定义一个模块
    angular.module('movielist.in_theaters',
        ['ngRoute', 'movielist.services.http'])

    // 不同的请求路由会直接进入到不同的模块， 不同的url地址会对应一个控制器， 从而会渲染出来不同的模块， 然后再浏览器显示出来渲染的页面信息
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/:category/:page?', {
                templateUrl: '/www/js/movielist/in_theaters/view.html',
                controller: 'MovieListController'
            });
        }])

        // 定义一个电影处理的控制器
        .controller('MovieListController', [
            '$scope',
            '$route',         // 用于实现新注入
            '$routeParams',
            'HttpService',
            function($scope, $route, $routeParams, HttpService) {

                // object {q : '猪八戒', category : 'search'}
                // console.log($routeParams);
                var pageSize = 20;

                // $routeParams.page 获取到的是页码信息
                $scope.page = parseInt($routeParams.page || 1);
                var start = ($scope.page - 1) * 5;

                $scope.title = 'Loading...';
                $scope.movies = [];
                $scope.loading = true;
                $scope.totalCount = 0; // 条数
                $scope.totalPage = 0; // 页数

                // 0 5 10
                // 1 2 3
                HttpService
                    .jsonp(
                        // 直接匹配路由中的参数信息， $routeParams.category获取到的是电影分类信息
                        'http://api.douban.com/v2/movie/' + $routeParams.category,
                        { start: start, count: pageSize, q: $routeParams.q },
                        function(data) {
                            $scope.loading = false;
                            $scope.title = data.title;
                            $scope.movies = data.subjects;
                            $scope.totalCount = data.total;
                            $scope.totalPage = Math.ceil(data.total / pageSize);
                            $scope.$apply(); // 强制同步数据到界面
                        }
                    );


                // 暴露一个翻页的行为
                $scope.go = function(page) {
                    // 重新加载当前页面
                    if (0 < page && page < $scope.totalPage + 1)
                    // 更新参数（请求参数格式{page : 1}）
                        $route.updateParams({ page: page });
                };

            }
        ]);

})(angular);




