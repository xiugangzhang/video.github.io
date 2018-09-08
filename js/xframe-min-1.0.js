/*
* @Author: xiugang
* @Time: 20180722
* @Desc: 实现一个类似于JQuery功能的框架
* V 1.0: 实现了基础框架、事件框架、CSS框架、属性框架、内容框架、动画框架的搭建
* V 2.0：实现了框架的进一步优化，具有良好的扩展性， 可以支持链式访问
* V 3.0：种子模块：命名空间、对象扩展、数组化、类型的判定、domReady，无冲突处理
* V 4.0: 数据类型的检测、正则表达式的基本用法，数据绑定的知识（模板的使用）
* V 5.0：实现继承的基本理解，事件框架的封装和测试
* V 6.0: 实现了CSS样式框架封装和测试
* V 7.0: 实现了选择框架的封装和测试
* V 8.0: 实现了属性框架的封装和测试
* V 8.0: 实现了DOM框架的封装和测试
* V 9.0：实现了本地存储框架的封装（缓存框架、cookie、Localstorage框架）
* V 10.0 实现了动画框架的封装和本地测试
* V 11.0 在每一个立即函数+闭包的前面添加；实现框架的兼容性
* */


/**
 * 用于给js中内置的对象进行扩充方法
 */
;(function () {
    // 为了使得下面定义的扩充函数执行，祥和里需要调用一下
    stringExtend()
    arrayExtend()
    functionExtend()


    // String对象方法的扩充
    function stringExtend() {
        // str = 'name: @(name), age:@(age)'
        // data = {name : 'xiugang', age : 18}
        /**
         * 实现一个简单的数据绑定
         * @param str
         * @param data
         * @return {*}
         */
        String.prototype.formateString = function (data) {
            return this.replace(/@\((\w+)\)/g, function (match, key) {
                // 注意这里找到的值必须返回出去(如果是undefined，就是没有数据)
                // 注意：判断一个值的类型是不是undefined，可以通过typeof判断
                console.log(typeof data[key] === 'undefined');
                return data[key] === 'undefined' ? '' : data[key];
            });

        }
        /**
         * 去掉坐标的空格
         * @param str
         * @return {*}
         */
        String.prototype.ltrim = function () {
            return this.replace(/^\s*/g, '');

        }
        /**
         * 去掉右边的空格
         * @param str
         * @return {*}
         */
        String.prototype.rtrim = function () {
            return this.replace(/\s*$/g, '');
        }
        /**
         * 去掉两边的空格
         * @param str
         * @return {*}
         */
        String.prototype.trim = function () {
            return this.replace(/(^\s*)|(\s*$)/g, '');
        }

        // red===>Red
        /**
         * 将第一个字母小写，其他字母大写
         * @param str
         * @return {*}
         */
        String.prototype.camelCase = function () {
            // .*?是非贪婪的匹配，点可以匹配任意字符，星号是前边的字符有0-n个均匹配，问号是则是0-1；
            // (^\w{1}): 用于匹配第一个首字母
            // (.*)：用于匹配任意个的前面的字符

            // - param 1: 匹配到的字符串
            // - param 2: 匹配的的子字符串
            // - param 3: 匹配的子字符串
            // - param 4: 匹配到的字符串在字符串中的位置
            // - param 5: 原始字符串

            return this.replace(/(^\w{1})(.*)/g, function (match, g1, g2) {
                return g1.toUpperCase() + g2.toLowerCase();
            });
        }
        /**
         * 将一个字符串的下划线转换为中划线
         * @param str
         * @return {*}
         */
        String.prototype.dashString = function () {
            // 这里面的this实际上指向的就是我们自己定义的一个变量字符串
            return this.replace(/\_/g, '-');
        }

        /**
         * 检测一个字符串是不是为空
         * @return {boolean}
         */
        String.prototype.isEmpty = function () {
            return this.length === 0;

        }
        /**
         * 判断字符串是不是包含一个字符串
         * @param target
         * @return {boolean}
         */
        String.prototype.contains = function (target) {
            // 只要这个indexOf的下标不是-1的话，就说明包含这个目标字符串，否则的话就是不包含
            // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置，如果没找到的话，就返回-1
            return this.indexOf(target) !== -1;
        }
        /**
         * 对一个字符串中的特殊字符进行转义
         * @return {string}
         */
        String.prototype.escapeHTML = function () {
            /*显示结果	描述	实体名称	实体编号
                        空格	&nbsp;	&#160;
                        <	小于号	&lt;	&#60;
                        >	大于号	&gt;	&#62;
                        &	和号	&amp;	&#38;
                        "	引号	&quot;	&#34;
                        '	撇号 	&apos; (IE不支持)	&#39;
                        ￠	分	&cent;	&#162;
                        �0�5	镑	&pound;	&#163;
                        �0�6	日圆	&yen;	&#165;
                        €	欧元	&euro
            * **/


            // 先进行字符串分割， 得到一个数组
            var strArr = this.split('');
            for (var pos = 0, l = strArr.length, tmp; pos < l; pos++) {
                // 拿到数组中的每一个元素
                tmp = strArr[pos];
                // 对字符串中的每一个元素进行判断， 如果是特殊字符的话就进行处理
                switch (tmp) {
                    // pos始终为1， 表示要替换的项是1项
                    case '<':
                        replaceArr(strArr, pos, '&lt;');
                        break;
                    case '>':
                        replaceArr(strArr, pos, '&gt;');
                        break;
                    case '\'':
                        replaceArr(strArr, pos, '&#39;');
                        break;
                    case '\"':
                        replaceArr(strArr, pos, '&quot;');
                        break;
                    case '&':
                        replaceArr(strArr, pos, '&amp;');
                        break;
                    default:
                        ;
                }
            }
            // join() 方法用于把数组中的所有元素放入一个字符串。
            return strArr.join('');

            // 专门用于替换掉数组中的元素
            /**
             * 替换数组中指定的项
             * @param arr
             * @param pos
             * @param item
             * @return {*}
             */
            function replaceArr(arr, pos, item) {
                // Splice： splice主要用来对JS中的数组进行操作，包括删除，添加，替换等，原来的数组会被改变
                // 删除数据：array.splice(index,num)，返回值为删除内容，array为结果值。index为起始项，num为删除元素的的个数。
                // 插入数据：array.splice(index,0,insertValue)，index要插入的位置，insertValue要插入的项
                // 替换数据：array.splice(index,num,insertValue)，index起始位置，num要被替换的项数，insertValue要替换的值
                return arr.splice(pos, 1, item);
            }

        }
        /**
         * 忽略HTML中的一些内置的特殊字符
         * @return {string}
         */
        String.prototype.escapeHTML = function () {
            return Array.prototype.slice.call(this).join('').replace(/$/g, '&amp')
                .replace(/\</g, '&lt')
                .replace(/\>/g, '&gt')
                .replace(/\'/g, '&#39')
                .replace(/\"/g, '&quot');
        }
        /**
         * 对字符串进行反转义
         * @return {string}
         */
        String.prototype.unescapeHTML = function () {
            // 由于这里的this实际上拿到的是一个字符串数组, 因此第一步需要先把字符串数组转换为一个字符串
            console.log(typeof this);
            // 1.先把这个伪数组转换为数组对象
            var arr = Array.prototype.slice.call(this);
            // 2.把数组中的内容转换为字符串
            var res = arr.join('');
            // 查找所有的< > & " ' 字符，并替换掉
            return res.replace(/&lt/g, '<')
                .replace(/&gt/g, '>')
                .replace(/&#39/g, '\'')
                .replace(/&quot/g, '\"')
                .replace(/&amp/g, '')

                // String.fromCharCode() 静态方法根据指定的 Unicode 编码中的序号值来返回一个字符串。String.fromCharCode(65,66,67) “ABC”
                .replace(/&#(\d+)/g, function ($0, $1) {
                    //parseInt() 函数将给定的字符串以指定基数（radix/base）解析成为整数。就是 你想把string当成radix进制数解析成10进制
                    return String.fromCharCode(parseInt($1, 10));
                });
        }
        /**
         * 把一个字符串进行反转操作
         * @return {string}
         */
        String.prototype.reverse = function () {
            // 1. 先获得我需要的字符串，然后进行分割处理
            var arr = this.toString().split('');
            // 2. 对我分割后得到的数组元素进行逆序处理
            arr = arr.reverse();
            // 3.把数组中的元素变为一个字符串
            return arr.join();
            //return (this.toString()).split('').reverse().join();
        }


    }

    // Array对象方法的扩充
    function arrayExtend() {
        /**
         * 将一个数组元素清空
         * @return {Array}
         */
        Array.prototype.clear = function () {
            this.length = 0;
            return this;
        }
        /**
         * 计算一个数组的长度
         * @return {*}
         */
        Array.prototype.size = function () {
            return this.length;
        }
        /**
         * 返回数组里面的第一个元素
         * @return {*}
         */
        Array.prototype.first = function () {
            return this[0];
        }
        /**
         * 返回数组的最后一个元素
         * @return {*}
         */
        Array.prototype.last = function () {
            return this[this.length - 1]
        }


        function cacl(arr, callback) {
            // 变量的初始化（治理在使用的时候进行初始化）
            var ret;
            for (var i = 0, len = arr.length; i < len; i++) {
                ret = callback(arr[i], ret);
            }
            return ret;
        }

        /**
         * 对数组的所有元素进行求和
         * @return {*}
         */
        Array.prototype.sum = function () {
            // 1. 一般的方法
            /*var ret = 0;
            for (var i = 0, len = this.length; i < len; i++){
                ret = ret + this[i];
            }
            return ret;*/

            // 2.使用上面的计算类
            /**
             * @param:item 数组的每一项
             * @param:sum 数组求和的结果
             */
            return cacl(this, function (item, sum) {
                // 如果刚开始没有初始化的话，就直接使用第一项作为sum（ret）的初始值
                if (typeof sum === 'undefined') {
                    return item;
                } else {
                    return sum += item;
                }
            })

        }
        /**
         * 找出数组中的最大值
         * @return {*}
         */
        Array.prototype.max = function () {
            // 1. 一般的方式求出最大值
            /*var ret = 0;
            for (var i = 0, len = this.length; i < len; i++){
                if (ret < this[i]){
                    ret = this[i];
                }
            }
            return ret;*/

            // 2. 第二种方式
            return cacl(this, function (item, max) {
                if (typeof max === 'undefined') {
                    return item;
                } else {
                    if (max < item) {
                        return item;
                    } else {
                        return max;
                    }
                }
            })
        }
        /**
         * 找出一个数组中的最小值
         * @return {*}
         */
        Array.prototype.min = function () {
            return cacl(this, function (item, min) {
                if (typeof min === 'undefined') {
                    return item;
                } else {
                    // 只要每一项的值都不比最小值小的话
                    if (!(min < item)) {
                        return item;
                    } else {
                        return min;
                    }
                }
            })
        }

        /**
         * 求出一个数组中所有元素的平均值
         * @return {*}
         */
        Array.prototype.avg = function () {
            // 1. 先对数组中的元素个数组进行判断一下，防止计算出现无穷的情况
            if (this.length === 0) {
                return;
            }
            var sum = this.sum();
            return sum / this.length;
            /*return cacl(this, function (item, avg) {
                // 1. 先求和(进入到这个函数里面， this指向的是window对象，此时window对象是没有sum方法的，故执行错误)
                //var sum = this.sum();
                // 2.求出平均值
                if (typeof avg === 'undefined'){
                    return item;
                } else{
                    avg = sum / (this.length);
                }
                return avg;
            })*/
        }


        // 去除数组中的重复项
        /*
        * 实现思路： 遍历原始数组中的每一项元素，让每次遍历的这一个元素和后面的每一个元素进行比较
        * 【只要相同的话就直接跳过继续向下寻找】
        * */
        Array.prototype.unique = function () {
            var a = [],
                len = this.length;
            for (var i = 0; i < len; i++) {
                for (var j = i + 1; j < len; j++) {
                    if (this[i] === this[j]) {
                        // 如果找到了相邻的两个元素是相同的，i直接向后移动一位
                        // 然后j开始从i的位置继续向后寻找元素
                        j = ++i;
                    }
                }
                a.push(this[i]);
            }
            ;
            return a;
        }
        /**
         * 去除数组中的重复项
         * 【实现思路】：先对数组进行排序，然后比较相邻的元素是否相同
         * @return {Array}
         */
        Array.prototype.unique = function () {
            var tmp = [],
                len = this.length;
            // 1.先对原始的数组进行排序
            this.sort();
            // 2.比较相邻的元素
            for (var i = 0; i < len; i++) {
                // 只要相邻的元素相同，就直接跳过
                if (this[i] === this[i + 1]) {
                    continue;
                }

                // 由于tmp.length初始的位置一直是0， 添加一个元素之后变为1，因此下标和长度每次相差1， 实现了实时插入数据的功能
                tmp[tmp.length] = this[i];
            }
            return tmp;
        }

        /**
         * 实现两个数组的并集，然后去除重复元素
         * @param target
         * @return {*}
         */
        Array.prototype.union = function (target) {
            // concat() 方法用于连接两个或多个数组。
            // 连接数组之后然后去除数组中的重复项
            return this.concat(target).union();
        }

        /**
         * 求出两个数组的交集
         * @param target
         * @return {Array|*[]}
         */
        Array.prototype.intersect = function (target) {
            // 1.先去除原始数组和目标数组中的重复元素
            var originArr = this.unique(),
                targetArr = target.unique();
            // filter()的作用是返回某一数组中满足条件的元素，该方法返回的是一个新的数组
            // 2.开始使用条件过滤
            /**
             * @param element（必选）：当前元素的值
             @param index（可选）： 当前元素的索引
             @param array（可选）：当前元素所属的数组
             */
            return originArr.filter(function (element, index, array) {
                // filter函数默认会把所有的返回false的元素去掉
                for (var i = 0, len = targetArr.length; i < len; i++) {
                    if (element === targetArr[i]) {
                        // 只要是返回满足true的所有条件，基本上都会被过滤掉
                        return true;
                    }
                    //return false;
                }
                // 只有找到相同的元素的时候返回的是true,其他情况都是返回的是false
                return false;
            });

        }

        /**
         * 找出两个数组中的不同元素
         * @param target
         * @return {Array|*[]}
         */
        Array.prototype.diff = function (target) {
            // 1. 获取原始数组和目标数组，去除重复项
            var orignArr = this.unique(),
                targetArr = target.unique();
            // 2. 开始使用filter函数过滤条件
            return orignArr.filter(function (element, index, array) {
                for (var i = 0, len = targetArr.length; i < len; i++) {
                    // 只要元素相等的话，就全部过滤掉
                    if (element === targetArr[i]) {
                        return false;
                    }
                }
                return true;
            });
        }

        /**
         * 对数组的每一项遍历的时候设置一个回调函数（没有返回结果）
         * @param fn
         * @param ctx
         */
        Array.prototype.forEach = function (fn, ctx) {
            var i = 0,
                len = this.length;
            for (; i < len; i++) {
                // element, index, array
                // call 的第一个参数也就是this的指向， 其他参数表示需要传递给回调函数的的参数
                fn.call(ctx || null, this[i], i, this);
            }
        }

        /**
         *
         * 对数组的每一项执行回调，返回由回调函数的结果组成的数组
         * @param fn
         * @param ctx
         * @return {Array}
         */
        Array.prototype.map = function (fn, ctx) {
            // 初始化变量
            var ret = [],
                i = 0,
                len = this.length;
            // 遍历数组的每一项元素， 返回由回调函数的结果组成的数组
            for (; i < len; i++) {
                // 调用回调函数， 返回指向结果
                res = fn.call(ctx || null, this[i], i, this);
                // 将每一项执行的结果放入到一个新的数组里面
                ret.push(res);
            }
            return ret;
        }
        /**
         * 对数组的每一项执行回调函数， 返回回调函数执行结果为true的数组集合
         * @param fn
         * @param ctx
         */
        Array.prototype.filter = function (fn, ctx) {
            var ret = [],
                i = 0,
                len = this.length;
            // 遍历每一项，把执行结果为true的所有元素集合存起来
            for (; i < len; i++) {
                // 注意这里的这种运算方式只会返回所有的回调函数返回true的计算结果集
                fn.call(ctx || null, this[i], i, this) && ret.push(this[i]);
            }
            return ret;
        }


        /**
         * 遍历数组中的每一项元素
         * @param fn
         */
        Array.prototype.each = function (fn) {
            var i = 0,
                len = this.length;
            for (; i < len; i++) {
                fn.call(this[i]);
            }
        }


        /**
         * 对数组的【每一项】执行回调函数，必须每一项回调函数返回true， 就返回true
         * @param fn
         * @param ctx
         */
        Array.prototype.every = function (fn, ctx) {
            var i = 0,
                len = this.length;
            // 遍历数组中所有的元素， 只要有一个函数回调函数为false就返回false,只要所有的都是true才会返回true
            for (; i < len; i++) {
                // 如：a默认是undefined，!a是true，!!a则是false，所以b的值是false，而不再是undefined。这样写可以方便后续判断使用。
                // 所以，!!(a)的作用是将a强制转换为布尔型（boolean）。
                // 如果a = null, !!(a) 的结果就是假， 可以直接把一个弱类型强制转换为一个新的类型
                // 下面的代码就是强制将一个函数转换为bool的类型
                if (!!fn.call(ctx || null, this[i], i, this) === false)
                    return false;

                // 上面的代码等价于
                /*if (fn.call(ctx || null, this[i], i, this)) {
                    return true;
                }*/
            }
            return true;
        }
        /**
         * 对数组中的每一项执行回调函数，只要有一项为true的话，就是true，否则就是false
         * @param fn
         * @param ctx
         */
        Array.prototype.some = function (fn, ctx) {
            var i = 0,
                len = this.length;
            // 循环遍历每一项，只要有一项为true，就是true
            for (; i < len; i++) {
                /*
                * // 强制转换为Boolean 用 !!
                var bool = !!"c";
                console.log(typeof bool); // boolean

                // 强制转换为Number 用 +
                var num = +"1234";
                console.log(typeof num); // number

                // 强制转换为String 用 ""+
                var str = ""+ 1234;
                console.log(typeof str); // string
                * */
                if (!!fn.call(ctx || null, this[i], i, this) === true)
                    return true;
            }
            return false;
        }

        /**
         * 从左向右执行回调函数（第二个元素开始）
         * 其中包含了上一次回调的返回值
         * @param callback
         */
        Array.prototype.reduce = function (callback) {
            var i = 0,
                len = this.length,
                callbackRet = this[0];          // 这个变量保存着上一次回到的函数的返回结果， 默认存储的是第一个元素
            for (; i < len; i++) {
                // this的指向，element， index， 数组对象本身
                // callbackRet 里面存储了数组上一次计算的处理结果
                callbackRet = callback.call(null, callbackRet, this[i], i, this);
            }
            return callbackRet;
        }

        /**
         * 从右向左处理每一项元素，倒数第二项开始执行
         * @param callback
         */
        Array.prototype.reduceRight = function (callback) {
            var len = this.length,
                i = this[len - 2],
                callbackRet = this[len - 1];        // 保存着最后一项

            // 从倒数第二项开始向前遍历数组的每一项
            for (; i >= 0; i--) {
                //this指向， prev， element, index, arr
                callbackRet = callback.call(null, callbackRet, this[i], i, this);
            }
            return callbackRet;
        }


        /**
         * 返回目标值target在数组中第一次出现的位置， 搜索默认会从左向右执行
         * @param target
         * @param start
         */
        Array.prototype.indexOf = function (target, start) {

            /*
            * 其实是一种利用符号进行的类型转换,转换成数字类型
            ~~true == 1
            ~~false == 0
            ~~"" == 0
            ~~[] == 0
            ~~undefined ==0
            ~~!undefined == 1
            ~~null == 0
            ~~!null == 1
            * */
            var len = this.length,
                start = ~~start;        // 如果start不传过来，这里就是undefined，指向后面的就会保存，这里使用了~~把其他类型强制转换为数字类型
            if (start < 0) {
                // 如果指定搜索的起始位置小于0的话， 默认就从0的位置开始向后搜索
                start = 0;
            }
            // 从用户指定的起始位置开始向后搜索
            for (; start < len; start++) {
                if (this[start] === target) {
                    return start;
                }
            }
            // 如果没找到的话，就返回-1
            return -1;
        }


        /**
         * 返回指定的目标值在数组中最后一次出现的位置
         * @param target
         * @param start
         */
        Array.prototype.lastIndexOf = function (target, start) {
            // 这里相当于是typeof start ==== 'undefined'
            if (start === void 0) {
                start = this.length;
            } else if (start < 0) {
                start = 0;
            }

            // 开始从数组的最后面向前遍历
            for (; start >= 0; start--) {
                // 找到目标元素target在数组中最后一次出现的位置（从后向前找）
                if (this[start] === target) {
                    return start;
                }
            }
            return -1;
        }

        /**
         * 数组去重方法加强版本
         * 局限性：只适用于数组中存放的是单一的数据类型，如果是多种数据类型并存的话，就会去重失败
         * ['ff', 1, '1']
         */
        Array.prototype.enhanceUnique = function () {
            var ret = [],
                tempMap = {},
                i = 0,
                len = this.length,
                temp;

            // 遍历数组的每一项
            for (; i < len; i++) {
                temp = this[i];
                // 只要这个tempMap中没有这一项的话，就直接放入到数组中去
                if (tempMap[temp] === void 0) {
                    ret.push(temp);
                    // {}数据的存储格式为{1 : true, 2 : false, 3 : false}
                    tempMap[temp] = true;
                }
            }
            return ret;
        }


        /**
         * 删除数组中的指定元素， 通过arguments伪数组的方式来接受传递过来的参数
         * 经过测试，只能删除数组中重复的多余的元素
         * @return {Array}
         */
        Array.prototype.without = function () {
            // slice(start, end) 方法可从已有的数组中返回选定的元素。
            // 如果slice()这个函数没有指定结束的位置的话，默认是会返回数组中的start之后的所有元素
            // 1. 获取用户传过来的参数， 去掉数组中重复的元素
            //var args = [].slice.call(arguments).unique();
            /*
            * Array.prototype.slice.call({
             0:"likeke",
             1:12,
             2:true,
             length:3
            });
            * */
            //1. 由于arguments实际上是一个伪数组，不能直接使用数组里面的方法
            // 因此先要把arguments转换为数组
            var arr = Array.prototype.slice.call(arguments) || [].slice.call(arguments);
            // 2. 把数组中的重复元素去重
            var args = arr.unique(),
                len = this.length,
                aLength = args.length,
                i = 0,
                j = 0;


            // 遍历原始的数组(由于后面每次删除掉一个元素之后，这里的this.length的长度就是已经都改变了， 因此每次在执行完毕之后都要重新计算一下length)
            for (; i < len; i++) {
                for (; j < aLength; j++) {
                    if (this[i] === args[j]) {
                        // 只要删除的数组在我的这个里面，就直接去掉
                        // i 为起始的值，1为要删除的项， 也就是删除i位置的元素
                        // splice  返回的是删除的元素， this内容是已经修改过之后的项
                        this.splice(i, 1);

                        // 为了避免删除数组的元素之后的数组长度的变化，这里需要重新计算一下数组的新的长度
                        // len = this.length;
                    }

                }
                // 将j下标复位，以便下一次循环(注意是在每一次j循环完毕之后然后再把j初始化到原始的状态)
                j = 0;
            }
            return this;
        }


        /**
         * 去掉数组中的目标元素
         */
        Array.prototype.enhanceWithout = function () {
            // 用于去除数组中指定的的多余的元素
            var ret = [],
                len = this.length,
                args = ([]).slice.call(arguments),
                argsLength = args.length,
                i = 0,
                j = 0;

            for (; i < len; i++) {
                for (; j < argsLength; j++) {
                    if (args[j] !== this[i]) {
                        ret.push(this[i]);
                    }
                }
                // 由于这里的j使用的是局部变量，因此这里需要进行处理
                j = 0;
            }
            return ret;
        }


        /**
         * 实现一个数组的扁平化(可以解决数组里面存放数组的问题)【递归处理调用】
         * [[], [], [], [[], [], []]]
         * @return {Array}
         */
        Array.prototype.flatten = function () {
            // 实现一个flatten函数，将一个嵌套多层的数组 array（数组） (嵌套可以是任何层数)转换为只有一层的数组
            // 数组中元素仅基本类型的元素或数组，
            var ret = [],
                len = this.length,      // 注意当下一次执行递归调用之后，这里的this指向的是tmp
                i = 0,
                tmp;

            for (; i < len; i++) {
                // 注意这里先取出来数组中的每一项元素
                tmp = this[i];
                // 判断一下数组里面存放的还是不是数组类型（数组里面的每一项）
                if (({}).toString.call(tmp) === '[object Array]' || Object.prototype.toString.call(tmp) === '[object Array]') {
                    // 继续递归调用(递归调用的时候需要把结果存起来哦)
                    // 1. 对当前数组里面的数组进行扁平化处理, tmp.flatten()得到的就是一个普通的数组类型
                    // 2. 由于ret是一个数组类型，使用concat之后可以把两个数组里面的元素链接起来
                    // 下一次执行递归的时候上面的this就是指向了这里的tmp数组
                    ret = ret.concat(tmp.flatten())
                    //tmp.flatten();
                } else {
                    // 如果不是数组类型的话，就直接放入到我的新数组里面
                    ret.push(tmp);
                }
            }
            return ret;
        }


        /**
         * 删除数组中的指定位置的项
         * @param pos
         * @return {Array}
         */
        Array.prototype.removeAt = function (pos) {
            // 移出数组中指定位置的项
            // slice() 函数调用的执行结果返回的是删除掉的项， 这个this就是修改之后的项
            this.splice(pos, 1);
            return this;
        }

        /*
        【经验话语1】
          直接用等号 （==） 判断时，变量必须要声明（包括不用var 的隐式声明），否则出错。
          不管变量有没有声明，都可用typeof 判断，注意typeof 返回结果为字符串，所以是与"undefined"做比较。
          所以，判断类型最好用typeof ，因为当判断的变量是在其他js 文件中定义的全局变量时，
          执行此判断时，定义该变量所在的js 文件可能还未加载完成，用== 判断就会报错：is not defined
        【经验话语2】

        注意slice()和splice（） 这两者的区别
        * */


        /**
         * 检测数组中是不是包含某一项
         * @param target
         * @return {boolean}
         */
        Array.prototype.contains = function (target) {
            // 可以调用自己之前申明好的some方法，数组中只要有一项，就会返回true
            return this.some(function (element, index, self) {
                // 调用this.some()方法实际上会返回遍历数组元素的每一项
                return element === target;
            })
        }

        /**
         * 随机返回数组中的某一项(把数组中的任意一项返回)
         * @param n
         * @return {*}
         */
        Array.prototype.random = function (n) {
            //Math.floor():向下取整。Math.floor(1.8) -> 1
            //Math.ceil():向上取整。Math.ceil(1.1) -> 2
            //v = Math.random() * n:会产生一个 0 < v < nv的数
            //v2 = Math.floor(Math.random() * n)：v2为一个大于等于0，小于n的整数
            var index = (Math.floor(Math.random() * n));
            return this[index] || this[this.length - 1];
        }
    }


    // Function对象方法的扩充
    function functionExtend(func) {
        Function.prototype.before = function (func) {
            // 一般来说加下划线的变量为私有变量，这是常规都比较遵守的一种代码规范。
            var __self = this;      // 私有的属性用下划线
            return function () {
                // 重新把我需要传递的参数传递过去， 如果目标函数返回的是false, 就是false
                if (func.apply(this, arguments) === false) {
                    return false;
                }
                // 否则就把我的自己的参数传递过去
                return __self.apply(this, arguments);
            }
        }


        /**
         * AOP 切面编程的函数扩充
         * @param func
         * @return {Function}
         */
        Function.prototype.after = function (func) {
            var __self = this;
            return function () {
                var ret = __self.apply(this, arguments);        // //返回一个函数，相当于一个代理函数，也就是说，这里包含了原函数和新函数，原函数指的是myFunc，新函数指的是fn
                if (ret === false) {
                    return false;
                }
                func.apply(this, arguments);
                return ret;
            }
        }

    }
})();


// 主框架: 只做一件事，就是用于获取所有的元素集合
;(function (w) {
    // 定义一个Xframe对象，后面就是他的构造函数
    var xframe = function (selector, context) {
        // 为了使得后面的函数this始终指向的是xframe框架，这里需要修改函数内部this的指向
        return this.init.apply(this, [selector, context]);
    };

    // 定义一个初始化函数，用于初始化获取所有的元素集合
    // 只要用户使用了类似于JQuery中的选择元素的方法，就开始选择一个元素集合
    // 这里的核心功能：实际上是为了使用一个伪数组实现一个类似于JQuery中的链式访问的功能
    xframe.prototype.init = function (selector, context) {
        // 开始构建一个伪数组：{1 : list[0], 2 : list[1], , , , length : list.length}
        this.length = 0;

        // 针对没有参数的处理方式
        if (typeof selector === 'undefined') {
            return this;
        }

        if (typeof  selector === 'string') {
            var nodeList = (context || document).querySelectorAll(selector);
            this.length = nodeList.length;
            for (var i = 0, len = this.length; i < len; i++) {
                this[i] = nodeList[i];
            }
        } else if (selector.nodeType) {
            // 如果获取的是一个元素节点，文本节点，或者属性节点的话
            this[0] = selector;
            this.length++;
        }

        // 为了可以支持链式访问必须把这个this对象返回出去
        return this;
    };


    // 使用双对象法则继续暴露出去一个对象，进行对象的二次封装
    // 【双对象法则的使用】
    var $$ = function (selector, context) {
        // 这里使用一个简单的异步加载机制，等待所有的DOM元素执行完毕之后再开始继续向下执行
        if (typeof selector === 'function') {
            // selector就是DOM元素加载完毕之后的继续向下执行的回调函数
            //w.onload = selector;

            // 使用自己定义的函数来实现一个domReady(ele, fn)的功能, 默认就是整个document加载完毕之后才会继续向下执行
            // 使用call的时候第一个参数不能少哈， 否则传过去的参数就是空的
            //$$.onDOMReady.call(this, selector);

            // 使用apply传参的时候必须传递的是一个数组类型
            //$$.onDOMReady.apply(this, [selector]);

            // 如果使用bind的话(只是会修改调用函数内部的指向， 但是不会调用)
            // bind 是返回对应函数，便于稍后调用；apply 、call 则是立即调用 。【只是会返回一个函数， 但还是不会立即调用】
            var func = $$.onDOMReady.bind(this, selector);
            // 调用使用bind()方法返回的函数
            func();

        } else {
            // 如果不是一个函数的话
            return new xframe(selector, context);
        }
    }

    // 添加一个extend方法， 用于扩充一个对象的方法， 扩展向一个类中拷贝方法
    $$.extend = function () {
        // 这里需要分为两种情况：
        // 1. 如果传过来的是一个参数的话，就相当于是给xframe对象添加方法
        // 2. 如果是两个参数的话，就相当于是给一个类扩充方法(把一个函数的方法拷贝到另一个类中去)
        var len = arguments.length,
            target = null,              // target 用来存储需要把方法拷贝进去的目标函数
            i = 1,                      // 初始化变量i, 表示需要开始遍历的起始位置标记
            key;                        // 为了防止定义太多的局部变量，可以把后面需要用到的所有局部变量事先在前面定义好
        if (len === 0) {
            return;
        } else if (len === 1) {
            // 给xrame对象添加方法
            target = xframe.prototype;
            i--;
        } else {
            // 两个参数的话，那么第一个参数就是我需要拷贝新的方法进去的目标对象
            // 如果是两个参数的话：就不需要修改变量i的值了， 直接从第一个位置开始，拿到第一个参数后， 把第二个参数的方法全部拷贝给第一个对象
            // 注意: 这里有可能也是三个参数或者是多个参数， 因此也可以吧后面的好几个对象的属性或者方法添加给第一个对象
            target = arguments[0];
        }


        // 确定好了target 这个目标对象以后，开始遍历原始对象那个source，把source里面的方法全部都拷贝到这个target对象里面
        for (; i < len; i++) {
            // 这里实际上在遍历一个json对象，json对象的每一项实际上就是一个属性或者方法
            // 遍历每一个arguments， 获取每一个参数的属性， 然后把这个属性拷贝到原始的对象
            for (key in arguments[i]) {
                target[key] = arguments[i][key];
            }
        }
        return target;
    }


    // 为了把主框架里面的局部变量暴露出去供其他模块使用
    w.xframe = w.$ = $$;

})(window);


// 公共框架
// 种子模块：命名空间、对象扩展、数组化、类型的判定、domReady机制，无冲突处理
;(function (xframe) {
    // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
    xframe.extend({
        // 版本1：从前向后遍历
        each: function (fn) {
            var i = 0,
                len = this.length;
            for (; i < len; i++) {
                // call第一个参数传递的实际上就是this的执行，后面的参数就是目标函数fn需要传递的参数（可省略）
                // this[i] 里面的取值方式类似于json取值，每一个参数存储了选择器获取的所有的nodeList元素集合中的一个元素
                fn.call(this[i]);
            }
            return this;
        },
        // 版本2： 从后向前遍历(建议对于DOM元素一般从后向前开始遍历)
        each: function (fn) {
            var i = this.length - 1;
            for (; i >= 0; i--) {
                fn.call(this[i], i);
            }
        },
        /**
         * 将一个伪数组转换为数组，然后开始遍历这个集合
         * @param pArr
         * @param fn
         */
        toArray: function (pArr, fn) {
            var arr = Array.prototype.slice.call(pArr),
                i = arr.length - 1;
            for (; i >= 0; i--) {
                // element index
                fn.call(arr[i], i);
            }

        },

    });

    // 不需要参与链式访问的
    /*公共部分*/
    xframe.extend(xframe, {});

    /*字符串处理模块*/
    xframe.extend(xframe, {
        /*
        * 下面的这几个都会用到正则表达式，会在后面补充
        * camelCase函数的功能就是将形如background-color转化为驼峰表示法：backgroundColor
        * */
        camelCase: function (str) {
            //  all: -c, letter: c
            return str.replace(/\-(\w)/g, function (all, letter) {
                // 把所有的字母都转换为大写的状态
                return letter.toUpperCase();
            });
        },
        /**
         * 去掉左边的空格 str = ' ()'
         * @param str
         * @returns {*}
         */
        ltrim: function (str) {
            /*
            ^ ：表示以XX开头
            \s: 表示空格
            *:  表示匹配零个或者多个
            g: 表示匹配全部，如果没有的话默认只会匹配一个
            (^\s*): 表示以空格开头的一个或者多个字符
            str.replace(, ''): 替换……


            ----------------------------------------------------[其他用法归纳]-------------------------------------
            ^, $: 匹配字符串开始，结束的位置      eg:
            g, i：匹配所有，不区分大小写的字符串； eg: /a/g, /a/i
            *， +， ？: 匹配任意次数, 匹配前面的字符一次或者多次， 0次或者1次

            [] : 匹配一个字符集合； eg: [a-z]所有小写字母的集合， [0-9]所有数字的集合
                                  eg: [a-zA-Z]所有大小写字母的集合
            脱字符^: 匹配任何不在该集合中的字符，与上面的用法正好相反
            {}: 指定重复前面的一个字符多少遍  eg:{N} 重复n遍
                                            eg:{n, m}重复n-m遍
                                            eg: {n, }至少重复n遍
                                            eg：{,m}至多重复m遍



            // 【熟记：同类记忆法】
            \s: 表示空格：包括空格、换行、回车、tab，等价于[\n\r\t\f]
            \S: 匹配非空格字符，等价于[^ \n\r\t\f]
            \d: 表示十进制数字，等价于[0-9]
            \D: 匹配一个非数字字符， 等价于[^0-9]
            \w(小写): 表示字母或者数字，等价于[a-zA-Z0-9]
            \W: 非字母且非数字，与\w相反，等价于：[^a-zA-Z0-9]*

            * */
            return str.replace(/(^\s*)/g, '');
        },
        /* 去掉右边的空格, str = '() '
        * @param str
        */
        rtrim: function (str) {
            return str.replace(/(\s*$)/g, '');
        },
        /**
         * 用于去掉两边的空格(去掉所有的空格) str  =' () '
         * @param str
         * @returns {*}
         */
        trimOld: function (str) {
            return str.replace(/(\s*$)/g, '');
        },
        /**
         * 【使用模板来实现一个简单的数据绑定】
         * 实现简单的数据绑定： @（name）, @(sex)
         * data: var user = {name : 'xiugang', role, '钻石会员'}
         * str: = '欢迎@(name)， 等级：@(role)光临本站！';
         * @param str   原始的数据格式
         * @param data  需要绑定的数据对象，是一个json格式的数据， json = {name : 'xiuxiu', age : 18}
         * @returns {*}
         */
        formateString: function (str, data) {
            // 使用后面的值去替换掉前面的值
            // 细节分析：((\w+))使用括号匹配的值在JavaScript中实际上就是一个$1, 把这个参数传给match
            // (\w+) 第二个括号实际上匹配到的就是一个$2, 把这个参数传给key
            // match: @(name), @(age), @(sex)
            // key: name, age, sex
            return str.replace(/@\((\w+)\)/g, function (match, key) {
                // 先判断有没有匹配到相应的字符串
                // 找到@()开始的字符串， 使用数据域中的数据去替换
                // 如果json数据data里面么有找到相应的data[key]数据，返回的实际上就是一个空的字符串
                return typeof  data[key] === 'undefined' ? '' : data[key];
            });

        },
        /**
         * @param str
         * @returns {*}
         */
        trimLeft: function (str) {
            return str.replace(/^\s*/g, '');
        },
        /**
         * @param str
         * @returns {*}
         */
        trimRight: function (str) {
            return str.replace(/\s*$/g, '');
        },
        /**
         * 去掉所有的空格(两边的空格)， 可以针对任意格式的字符串
         * 先去掉左边的空格，然后去掉右边的空格
         * @param str
         * @returns {*}
         */
        trim: function (str) {
            // var regx = '/^\s*\s*$/g';
            // return str.replace(regx, '');
            // | 表示或的意思, 也就是满足| 左边的也成立, 满足 | 右面的也成立
            // (^\s*) 表示的就是以0个空格或者多个空格开头
            // (\s*$) 的意思就是, 以0个空格或者多个空格结尾
            // /…/g 是正则表达式的属性, 表示全文匹配, 而不是找到一个就停止
            return str.replace(/(^\s*)|(\s*$)/g, "");
            //return this.trimRight(this.trimLeft(str));
        },
        /**
         * 发送一个ajax请求
         * @param url  请求的URL地址信息
         * @param fn， 请求成功的回调函数
         */
        ajax: function (url, fn) {
            // 创建一个XMLHTTPRequest对象
            var xhr = createXHR();
            // 每当 readyState 改变时，就会触发 onreadystatechange 事件。
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    // 接受到响应之后，第一步检查status属性，为200则表明成功，此时responseText已经准备就绪；
                    // 为304表明请求资源未被修改，可以直接使用浏览器中的缓存版本。
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        fn(xhr.responseText);
                    } else {
                        alert('错误的文件！');
                    }
                }
            };


            // 定义请求参数, 对于指定的url发送一个get请求
            xhr.open('get', url, true);
            // 发送请求
            // 第三个参数：指示请求使用应该异步地执行。
            // 如果这个参数是 false，请求是同步的，后续对 send() 的调用将阻塞，直到响应完全接收。
            // 如果这个参数是 true 或省略，请求是异步的，且通常需要一个 onreadystatechange 事件句柄。
            xhr.send();


            /**
             *   创建一个XHR
             */
            function createXHR() {
                //本函数来自于《JavaScript高级程序设计 第3版》第21章
                if (typeof XMLHttpRequest != "undefined") {
                    return new XMLHttpRequest();
                } else if (typeof ActiveXObject != "undefined") {
                    // arguments.callee用于指向他的回调函数
                    if (typeof arguments.callee.activeXString != "string") {
                        var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                                "MSXML2.XMLHttp"
                            ],
                            i, len;

                        for (i = 0, len = versions.length; i < len; i++) {
                            try {
                                new ActiveXObject(versions[i]);
                                arguments.callee.activeXString = versions[i];
                                break;
                            } catch (ex) {
                                //skip
                            }
                        }
                    }

                    return new ActiveXObject(arguments.callee.activeXString);
                } else {
                    throw new Error("No XHR object available.");
                }
            }


        },
        /**
         * $.ajax({
             url: 'http://118.31.238.237:8080/metro/get',    //请求地址
             type: 'GET',                                    //请求方式
             data: {cityId:2},                               //请求参数
             dataType: 'json',
             success: (response) => {
                    console.log(response)
                }
             });
         * @param opt
         */
        ajax: function (opt) {
            opt = opt || {};
            opt.type = opt.type.toUpperCase() || "POST";
            opt.dataType = opt.dataType ? opt.dataType : 'json';
            opt.url = opt.url || '';
            // 是否异步请求：默认值为 true（可选参数）；如果这个参数是 false，请求是同步的，后续对 send() 的调用将阻塞，直到响应完全接收
            opt.async = opt.async || true;
            opt.data = opt.data || null;
            opt.success = opt.success || function () {
            };
            var xmlHttp = null;

            if (window.XMLHttpRequest) {
                // 创建一个HTTP请求对象
                xmlHttp = new XMLHttpRequest();
            } else {
                // IE 浏览器(IE6以下)
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            var params = [];
            // 解析用户发送过来的参数信息
            for (var key in opt.data) {
                // 数组里面存放的数据格式 [name=zhangsan, age = 14, sex=male]
                params.push(key + '=' + opt.data[key]);
            }

            // 开始把数组里面的数据转换为&
            // name=zhangsan&age=15&sex=14
            var postData = params.join('&');
            if (opt.type === 'POST') {
                // 请求方法 URL地址 是否同步m 将请求数据 放到 请求主体中，并没有发送
                xmlHttp.open(opt.type, opt.url, opt.async);
                // 设置请求首行( 通过FORM表单的方式来提交数据), 设置表单提交时的内容类型
                // 由于通过表单的方式提交数据可以是POST请求，因此这里设置为表单方式来提交数据
                xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                // 开始发送数据
                xmlHttp.send(postData);
            } else if (opt.type === 'GET') {
                // get方式的请求地址会在地址栏显示出来
                var getData = postData ? (opt.url + '?' + postData) : opt.url;
                xmlHttp.open(opt.type, getData, opt.async);
                xmlHttp.send(null);
            }

            // 添加一个事件
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    // 本次请求成功
                    opt.success(xmlHttp.responseText);
                }
            }


        },
        /**
         * json转换为字符串
         * @param json
         * @returns {string}
         */
        json2String: function (json) {
            return JSON.stringify(json);
        },
        /**
         * 字符串转换为json
         * @param str
         * @returns {any}
         */
        string2Json: function (str) {
            return eval(str);
        }
    });


    /*数组相关*/
    xframe.extend(xframe, {
        /**
         * 将一个数组清空，并返回数组的引用
         * 只需要把数组的元素置空为0即可
         * @return {xframe}
         */
        clear: function () {
            this.length = 0;
            return this;

        },
        /**
         * 返回数组的第0个元素
         * @return {*}
         */
        first: function () {
            return this[0];

        },
        /**
         * 返回数组的最后一个元素
         * @return {*}
         */
        last: function () {
            return this[this.length - 1];
        },
        /**
         * 计算一个数组的大小尺寸
         * @return {number|*}
         */
        size: function () {
            return this.length;
        },
        cacl: function (arr, callback) {
            var ret;
            for (var i = 0; i < arr.length; i++) {
                // 专门用于处理每一项的计算机过程
                ret = callback(arr[i], ret);
            }
            return ret;
        },
        /**
         * 对数组里面的所有元素求和
         * @return {*}
         */
        sum: function () {
            // 1. 正常写法
            var ret;
            for (var i = 0; i < this.length; i++) {
                ret = ret + this[i];
            }
            return ret;
        },
    });


    /*Math*/
    xframe.extend(xframe, {
        random: function () {

        }

    });


    /*数据类型检验*/
    xframe.extend(xframe, {
        // 鸭子类型（duck typing）如果它走起路来像鸭子，叫起来也是鸭子，那么它就是鸭子。
        // 只关注对象的行为，不关注对象本身面向接口编型 ，而不是面向实现编程，是设计模式中最重要的思想。
        // 【理解】：一个对象有效的语义，不是由集成自特定的类或实现特定的接口， 而是由当前方法和属性的集合决定的!!!
        isNumber: function (val) {
            // 如果这个数字是有限的话， 而且是数字类型
            return (typeof val === 'number' && isFinite(val)) && (Object.prototype.toString.call(val) === '[object Number]');
        },
        /***
         * 判断一个变量是不是Boolean类型
         * @param val
         * @returns {boolean}
         */
        isBoolean: function (val) {
            return (typeof val === 'boolean') && (Object.prototype.toString.call(val) === '[object Boolean]');
        },
        /**
         * 判断一个变量是不是字符串类型
         * @param val
         * @returns {boolean}
         */
        isString: function (val) {
            return (typeof val === 'string') && (Object.prototype.toString.call(val) === '[object String]');
        },
        /**
         * 判断一个变量是不是undefined
         * @param val
         * @returns {boolean}
         */
        isUndefined: function (val) {
            // oid 0 is a correct and standard way to produce undefined.
            return (val === void 0) || (typeof val === 'undefined') && (Object.prototype.toString.call(val) === '[object Undefined]');
        },
        /**
         * 判断一个变量是不是为空
         * @param val
         * @returns {boolean}
         */
        isNull: function (val) {
            return (val === null) && (Object.prototype.toString.call(val) === '[object Null]');
        },
        /**
         * 检测
         * @param obj
         * @returns {*}
         */
        isNaN: function (val) {
            // 只要这个数字通过判断是不是和他自身相同或者使用typef的方式去检测
            return val !== val;
        },
        /**
         * 判断一个变量是不是一个对象类型
         * @param val
         * @returns {boolean}
         */
        isObject: function (val) {
            if (val !== null && val !== undefined) {
                if ((typeof val === 'object') && (Object.prototype.toString.call(val))) {
                    return true;
                }
            }
            return false;
        },
        /**
         * 判断一个对象是不是数组对象
         * @param val
         * @returns {boolean|void|string}
         */
        isArray: function (val) {
            // 判断上不是一个数组的先判断这个数组对象是不是为空， 因为如果val为空的话，就是val.constructor这个属性实际上是没有的，error
            if (val !== null || typeof val !== "undefined") {
                // 注意在使用constructor判断数据类型的时候比较的实际上是他的原型对象的constructor属性， 这个属性指向的实际上是这个变量的原型对象
                return (val.constructor === Array) && (Object.prototype.toString.call(val) === '[object Array]');
            }
            return false;
        }

    });


    /*数组化：arguments, document.forms, document.getElementsByName， document.getElementsByTagName()*/
    xframe.extend(xframe, {
        /**
         * 把一个伪数组转换为一个新的数组
         * 实现思路： 取出伪数组中的每一个元素， 然后把取出来的这些元素重新放入到一个新的数组里面去！！！
         * @param start
         * @param end
         * @returns {Array}
         */
        toArray: function (start, end) {
            var result = [];
            var start = start || 0,
                // 这里的this指向调用的对象，使用了call之后， 改变了this的指向， 指向传进来的对象(外边必须要修改this的指向)
                // 如果外边不修改this的指向，这里的this默认指向的是xframe这个框架对象
                end = end || this.length;
            for (var i = start; i < end; i++) {
                result.push(this[i]);
            }
            return result;
        },

        /**
         * 方法二： 直接把一个伪数组转换为JavaScript中的一个数组对象
         * @param obj
         * @returns {T[]}
         */
        slice: function (obj) {
            return Array.prototype.slice.apply(obj);
        }
    });

    /*domReady的实现*/
    xframe.extend(xframe, {
        //arguments 的主要用途是保存函数参数， 但这个对象还有一个名叫 callee 的属性，该属性是一个指针，指向拥有这个 arguments 对象的函数
        /**
         * 实现一个domReady方法：所有元素都加载完毕之后一个回调函数
         * @param domElement
         * @param fn
         */
        onDOMReady: function (fn) {
            if (document.addEventListener) {
                // W3C组织: 如果传过来的是一个DOM元素的话，就直接对这个DOM元素添加监听， 否则，就对整个document添加事件监听
                document.addEventListener('DOMContentLoaded', fn, false);
            } else {
                // IE浏览器
                IEContentLoaded(fn);
            }


            /**
             * 微软的IE浏览器的处理方法
             * @param fn
             * @constructor
             */
            function IEContentLoaded(fn) {
                // 定义需要的全局变量
                var done = false, document = window.document;


                // 这个函数只会在所有的DOM节点树创建完毕的时候才会继续向下执行
                var init = (function () {
                    if (!done) {
                        console.log('done……');
                        // 如果DOM树创建完毕的话
                        done = true;
                        fn();
                    }
                })();


                /*
                使用这个立即函数来调用IE浏览器的内置函数实现domReady的功能
                 */
                (function () {
                    try {
                        // DOM树在未创建完毕之后调用 doScroll的话，会抛出错误
                        document.documentElement.doScroll('left');

                    } catch (err) {
                        // 延迟1秒之后再次执行这个函数， 形成一个函数递归调用的功能【回调函数】
                        // clllee是一个函数指针，指向的是拥有这个arguments对象的函数， 从而实现再次调用这个函数
                        setTimeout(arguments.callee, 1);
                        return;
                    }

                    // 如果没有错误的话，表示DOM树已经完全创建完毕， 此时开始执行用户的回调函数
                    init();
                })();

                // 监听document的加载状态(DOM加载的过程中会不断回调这个函数)
                document.onreadystatechange = function () {
                    console.log('onreadystatechange……');
                    if (document.readyState === 'complete') {
                        console.log('complete……');
                        // 如果加载完成的话
                        document.onreadystatechange = null;
                        init();
                    }
                }
            }
        }
    });
})(xframe);


