(function (angular) {

  // 命名规则， 项目名称 + 模块名称
  angular.module('movielist.directives.auto_active', [])

  // 用于实现导航栏的自动切换（指令的名字必须要使用驼峰命名法）
    .directive('autoActive', ['$location', function ($location) {
      return {
        // link指令表示：当这个指令作用于某个元素过后触发一次
        link: function (scope, element, attributes) {
          console.log(scope, element, attributes);
          // console.log(attributes.autoActive);
          // var url = $location.url(); // /in_theaters/1
          // 可以获取请求地址栏#后面的地址信息
          scope.$location = $location;
          // 只要url地址发生了变化， 可以直接监视一个方法的返回值
          scope.$watch('$location.url()', function (now, old) {
            // /in_theaters(去掉前面的#)
            var aLink = element.children().attr('href').substr(1);
            console.log(aLink);
            // 是不是以当前的字符串开始
            if (now.startsWith(aLink)) {
              // 干掉兄弟节点上active（删除其他元素的样式)
              //  实现思路： 先找到父元素， 然后移除父元素上面的相应的子元素
              element.parent().children().removeClass(attributes.autoActive);
              // 给当前元素加上active样式
              element.addClass(attributes.autoActive);   // element.addClass('active'), attributes.autoActive就会拿到一个属性值 = 'active'
            }
          });
        }
      };

    }]);

})(angular);
