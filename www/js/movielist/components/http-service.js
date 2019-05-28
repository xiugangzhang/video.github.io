;(function (angular) {
    // 指定项目的名称，创建一个服务, 指定了一个模块， 指定自己定义的服务的名称为HttpService
    angular.module('movielist.services.http', [])
        .service('HttpService', ['$window', function ($window) {
            this.jsonp = function (url, params, fn) {
                // 0. 处理回调函数的挂载问题（window对象上面）, callback 就是我们自己指定的匿名函数
                // 为了实现每一个函数的回调都能得到最原始的结果， 这里需要把每一个函数指定一个唯一的函数
                var cbName = 'jsonp_' + (Math.random() * Math.random()).toString().replace('.', '');

                // 为了实现页面中只有一个script标签， 我就在页面中移除那个script标签
                $window[cbName] = function (data) {
                    // 当服务器端传输数据完成之后， 就会自动调用这个window对象上面函数， 然后把执行之后的结果交给我的回调函数就行了
                    fn(data);
                    // 然后移除script标签(这里使用的实际上是一个变量提示， 所有声明为var的变量都会自动提升到页面的最前面， 然后等待编译的时候会依次解释执行)
                    // $document.body.removeChild(scriptElement);
                    $window.document.body.removeChild(scriptElement);
                };

                // 1. 组合最终请求的URL地址
                // 1.1 将params转换为key=value&key2=value2的格式
                var queryString = '';
                for (var key in params) {
                    queryString += key + '=' + params[key] + '&';
                }
                // 1.2 开始拼接
                url = url + '?' + queryString;
                // 1.3 绑定回调函数,在这里高速豆瓣，o我的回调函数是什么
                url = url + 'callback=' + cbName;

                // 2. 创建一个script标签， 并将src设置为url地址(为了实现只有一个script标签， 我只需要创建一次就可以了)
                var scriptElement = $window.document.createElement('script');
                scriptElement.src = url;

                // 3. appendChild DOM元素(只要的目的就是让浏览器执行)
                //$document.body.appendChild(scriptElement);
                $window.document.body.appendChild(scriptElement);
            }
        }]);
})(angular);