// 事件框架
;(function (xframe) {
    // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
    xframe.extend({
        /**
         * 实现一个浏览器的基本事件的绑定
         * @param type
         * @param fn
         * @return {on}
         */
        on: function (type, fn) {
            // 注意这里的初始的下标编号是长度减一
            var i = this.length - 1;
            // 可以实现兼容版本的IE浏览器和W3c浏览器的支持
            if (document.addEventListener) {
                // w3c(这里使用的方式是从后向前遍历， 使得每一个DOM加载完毕之后再去添加事件)
                for (; i >= 0; i--) {
                    this[i].addEventListener(type, fn, false);
                }
            } else if (document.attachEvent) {
                // IE
                for (; i >= 0; i--) {
                    this[i].attachEvent('on' + type, fn);
                }
            } else {
                // 其他的浏览器
                for (; i >= 0; i--) {
                    // 获取json数据的两种方式，绑定事件的方式也可以
                    this[i]['on' + type] = fn;
                }
            }
            return this;
        },
        /**
         * 实现事件的解除绑定
         * @param type
         * @param fn
         * @return {un}
         */
        un: function (type, fn) {
            // 注意这里的初始下标编号
            var i = this.length - 1;
            if (document.removeEventListener) {
                // W3c
                for (; i >= 0; i--) {
                    this[i].removeEventListener(type, fn, false);
                }
            } else if (document.detachEvent) {
                // IE浏览器
                for (; i >= 0; i--) {
                    this[i].detachEvent(type, fn);
                }
            } else {
                // 其他浏览器的话，就直接默认绑定的所有事件置为null
                for (; i >= 0; i--) {
                    // 移出所有绑定的事件
                    this[i]['on' + type] = null;
                }
            }
            return this;

        },
        /**
         * 实现单个元素的事件绑定
         * @param fn
         * @return {click}
         */
        click: function (fn) {
            this.on('click', fn);
            return this;

        },
        /**
         * 实现鼠标移动进来和出去的事件响应（鼠标悬浮事件）
         * @param fnOver
         * @param fnOut
         * @return {hover}
         */
        hover: function (fnOver, fnOut) {
            var i = this.length;
            // 还是采用的是从后向前遍历的方式
            for (; i >= 0; i--) {
                if (fnOver && typeof fnOver === 'function') {
                    this.on('mouseover', fnOver);
                }
                if (fnOut && typeof  fnOut === 'function') {
                    this.on('mouseout', fnOut);
                }
            }
            return this;
        },
        /**
         * 如果被选元素可见，则隐藏这些元素，如果被选元素隐藏，则显示这些元素。
         * toggle方法,切换,接收任意个参数,不断在参数间循环.例:点击显示隐藏
         * @return {toggle}
         */
        toggle: function () {
            // 实现一个事件的切换f1, f2
            var self = this,
                _arguments = arguments,
                i = 0,
                len = this.length;
            // 把所有的事件响应函数存起来
            for (; i < len; i++) {
                addToToggle(this[i]);
            }
            /**
             * 鼠标点击之后逐个调用自己绑定的事件
             * @param obj
             */
            function addToToggle(obj) {
                // 定义一个私有的计数器
                var count = 0;
                // 添加事件
                self.on('click', function () {
                    // 使用call去修改this的指向(这里的主要作用是去切换，轮巡切换状态)
                    _arguments[count++ % _arguments.length].call(obj);
                });
            }

            return this;
        }
    });

    // 不需要参与链式访问的
    xframe.extend(xframe, {
        /**
         * 获取事件对象
         * @param event
         * @return {Event}
         */
        getEvent: function (event) {
            return event ? event : window.event;
        },
        /**
         * 获取触发事件的元素
         * @param event
         * @return {*|Element|Object}
         */
        getTarget: function (event) {
            var event = this.getEvent(event);
            return event.target || event.srcElement;
        },
        /**
         * 阻止事件冒泡
         * @param event
         */
        stopPropagation: function (event) {
            var event = this.getEvent(event);
            if (event.stopPropagation) {
                // W3c
                event.stopPropagation();
            } else {
                // IE
                event.cancelBubble = true;
            }
        },
        /**
         * 阻止默认的行为
         * @param event
         */
        preventDefault: function (event) {
            var event = this.getEvent(event);
            if (event.preventDefault) {
                // w3c
                event.preventDefault();
            } else {
                // IE
                event.returnValue = false;
            }
        },
        /**
         * 获取鼠标滚轮的运动的详细信息
         * @param event
         * @return {*}
         */
        getDelta: function (event) {
            var event = this.getEvent(event);
            if (event.wheelDelta) {
                // w3c
                return event.wheelDelta;
            } else {
                // ie
                // Firefox的值有所不同，因此首先要将这个值的符号反向，然后再乘以40，就可以保证与其它浏览器的值相同了
                return -event.detail * 40;
            }
        }
    });
})(xframe);


// CSS 样式框架
;(function (xframe) {
    // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)【只要是需要使用到this获取到的元素集合这个变量的时候，这里就是需要进行链式访问的】
    xframe.extend({
        /**
         * 给DOM元素设置/取值CSS样式
         * @return {*}
         */
        css: function () {
            // 分为两种情况，一种是取值模式，一种是设置模式
            var arg = arguments,
                len = arg.length,
                j = this.length - 1;
            if (len === 0) {
                // 没有参数的话，就直接返回这个DOM集合
                return this;
            } else if (len === 1) {
                // 取值模式
                if (typeof arg[0] === 'string') {
                    if (this[0].currentStyle) {
                        // w3c
                        return this[0].currentStyle[arg[0]];
                    } else {
                        // 其他IE
                        return getComputedStyle(this[0], false)[arg[0]];
                    }
                } else if (typeof arg[0] === 'object') {
                    // 如果要获取一系列对象的属性信息, 如果传过来的一个参数是一个json对象的话，这里也采用这种方式
                    // {name : xiugang, age : 18}
                    for (var item in arg[0]) {
                        // 从后向前开始遍历，设置模式
                        for (; j >= 0; j--) {
                            // 由于CSS在设置值的时候的取值模式和设置模式的不同，这里需要先使用驼峰表示法进行处理一下
                            // 先把item转换为：backgroundcolor --> backgroundColor
                            item = $.camelCase(item)
                            this[j].style[item] = arg[0][item];
                        }
                    }
                }
            } else if (len === 2) {
                // 设置模式
                for (; j >= 0; j--) {
                    // 第一个参数是我们需要设置的值
                    this[j].style[$.camelCase(arg[0])] = arg[1];
                }
            }
            return this;
        },
        /**
         * 隐藏一个元素
         * @return {hide}
         */
        hide: function () {
            var j = this.length - 1;
            for (; j >= 0; j--) {
                this[j].style.display = 'none';
            }
            return this;


            // 方法二：使用之前封装好的框架进行遍历
            this.each(function () {
                this.style.display = 'none';
            })
        },
        /**
         * 显示元素
         * @return {show}
         */
        show: function () {
            this.each(function () {
                this.style.display = 'block';
            })
            return this;
        },
        /**
         * 获取元素的宽度
         * @return {*}
         */
        width: function () {
            return this[0].clientWidth;
        },
        /**
         * 获取元素的高度
         * @return {*}
         */
        height: function () {
            return this[0].clientHeight;
        },
        /**
         * //当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
         * 获取元素的滚动宽度
         * @return {*}
         */
        scrollWidth: function () {
            return this[0].scrollWidth;
        },
        /**
         * 获取元素的滚动高度
         * @return {*}
         */
        scrollHeight: function () {
            return this[0].scrollHeight;
        },
        /**
         * 元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
         * @return {*}
         */
        scrollTop: function () {
            return this[0].scrollTop;
        },
        /**
         * 元素滚动的时候相对于左上角的距离
         * @return {*}
         */
        scrollLeft: function () {
            return this[0].scrollLeft;

        },
    });

    // 不需要参与链式访问的
    xframe.extend(xframe, {
        getThis: function () {
            console.log(xframe, typeof this);  // function, 这里的this指向的实际上是一个函数function (selector, context)
        },

        /**
         * 获取屏幕的高度
         * @return {number}
         */
        screenHeight: function () {
            return window.screen.height;
        },
        /**
         * 虎丘屏幕的款U盾
         * @return {number}
         */
        screenWidth: function () {
            return window.screen.width;
        },
        /**
         * 获取浏览器窗口文档显示区域的宽度，不包括滚动条
         * @return {number}
         */
        wWidth: function () {
            return document.documentElement.clientWidth;
        },
        /**
         * 获取浏览器窗口文档显示区域的高度，不包括滚动条
         * @return {number}
         */
        wHeight: function () {
            return document.documentElement.clientHeight;
        },

        /**
         * 文档滚动区域的整体的高
         * @return {number}
         */
        wScrollHeight: function () {
            return document.body.scrollHeight;
        },
        /**
         * 文档滚动区域的整体的宽度
         * @return {number}
         */
        wScrollWidth: function () {
            return document.body.scrollWidth;
        },
        /**
         *  获取滚动条相对于其顶部的偏移
         *  @return {number}
         */
        wScrollTop: function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            return scrollTop;
        },
        /**
         * 获取整个文档窗口的距离整个窗口的宽度和高度（滚动条相对于顶部和左边的距离）
         * @return {number}
         */
        wScrollLeft: function () {
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
            return scrollLeft;
        }
    });
})(xframe);


// 选择框架
;(function (xframe) {
    // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
    xframe.extend({});


    // 不需要参与链式访问的
    xframe.extend(xframe, {
        /**
         * ID选择器
         * @param context
         * @return {HTMLElement | *}
         */
        $id: function (context) {
            // context是一个DOM对象还是字符串
            context = this.isString(context) ? document.getElementById(context) : context;
            return context;
        },
        /**
         * tag选择器， context；里面存储了上下文信息（尽量少的使用局部变量）
         * @param tag
         * @param context
         * @return {NodeListOf<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>}
         */
        $tag: function (tag, context) {
            // 分为两种情况
            if (typeof context === 'string') {
                context = this.$id(context);
            }

            // 按照这种思路，只有可能是一种情况
            if (context) {
                if (context.length) {
                    // 这里默认只会返回数组中的第0个元素
                    return [].slice.call(context)[0].getElementsByTagName(tag);
                } else {
                    return context.getElementsByTagName(tag);
                }
            }
            return document.getElementsByTagName(tag);
        },
        /**
         * 实现一个类选择器
         * @param className
         * @param context
         * @return {*}
         */
        $class: function (className, context) {
            // context里面此时存储的是一个DOM节点元素
            // 如果直接传过来的是一个DOM元素节点context(DOM元素的话就单独处理)
            context = this.$id(context) || document;

            // 1.由于getElementByClassName()这个方法是不兼容的，因此需要使用浏览器内置的方法去获取类选择器
            // 2. 可以使用getElementByTagName（）的方法去获取所有的标签元素，然后把再使用className的属性间接去实现一个类似的class选择器的功能
            if (context.getElementsByClassName) {
                // 如果支持这个方法的话
                return context.getElementsByClassName(className);
            } else {
                // 不支持的话就间接获取
                var doms = context.getElementsByTagName('*'),
                    res = [];
                // 使用自己定义的方法去实现一个类选择器
                doms.each(function () {
                    if (this.className === className) {
                        // 只要是找到了这个class的集合，就放入到一个数组里面
                        res.push(this);
                    }
                });
                return res;

            }
        },
        /**
         * 使用管道思想实现一个层次选择器
         * @return {Array}
         */
        $cengci: function () {
            var self = this;
            // 主要功能：实现一个层次选择器
            // 输入字符串： str = '#className div  a p'  选择所有的className 下面的P标签
            // 1. 获取穿过来的参数(数组元素去重)
            var args = Array.prototype.slice.call(arguments)[0].toString().split(' '),
                index,
                first,
                item,
                selector,
                res = [],           // 存储了本次的结果信息
                context = [];            // 存储了上一次的上下文信息【管道思想!】, context = 'tag .class #id'


            // 思考： 为了实现一个层次选择器， 如何实现一个吧上一次选择的元素全部存储起来??？


            // 2. 开始解析参数信息
            args.each(function () {
                // 每次重复之前，先把本次需要存储的数组清空(res里面存储了每次的最新数据)
                res = [];

                // 对获取到的每一项进行处理
                item = this.trim();
                first = item.charAt(0);
                index = item.indexOf(first);
                selector = item.slice(index + 1);


                // 使用管道思想实现一个层次选择器！！！
                switch (first) {
                    case '.':  // class 选择器
                        if (context.length) {
                            // 说明这一次的class类选择器中的元素不是第一次出现
                            context.each(function () {
                                pushArray(self.$class(selector, this));
                            });
                        } else {
                            // 如果是第一次出现的话
                            pushArray(self.$class(selector));
                        }
                        // 把上一次执行的结果存起来
                        context = res;
                        break;
                    case '#':  // ID选择器
                        // 由于ID选择器获取的元素始终是唯一的，因此直接放进去即可
                        res.push(self.$id(selector));
                        // 把上一次执行的结果存起来
                        context = res;
                        break;
                    default:    // tag选择器
                        if (context.length) {
                            // 说明不是第一次出现
                            context.each(function () {
                                // 注意在使用tag选择器的时候，第二个参数必须是一个ID选择器，或者是一个
                                // 1. 注意在放入数组的时候，需要逐个遍历然后放进去
                                pushArray(self.$tag(item, this));
                            });
                        } else {
                            // 第一次出现的
                            pushArray(self.$tag(item));
                        }
                        // 把上一次执行的结果存起来
                        context = res;
                        break;
                }
            });


            /**
             * 把公共的部分代码封装起来
             * @param doms
             */
            function pushArray(doms) {
                if (doms) {
                    [].slice.call(doms).each(function () {
                        res.push(this);
                    });
                }
            }

            return context;
        },
        /**
         * group选择器
         * @return {Array}
         */
        $group: function () {
            var self = this;
            // '.moshou,#moshou,span,.dream'
            // 1. 获取传过来的参数
            var args = [].slice.call(arguments),
                arr = args[0].split(',').unique(),      // 这里在拿到这个分割后的字符串后，开始进行数组元素去重
                item,
                index,
                first,
                selector;
            res = [];

            // 2. 开始遍历参数集合，解析参数信息
            arr.each(function () {
                // 3. 开始遍历得到结果,获取每一项
                item = this.trim();
                // 4. 开始获取首字母信息，和后面的选择器信息
                // 4. 获取指定下标位置对应的字符
                first = item.charAt(0);
                index = item.indexOf(first);
                selector = item.slice(index + 1);


                // 开始根据第一个字母向下进行判断，把满足相应条件的放在数组里面
                switch (first) {
                    case '.':
                        // class选择器
                        res.push(self.$class(selector));
                        break;
                    case '#':
                        // ID 选择器
                        res.push(self.$id(selector));
                        break;
                    default:
                        // TAG选择器(直接就是first本身，这里不用再判断了使用selector这个变量了)
                        res.push(self.$tag(item));
                        break;
                }
            });

            return res;
        },
        /**
         * 多组+层次选择器
         * @return {Array}
         */
        $select: function () {
            // str = '#tag , .calss'
            var args = [].slice.call(arguments)[0].toString().split(','),
                ret = [],
                self = this;

            // 遍历args数组，对数组的每一项采用层次选择器
            args.each(function () {
                // 1. 对于逗号分隔的部分采用层次选择,获取层次选择器的结果信息， 是一个数组集合
                var res = self.$cengci(this);
                // 2. 遍历层次选择器的集合，把信息放入到一个新的数组里面， 就是得到的多组选择器的结果信息
                pushArray(res);
            });


            // 层次选择器
            function pushArray(doms) {
                if (doms.length) {
                    doms.each(function () {
                        ret.push(this);
                    });
                }
            }

            return ret;
        }
    });
})(xframe);


// 属性框架
;(function (xframe) {
    // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
    xframe.extend({
        /**
         * 获取/设置某一个元素的属性信息
         * @return {*}
         */
        attr: function () {
            // 获取属性信息：两种格式，1. 取值模式 2.设置模式
            var args = arguments;
            if (args.length === 0) {
                // 没有参数的话，就直接返回本身
                return this;
            } else if (args.length === 1) {
                // 一个参数的话需要进行判断
                if (typeof args[0] === 'string') {
                    // 取值模式
                    return this[0].getAttribute(args[0]);
                } else if (typeof args[0] === 'object') {
                    // json对象的话也算是一个设置模式
                    for (var item in args[0]) {
                        Array.prototype.slice.call(this).each(function () {
                            this.setAttribute(item, args[0][item]);
                        });
                    }
                }
            } else if (args.length === 2) {
                Array.prototype.slice.call(this).each(function () {
                    this.setAttribute(args[0], args[1]);
                });
            }

            // 注意这里的this实际上返回的是一个xframe实例对象，但是xframe.eatend(xframe, {})这里的this实际上是一个xframe(selector, context)函数， 还没有实例化呢
            return this;
        },
        /**
         * 判断DOM元素节点是不是拥有某一个属性
         * @param val
         * @return {boolean}
         */
        hasClass: function (val) {
            if (!this[0]) {
                return false;
            }
            // 默认只会获取第一个元素的相关信息
            return this[0].className.trim() === val.trim() ? true : false;
        },
        /**
         * 添加一个class class='xiugang 18 nan'
         * @param val
         */
        addClass: function (val) {
            // 处理传进来的字符串两边的空格
            val = val.trim();
            [].slice.call(this).each(function () {
                // 只要原来的DOM节点上面没有这个属性的话，就直接添加上去
                this.className = this.className.trim();
                if (val !== this.className) {
                    this.className += ' ' + val;
                }
            })
            return this;
        },
        /**
         * 注意熟练掌握replace（）函数的使用
         * @param val
         */
        removeClass: function (val) {
            val = val.trim();
            [].slice.call(this).each(function () {
                if (val === this.className.trim()) {
                    // 使用后面替换前面的
                    this.className = this.className.replace(val, '');
                }
            })
            return this;
        },
        /**
         * 如果有的话就直接删除，没有的话就添加一个
         * @param val
         * @return {toggleClass}
         */
        toggleClass: function (val) {
            val = val.trim();
            [].slice.call(this).each(function () {
                this.className = this.className.trim();
                if (val === this.className) {
                    // 如果有的话就直接删除
                    this.className = this.className.replace(val, '');
                } else {
                    // 没有的话就添加一个
                    this.className += ' ' + val;
                }
            });
            return this;
        }
    });

    // 不需要参与链式访问的
    xframe.extend(xframe, {});
})(xframe);


// 内容框架
;(function (xframe) {
    // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
    xframe.extend({
        /**
         * .html()用为读取和修改元素的HTML标签    对应js中的innerHTML
         * @return {html}
         */
        html: function () {
            var arg = arguments,
                len = arg.length,
                arr = Array.prototype.slice.call(this);
            if (this.length < 1) {
                return this;
            }

            // 分为取值模式和设置模式
            if (len === 0) {
                // 取值模式
                return this[0].innerHTML;
            } else if (len === 1) {
                // 设置模式
                arr.each(function () {
                    this.innerHTML = arg[0];
                });
            }

            return this;

        },
        /**
         * 用于获取文本信息
         * @return {*}
         */
        text: function () {
            var args = arguments,
                len = args.length;

            if (this.length === 0) {
                return this;
            }

            if (len === 0) {
                // 取值模式
                return this[0].innerText;
            } else if (len === 1) {
                // 设置模式
                this.each(function () {
                    this.innerText = args[0];
                });

            }
            return this;
        },
        /**
         * 用于获取表单中的数值(input, form)
         * @return {*}
         */
        val: function () {
            // val();设置或者获取表单字段的值（前提是表单设置了value属性）；
            var args = arguments,
                len = args.length;

            if (this.length === 0) {
                return this;
            }

            if (len === 0) {
                return this[0].value;
            } else if (len === 1) {
                this.each(function () {
                    this.value = args[0];
                });
            }

            return this;
        }
    });

    // 不需要参与链式访问的
    xframe.extend(xframe, {});
})(xframe);


// DOM框架（选择器框架）
;(function (xframe) {
    // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
    xframe.extend({
        /**
         * 向现有的元素集合中添加元素节点（修改this的内容）
         * @param dom
         * @return {add}
         */
        add: function (dom) {
            // 1. 项伪数组中添加元素
            this[this.length] = dom;
            // 2. 数组的长度也需要改变了
            this.length++;
            return this;
        },
        /**
         * 向现有的元素节点中添加dom节点(对使用选择器获取的一系列元素都添加孩子节点child)
         * @param child，这里创建的实际上是一个JQuery对象
         */
        append: function (child) {
            // 这里获取的实际上就是只有一个的
            var doms = typeof child === 'string' ? $(child) : $(child[0]),
                arr = Array.prototype.slice.call(doms);
            //console.log(typeof doms[0], typeof arr[0]);
            // 2. 调用自己的方法将一个伪数组转换为数组，并开始遍历
            /*for (var i = 0; i < this.length; i++){
                for (var j = 0; j < doms.length; j++){
                    // 注意这里的操作， 由于在每次添加一个新的元素之后， this的长度就会增加，因此这里在修改之前先把this.length修改一下
                    this[i].appendChild(doms[j]);
                }
            }*/
            /*this.each(function (element) {
                arr.forEach(function (childNode) {
                    element.appendChild(childNode);
                });
            });*/


            // 这里的处理目的是，如果穿过来的DOM节点只是有一个的话需要创建和this长度相同的DOM元素
            if (arr.length !== this.length) {
                arr = [];
                // 相当于是把本身复制几份
                Array.prototype.slice.call(this).each(function () {
                    arr.push(doms[0]);
                });

            }

            // 开始向父亲节点添加元素
            Array.prototype.slice.call(this).forEach(function (element, index) {
                element.appendChild(arr[index]);
            });

            // 开始向我获取的this节点里面添加数据
            /*for (var i = 0; i < this.length; i++){
                for (var j = 0; j < arr.length; j++){
                    if (this[i].childNodes){
                        continue;
                    }
                    // 注意这里的操作， 由于在每次添加一个新的元素之后， this的长度就会增加，因此这里在修改之前先把this.length修改一下
                    this[i].appendChild(arr[j]);
                }
            }*/

        },
        /**
         * 把选择器中的节点添加到父容器中
         * @param parent
         */
        appendTo: function (parent) {
            // 1. 获取所有的父容器
            var doms = $(parent),
                self = this;
            // 2. 向父容器中添加孩子节点
            Array.prototype.slice.call(this).forEach(function (element, index) {
                doms[index].appendChild(self[index]);
            });

            return this;
        },
        /**
         * 获取指定下表下面的DOM节点
         * @param num
         * @return {null}
         */
        get: function (num) {
            return this[num] ? this[num] : null;
        },
        /**
         * 获取一个类似于JQuery的对象实例
         * @param num
         * @return {jQuery|HTMLElement}
         */
        eq: function (num) {
            // 1. 获取一个JQuery对象，首先先获取这个DOM元素节点
            var dom = this.get(num);
            // 2. 把这个DOM节点转换为一个JQuery对象
            return $(dom);
        },
        /**
         * 获取第一个JQuery对象
         * @return {*|jQuery|HTMLElement}
         */
        first: function () {
            return this.eq(0);
        },
        /**
         * 获取最后一个JQuery对象
         * @return {*|jQuery|HTMLElement}
         */
        last: function () {
            return this.eq(this.length - 1);
        },
        /**
         * 获取一个DOM节点的所有子节点
         * @return {array}
         */
        children: function () {
            // 获取一个元素的所有的孩子节点
            // 1. 定义一个伪数组， 用于存储所有的孩子节点, 然后获取默认的第一个元素的所有孩子节点
            var children = this[0].children,
                len = children.length,
                that = {},
                i = 0;

            // 初始化定义的这个伪数组
            that.length = len;
            for (; i < len; i++) {
                that[i] = children[i];
            }

            return that;
        },
        /**
         * 从当前DOM元素节点向下寻找一层元素节点
         * @param str
         * @return {}
         */
        find: function (str) {
            var res = [],
                self = this,
                doms;
            this.each(function () {
                switch (str.charAt(0)) {
                    case '.':
                        // 类选择器
                        doms = $.$class(str.substring(1), self[i]);
                        pushArray(doms);
                        break;
                    default:
                        // 标点选择器
                        doms = $.$tag(str, self[i]);
                        pushArray(doms);
                        break;
                }
            });

            function pushArray(doms) {
                if (doms.length) {
                    self.toArray(doms, function () {
                        res.push(this);
                    });
                }
            }

            // 【注意：】为了能够返回一个JQuery对象，这里需要再次进行处理
            var that = this;
            that.length = this.length;
            this.each(function (index) {
                // 这里需要再次构造一个伪数组对象，从而实现链式访问的功能
                that[index] = res[index];
            });

            // 这里在修改that的时候实际上会间接地把this这个变量修改了
            return that;
        },
        /**
         * 获取一个元素的父类节点
         * @return {parent}
         */
        parent: function () {
            // 获取父节点，并且返回一个JQuery对象
            var parent = this[0].parentNode;
            this[0] = parent;
            this.length = 1;

            // 由于每一个元素只会有一个父类节点，因此长度为1
            return this;

        },
        /**
         * 获取一个元素在同一个级别的元素里面的下表编号
         * @return {number}
         */
        index: function () {
            // 获取元素本身在同一个级别下面的元素下表编号
            var srcNode = this[0],
                children = srcNode.parentNode.children,
                self = this,
                defaultRes = -1;

            self.toArray(children, function (index) {
                // 这里的this指向的就是每一个元素， index指向的就是元素的下表编号
                if (children[index] === srcNode) {
                    defaultRes = index;
                }
            });
            // 返回查询到的结果下标
            return defaultRes;
        },


    });

    // 不需要参与链式访问的
    xframe.extend(xframe, {
        /**
         * 创建一个DOM元素节点
         * @param type
         * @param value
         * @param html
         * @return {*}
         */
        create: function (type, value, html) {
            var dom = document.createElement(type);
            return xframe().add(dom).attr(value).html(html);
        },
        /**
         * 直接的孩子节点
         * @param dom
         * @param tag
         * @return {jQuery|HTMLElement}
         */
        directChildren: function (dom, tag) {
            var res = [],
                tag = tag;
            if (typeof dom === 'string') {
                dom = $(dom);
            }

            // 如果是一个元素集合的处理方法
            if (dom.length) {
                Array.prototype.slice.call(dom).each(function () {
                    getDOM(this.children);
                });
            } else {
                // 如果只是一个元素的处理方法
                getDOM(dom.children);
            }

            /**
             * 主要用于把满足已知条件的DOM元素集合统一放入到一个新的res数组里面去
             * @param doms
             */
            function getDOM(doms) {
                Array.prototype.slice.call(doms).each(function () {
                    if (this.tagName.toLowerCase() === tag.toLowerCase()) {
                        res.push(this);
                    }
                });
            }

            // 如果获得了这个直接子节点，就直接返回这个对象
            return $(res);
        },
    });
})(xframe);


// 动画框架
;(function (xframe) {
    // 需要参与链式访问的(必须使用prototype的方式来给对象扩充方法)
    xframe.extend({});

    // 不需要参与链式访问的
    xframe.extend(xframe, {});


    // 实现动画框架的封装
    xframe.Animate = (function (xframe) {

        // 1. 定义需要的API接口(API内部用于放置属性)
        var api = {
            timer: null,// 这是一个动画循环句柄
            queen: []  // 多个对象同时运行的一个数组队列
        };


        // 运行部门-------------------------------------------------
        /**
         * 在把需要的运行参数都准备好了之后（多个对象），就开始执行这个运行函数
         */
        api.run = function () {
            // 定义一个定时器，用于不断地执行我自己定义的动画函数信息
            api.timer = setInterval(function () {
                // 由于所有的参数都已经准备好了，因此这里只需要直接进行循环操作即可
                api.loop();
            }, 16);     // 这里循环的周期设置的是16mm
        }
        /**
         * 执行动画循环操作
         */
        api.loop = function () {
            // obj里面存储了obj = {id, now, pass, tween, duration, style}
            api.queen.forEach(function (obj) {
                // 遍历队列中的每一项参数，开始执行移动操作
                api.move(obj);
            });
        }
        /**
         * 实现物体的移动
         */
        api.move = function (obj) {
            // 1. 计算当前的时间
            obj.pass = +new Date();
            // 2. 获取动画时间进程(这里的动画样式默认是一个弹簧的显示样式)
            var tween = api.getTween(obj.now, obj.pass, obj.duration, 'easeOutBounce');
            // 注意我们再每一次移动这个物体对象之前需要把这个物体对象的动画时间进程更新一下，这样到了后面的修改对象的属性的时候这个参数的数值才会动态改变
            obj.tween = tween;

            //console.log(tween);

            // 3. 设置属性信息
            if (tween >= 1) {
                // 如果动画时间进程结束了（百分比信息）
                api.stop();
            } else {
                // 4. 通过设置对象的属性信息来移动每一个对象
                api.setManyProperty(obj);
            }
        }

        // 添加部门-------------------------------------------------
        /**
         * @param 获取用户输入的参数，开始对参数进行解析，开始添加参数，然后实现动画的开始运行
         */
        api.add = function () {
            var args = arguments,
                id = args[0],
                json = args[1],
                duration = args[2];

            // 获取输入的参数，然后开始使用适配器解析数据
            try {
                // 1. 调用适配器准备参数
                api.adapterMany(id, json, duration);

                // 2. 开始运行动画
                api.run();
            } catch (e) {
                console.error(e.message);
            }
        }
        /**
         * 这是一个适配器，用于解析一个对象的参数信息(只能处理一个对象)
         * @param id
         * @param json
         * @param duration
         */
        api.adapterOne = function (id, json, duration) {
            var obj = {}                    // 这里的OBj就是一个字面量格式， 用于存储需要的参数信息
            obj.id = id                     // ID编号
            obj.now = +new Date()           // 开始时间
            obj.pass = 0                    // 当前时间
            obj.tween = 0                   // 动画时间进程
            obj.duration = duration         // 动画的持续时间
            obj.styles = []                 // 用于存放所有的样式信息

            // 根据用户输入的参数信息选择不同的动画速度
            if ($.isString(duration)) {
                switch (duration) {
                    case 'slow':
                    case '慢':
                        duration = 8000;
                        break;
                    case 'normal':
                    case '普通':
                        duration = 4000;
                        break;
                    case 'fast':
                    case '快':
                        duration = 1000;
                        break;
                }
            }

            // 设置样式信息
            obj.styles = api.getStyles(id, json);
            return obj;
        }
        /**
         * 这个适配器针对的是处理多个对象的动画信息
         * @param id
         * @param json
         * @param data
         */
        api.adapterMany = function (id, json, data) {
            // 处理多个对象的参数信息(同样的参数，但是需要处理不同的信息，针对的是多个对象的参数)
            var obj = this.adapterOne(id, json, data);
            // 开始向我已有的队列中添加数据信息（此时queen队列里面就是存放了我所有的数据信息）
            api.queen.push(obj);
        }
        /**
         * 获取样式信息
         * @param id
         * @param json
         */
        api.getStyles = function (id, json) {
            // animate('#sun', {left: 200, top : 500}, 7000);
            // 把用户传递过来的参数信息转换我需要的格式
            var styles = [];
            // 开始解析json数据信息
            for (var item in json) {
                var style = {};
                // 这里的item就是下面的：left, top
                style.name = item;
                // 获取物体开始的位置
                style.start = parseFloat($(id).css(item).toString());
                // 计算物体的偏移量（移动的距离）
                style.length = parseFloat(json[item]) - style.start;

                styles.push(style);
            }
            return styles;
        }
        /**
         * 用于获取一个动画时间进程
         * @param now 开始时间
         * @param pass 当前时间
         * @param all 持续时间
         * @param ease 动画效果
         */
        api.getTween = function (now, pass, all, ease) {
            // 1.定义常见的动画效果
            var eases = {
                //线性匀速
                linear: function (t, b, c, d) {
                    return (c - b) * (t / d);
                },
                //弹性运动
                easeOutBounce: function (t, b, c, d) {
                    if ((t /= d) < (1 / 2.75)) {
                        return c * (7.5625 * t * t) + b;
                    } else if (t < (2 / 2.75)) {
                        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                    } else if (t < (2.5 / 2.75)) {
                        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                    } else {
                        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                    }
                },
                //其他
                swing: function (t, b, c, d) {
                    return this.easeOutQuad(t, b, c, d);
                },
                easeInQuad: function (t, b, c, d) {
                    return c * (t /= d) * t + b;
                },
                easeOutQuad: function (t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                },
                easeInOutQuad: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                    return -c / 2 * ((--t) * (t - 2) - 1) + b;
                },
                easeInCubic: function (t, b, c, d) {
                    return c * (t /= d) * t * t + b;
                },
                easeOutCubic: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t + 1) + b;
                },
                easeInOutCubic: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t + 2) + b;
                },
                easeInQuart: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t + b;
                },
                easeOutQuart: function (t, b, c, d) {
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                },
                easeInOutQuart: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                },
                easeInQuint: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t * t + b;
                },
                easeOutQuint: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                },
                easeInOutQuint: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                },
                easeInSine: function (t, b, c, d) {
                    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                },
                easeOutSine: function (t, b, c, d) {
                    return c * Math.sin(t / d * (Math.PI / 2)) + b;
                },
                easeInOutSine: function (t, b, c, d) {
                    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                },
                easeInExpo: function (t, b, c, d) {
                    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                },
                easeOutExpo: function (t, b, c, d) {
                    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                },
                easeInOutExpo: function (t, b, c, d) {
                    if (t == 0) return b;
                    if (t == d) return b + c;
                    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },
                easeInCirc: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                },
                easeOutCirc: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                },
                easeInOutCirc: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                },
                easeInElastic: function (t, b, c, d) {
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    if (a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                },
                easeOutElastic: function (t, b, c, d) {
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    if (a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
                },
                easeInOutElastic: function (t, b, c, d) {
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d / 2) == 2) return b + c;
                    if (!p) p = d * (.3 * 1.5);
                    if (a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
                },
                easeInBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * (t /= d) * t * ((s + 1) * t - s) + b;
                },
                easeOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                },
                easeInOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                },
                easeInBounce: function (t, b, c, d) {
                    return c - this.easeOutBounce(d - t, 0, c, d) + b;
                },
                easeInOutBounce: function (t, b, c, d) {
                    if (t < d / 2) return this.easeInBounce(t * 2, 0, c, d) * .5 + b;
                    return this.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                }
            };
            // 2. 计算每一次动画循环的小号时长
            var yongshi = pass - now;

            // 3. 获取相应的动画效果
            return eases[ease](yongshi, 0, 1, all);
        }

        /**
         * 通过设置一个对象的属性信息来实现物体的运动效果（如果只有一个属性信息的话）
         * @param obj
         */
        api.setOneProperty = function (obj) {
            // 用于设置一个对象的属性信息(obj.id, obj.json)
            // 【注意点】：这里是动画实现的一个核心要点，通过修改对象的属性信息来移动物体
            if (obj.name === 'opacity') {
                $(obj.id).css(obj.name, (obj.start + obj.length * obj.tween));
            } else {
                // 对于设置对象的其他属性信息都是需要添加一个px，像素值信息
                $(obj.id).css(obj.name, (obj.start + obj.length * obj.tween) + 'px');
            }
        }
        /**
         * 用于设置一个对象的锁哥属性信息 obj.json = {width : '200px', height : '500px', 'opacity' : '0.1'}
         */
        api.setManyProperty = function (obj) {
            // 由于obj.styles里面是一个数组
            obj.styles.forEach(function (style) {
                // 遍历当前对象的所有样式属性信息
                obj.name = style.name;
                obj.start = style.start;
                obj.length = style.length;
                api.setOneProperty(obj);
                console.log(obj.tween);
            });

            // 由于styles里面只存储了style.name, style.start, style.length三个属性信息， 因此需要处理一下

        }
        /**
         * 结束动画的执行
         */
        api.stop = function () {
            clearInterval(api.timer);
        }

        // 后勤部门----------------------------------------------------
        api.destory = function () {

        }


        // 用户只需要把需要的参数添加进来们就可以执行一个动画
        // 用户只需要传进来三个参数，id, json, duration就可以实现一个动画
        xframe.animate = api.add;

    })(xframe);
})(xframe);


// 缓存框架
;(function (xframe) {

    /**
     * 实现了缓存框架的临时存储功能（内存存储）
     * @type {{data: Array, get: (function(*): *), add: xframe.cache.add, delete: (function(*): boolean), update: (function(*, *): boolean), isExist: (function(*): boolean)}}
     */
    xframe.cache = {
        data: [],          // 用于存储本地的数据信息
        /**
         * 用于获取本地存储的json数据信息
         * @param key
         * @return {*}
         */
        get: function (key) {
            var value = null;
            this.data.each(function () {
                if (key.trim() === this.key.trim()) {
                    value = this.value;
                }
            });
            return value;
        },
        /**
         * 向本地存储添加数据信息
         * @param key
         * @param value
         */
        add: function (key, value) {
            this.data.push({
                key: key.trim(),
                value: value.trim()
            });
        },
        /**
         * 删除指定的key的数据信息
         * @param key
         * @return {boolean}
         */
        delete: function (key) {
            // 删除指定的key对应的数据信息
            var status = false,     // 定义一个状态码，用于标记删除是否成功的状态信息
                self = this;
            this.data.forEach(function (element, index) {
                // 遍历本地的数据存储信息，进行比对数据信息
                if (key.trim() === element.key.trim()) {
                    // 指定开始的位置，开始删除数组中的数据信息
                    self.data.splice(index, 1);
                    status = true;
                }
            });
            return status;
        },
        /**
         * 修改指定的元素的数据信息
         * @param key
         * @param value
         */
        update: function (key, value) {
            var status = false;
            this.data.forEach(function (element) {
                if (key.trim() === element.key) {
                    // key不变，只修改数值信息, 注意element是一个json对象，这个对象里面包含了两个属性element.key和element.value这两个
                    element.value = value.trim();
                    status = true;
                }
            });
            return status;
        },
        /**
         * 检测一个指定的数据是否存在
         * @param key
         * @return {boolean}
         */
        isExist: function (key) {
            // 用于检测某一个数据信息是否存在
            this.data.forEach(function () {
                if (key.trim() === this.key) {
                    return true;
                }
            });
            return false;
        }
    }


    /**
     * 实现了一个Cookie框架的封装（注意在把HTML转换为实体存储的时候这里默认是去掉了最末尾的分号）
     * @type {{getCookie: xframe.cookie.getCookie, setCookie: xframe.cookie.setCookie, deleteCookie: xframe.cookie.deleteCookie, clearAllCookies: xframe.cookie.clearAllCookies}}
     */
    xframe.cookie = {
        /**
         * 根据cookie的名字获取Cookie的详细信息
         * @param name
         * @return {*}
         */
        getCookie: function (name) {
            // 去除转义字符
            var name = name.escapeHTML(),
                // 读取文档中的所有cookie属性
                allCookies = document.cookie;

            // 下面是一些Cookie的数据格式信息（默认返回的是一个字符串）
            // H_PS_645EC=af88R0s3e76Ig1PlwkvrhnGGtg4qt5pcZNPKBUntPI2vGearAlyZyjXjmKYn%2BkggUXbNjhg;
            // 1. 查找名称为name的cookie信息script3&amp5;
            //name = name.substring(0, name.length-1);            //  当前步骤是为了去除掉末尾的分号(转换为标准形式);
            name += '=';
            // 等号右边的就是获取的数值，左边就是cookie的名称信息
            // 2. 获取'name='这个字符串在整个Cookie信息字符串中出现的位置下标
            var pos = allCookies.indexOf(name);
            // 3. 判断是否存在这个cookie的信息
            if (pos !== -1) {
                // 如果存在的话，就继续处理
                // 3. 计算'cookie='等号后面的位置
                var start = pos + name.length;
                // 3. 从'cookie='的位置开始向后搜索， 一直到;的位置结束, 从start的位置向后搜索信息
                var end = allCookies.indexOf(';', start);
                if (end === -1) {
                    // 如果为-1的话， 说明cookie信息列表里面只有一个Cookie信息
                    end = allCookies.length;
                }
                // 4. 提取Cookie的数值信息
                var value = allCookies.substring(start, end);
                // 5.处理之后反转义后返回(反转义的目的是将内容进行加密处理，防止攻击)【测试状态OK，由于之前的内部存储，必须先删除所有的，在执行就ok了】
                return value.unescapeHTML();
            } else {
                // 没有找到， 说明不存在这个cookie信息
                return '';
            }

            // 默认情况下返回一个空的字符串
            return '';
        },
        /**
         * 根据传入的参数信息设置浏览器的cookie
         * @param name
         * @param value
         * @param days
         * @param path
         */
        setCookie: function (name, value, days, path) {
            var name = name.escapeHTML(),
                value = value.escapeHTML(),
                expires = new Date(),
                _expires,
                res;

            //name = name.substring(0, name.length-1);            //  当前步骤是为了去除掉末尾的分号(转换为标准形式);

            // 设置cookie的过期时间(单位是毫秒)
            expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            if (path === '') {
                path = '';
            } else {
                path = (';path=' + path);
            }

            if (typeof expires === 'string') {
                _expires = '';
            } else {
                // 使用UTC标准时间
                _expires = (';expires=' + expires.toUTCString());
            }

            // 设置cookie信息，【注意要点：】(设置COokie的时候，只要遇到分号就会立即结束，只会保存分号之前的内容)
            res = name + '=' + value + _expires + path;
            // document.cookie="userId=828; userName=hulk";
            document.cookie = res;
        },
        /**
         * 根据名称信息和路径信息删除cookie
         * @param name
         * @param path
         */
        deleteCookie: function (name, path) {
            var name = name.escapeHTML(),
                expires = new Date();
            if (path === '') {
                path = '';
            } else {
                path = (';path=' + path);
            }

            // 删除之后重新设置cookie
            document.cookie = name + '=' + ';expires=' + expires.toUTCString() + path;
        },
        /**
         * 清空所有的cookie信息
         */
        clearAllCookies: function () {
            // 1. 获取浏览器中存储的所有cookie信息
            // "name&amp=xiuxiu&amp; name=xiuxiu; script=<script>alert(2); script2=<script>alert(2); script3=<script>alert(2); script3&amp=&ltscript&gtalert(2); script4&amp=&ltscript&gtalert(2); a&amp=&lta&gtalert(2)&lt/a&gt&amp"
            var cookies = document.cookie.split(';');
            if (cookies.length) {
                cookies.forEach(function (element) {
                    // 拿到字符串：name&amp=xiuxiu&amp
                    var index = element.indexOf('='),
                        name = element.substring(0, index);

                    // 实现思路：要想删除某一个COOkie信息，只需要将cookie的name对应的值设置为空即可
                    document.cookie = name + '=' + ';expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                });
            }

        }
    }


    // 本地存储框架localstorage的本地存储
    xframe.store = (function (xframe) {
        // 定义一个API，用于定义实现的本地存储的API接口
        var api = {},
            localStorageName = 'localStorage',
            globalStorageName = 'globalStorage',
            win = window,
            doc = window.document,
            storage;


        // 首先先定义要实现的功能接口
        api.set = function (key, value) {

        }
        api.get = function (key) {

        }
        api.remove = function (key) {

        }
        api.clear = function () {

        }


        /*
        *   a) sessionStorage和localStorage都是window的属性，也是Storage对象的实例，即：window.sessionStorage instanceof Storage返回True，window.localStorage instanceof Storage 返回True,也因此两者享有Storage的属性和方法。
            b) sessoinStorage存储的数据在页面会话结束时会被清空，页面会话在浏览器窗口关闭前持续存在，包含页面刷新和恢复。若新开标签或窗口将新建一个会话，再次获取sessionStorage将只限于当前会话，与先前会话的无关。localStorage存储的数据不会
            c) window.globalStorage自Gecko 13 (Firefox 13)起不再支持。
        *
        * */
        if (localStorageName in win && win[localStorageName]) {
            // 拿到本地存储的这个数据项
            storage = win[localStorageName];

            // 实现我自己定义的接口
            /**
             * 设置本地存储的内容
             * @param key
             * @param value
             */
            api.set = function (key, value) {
                storage.setItem(key, value);
            }
            /**
             * 获取本地存储的内容
             * @param key
             * @return {*}
             */
            api.get = function (key) {
                return storage.getItem(key);
            }
            /**
             * 移出其中的某一项
             * @param key
             */
            api.remove = function (key) {
                storage.removeItem(key);
            }
            /**
             * 清空本地存储的所有内容
             */
            api.clear = function () {
                storage.clear();
            }
        } else if (globalStorageName in win && win[globalStorageName]) {
            // HTML5中的localStorage替换了原来的globalStorgae
            // 1. 拿到本地存储的对象(这是一个Json对象)[Firefox浏览器]
            storage = win[globalStorageName][win.location.hostname];
            api.set = function (key, value) {
                storage[key] = value;
            }
            api.get = function (key) {
                return storage[key] && storage[key].value;
            }
            api.remove = function (key) {
                // delete用来删除一个对象的属性。
                delete storage[key];
            }
            api.clear = function () {
                for (var key in storage) {
                    delete storage[key];
                }
            }
        } else if (doc.documentElement.addBehavior) {
            // 如果可以给一个对象添加行为的话
            //  单独定义一个获取本地存储的对象storage
            function getStorage() {
                // 如果已经获取到了Storage对象的话
                if (storage) {
                    return storage;
                }
                storage = doc.body.appendChild(doc.createElement('div'));
                storage.style.display = 'none';
                // userData 64KB IE专用
                storage.addBehavior('#default#userData');
                // 这个是微软自定义的一个本地存储，相比之下有更大的容量
                storage.load(localStorageName);
                return storage;
            }

            api.set = function (key, value) {
                var storage = getStorage();
                // 设置属性
                storage.setAttribute(key, value);
                // 保存属性信息
                storage.save(localStorageName);
            }
            api.get = function (key) {
                var storage = getStorage();
                return storage.getAttribute(key);
            }
            api.remove = function (key) {
                var storage = getStorage();
                storage.removeAttribute(key);
                // 移出数据之后记得保存一下数据
                storage.save(localStorageName);
            }
            api.clear = function () {
                // 1. 获取Storage对象
                var storage = getStorage();
                // 2.获取storage对象存储的所有属性信息
                var attributes = storage.XmlDocument.documentElement.attributes;
                storage.load(localStorageName);
                // 3. 遍历所有的属性信息，并从本地移出数据
                [].slice.call(attributes).forEach(function (element) {
                    storage.removeAttribute(element.name);
                })
                // 4. 移出完毕之后，开始保存信息到本地存储
                storage.save(localStorageName);
            }

            return api;
        }

        // 把立即函数里面的私有成员暴露出去(如果在立即函数内部不暴露出去需要使用的成员，在外部是无法访问到内部的私有成员变量的)
        xframe.storage = api;

    })(xframe);
})(xframe);






