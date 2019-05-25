/**
 * Created by xiao lei on 2016/9/24.
 */
var utils = (function () {
    var flg = 'getComputedStyle' in window;

    function makeArray(arg) {
        var ary = [];
        if (flg) {
            return Array.prototype.slice.call(arg);
        } else {
            for (var i = 0; i < arg.length; i++) {
                ary.push(arg[i])
            }
        }
        return ary;
    }

    function jsonParse(jsonStr) {
        return 'JSON' in window ? JSON.parse(jsonStr) : eval('(' + jsonStr + ')')
    }

    function win(attr, value) {
        /*//思路2：判断arguments
         if(arguments.length==1){
         return document.documentElement[attr]||document.body[attr];
         }
         document.documentElement[attr]=document.body[attr]=value;*/
        //思路1：通过判断第二个参数是否传了，来解决 获取 和 设置 的问题；
        //if(value==null)
        if (typeof value === 'undefined') {//第二个参数没传-作用用来“获取”
            return document.documentElement[attr] || document.body[attr];
        }
        //用来设置
        document.documentElement[attr] = document.body[attr] = value;
    }

    function offset(curEle) {
        var l = curEle.offsetLeft;
        var t = curEle.offsetTop;
        var par = curEle.offsetParent;
        while (par) {
            if (window.navigator.userAgent.indexOf('MSIE 8.0') === -1) {
                l += par.clientLeft;
                t += par.clientTop;
            }
            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: l, top: t};
    }

    function rnd(n, m) {
        //1.看来传的参数不是数字，返回一个0-1之间的随机小数，代表传参错误；
        n = Number(n);
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {
            return Math.random();//0-1之间随机小数，代表传参错误
        }
        //2.如果n>m,需要交互他们的位置
        if (n > m) {
            var tmp = m;
            m = n;
            n = tmp;
        }
        return Math.round(Math.random() * (m - n) + n);


    }

    function getByClass(strClass, curEle) {
        curEle = curEle || document;
        //1.标准浏览器直接使用系统方法
        if (flg) {
            return this.makeArray(curEle.getElementsByClassName(strClass));
        }
        //2.处理IE6-8浏览器
        //2.1字符串转数组：去除首尾空格，再按空格切分成数组
        var aryClass = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
        //2.2拿到该容器下所有的子元素
        var nodeList = curEle.getElementsByTagName('*');
        var ary = [];
        //2.3校验nodeList中每个元素的className是否包含aryClass中的每一项
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            var bOk = true;
            for (var j = 0; j < aryClass.length; j++) {//'box1','box2'....
                var reg = new RegExp('\\b' + aryClass[j] + '\\b');
                if (!reg.test(curNode.className)) {
                    bOk = false;
                    break;
                }
            }
            if (bOk) {
                ary.push(curNode)
            }
        }
        return ary;
    }

    function addClass(curEle, strClass) {
        var aryClass = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
        //循环的目的是为了逐个校验
        for (var i = 0; i < aryClass.length; i++) {
            if (!this.hasClass(curEle, aryClass[i])) {
                curEle.className += ' ' + aryClass[i];
            }
        }
    }

    function hasClass(curEle, cName) {
        //var reg=new RegExp('\\b'+cName+'\\b');
        var reg = new RegExp('(^| +)' + cName + '( +|$)');
        return reg.test(curEle.className);
    }

    function removeClass(curEle, strClass) {
        var aryClass = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
        for (var i = 0; i < aryClass.length; i++) {
            //var reg=new RegExp('(^| +)'+aryClass[i]+'( +|$)');
            var reg = new RegExp('\\b' + aryClass[i] + '\\b');
            if (reg.test(curEle.className)) {
                curEle.className = curEle.className.replace(reg, ' ').replace(/(^ +)|( +$)/g, '').replace(/\s+/g, ' ');
            }
        }
    }

    function getCss(curEle, attr) {
        var val = null;
        var reg = null;
        if (flg) {
            val = getComputedStyle(curEle, false)[attr]
        } else {
            //处理透明度
            if (attr === 'opacity') {
                val = curEle.currentStyle.filter; //'alpha(opacity=30)'
                reg = /^alpha\(opacity[=:](\d+)\)$/gi;
                //RegExp.$1 --第一个小分组   ；他不受全局g的影响，但是用RegExp之前，一定要先影响lastIndex；能影响lastIndex的属性有两个（test，exec）
                //注意。通过RegExp最多只能拿到$9；第九个小分组之后都拿不到；
                //return reg.test(val)?reg.exec(val)[1]/100:1;
                return reg.test(val) ? RegExp.$1 / 100 : 1;
            }
            val = curEle.currentStyle[attr];
        }
        //处理单位
        reg = /^([+-])?(\d+(\.\d+)?(px|pt|rem|em))$/i;
        return reg.test(val) ? parseFloat(val) : val;
    }

    function setCss(curEle, attr, value) {
        //处理浮动问题
        if (attr === 'float') {
            curEle.style.cssFloat = value;
            curEle.style.styleFloat = value;
            return;
        }
        //处理透明度
        if (attr === 'opacity') {
            curEle.style.opacity = value;
            curEle.style.filter = 'alpha(opacity=' + (value * 100) + ')';
            return;
        }
        //处理单位
        var reg = /^(width|height|left|top|right|bottom|((margin|padding)(left|top|right|bottom)?))$/ig;
        if (reg.test(attr) && value.toString().indexOf('%') === -1) {
            value = parseFloat(value) + 'px';
        }
        curEle.style[attr] = value;
    }

    function setGroupCss(curEle, opt) {
        if (opt.toString() !== '[object Object]') return;//如果opt不是对象，直接阻断程序；
        for (var attr in opt) {
            this.setCss(curEle, attr, opt[attr])
        }
    }

    function css(curEle) {
        var arg2 = arguments[1];
        if (typeof arg2 === 'string') {//获取 or 设置一个
            var arg3 = arguments[2];
            if (typeof arg3 === 'undefined') {//获取
                return this.getCss(curEle, arg2)
            } else {//设置一个
                this.setCss(curEle, arg2, arg3)
            }
        }
        if (arg2.toString() === '[object Object]') {//设置一组
            this.setGroupCss(curEle, arg2)
        }
    }

    function getChildren(curEle, ele) {
        var nodeList = curEle.childNodes;//获取所有子节点
        var ary = [];
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];//div p
            if (curNode.nodeType === 1) {
                //考虑第二个参数是否传了
                if (typeof ele !== 'undefined') {//筛选
                    if (ele.toUpperCase() === curNode.nodeName) {
                        ary.push(curNode)
                    }
                } else {
                    ary.push(curNode)
                }
            }
        }
        return ary;
    }

    function prev(curEle) {
        //标准浏览器
        if (flg) {
            return curEle.previousElementSibling;
        }
        //IE6-8的兼容处理；
        var pre = curEle.previousSibling;//上一个哥哥节点
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    function next(curEle) {
        if (flg) {
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextSibling;
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextSibling;
        }
        return nex;
    }

    function prevAll(curEle) {
        var pre = this.prev(curEle);
        var ary = [];
        while (pre) {
            ary.push(pre);
            pre = this.prev(pre);
        }
        return ary;
    }

    function nextAll(curEle) {
        var nex = this.next(curEle);
        var ary = [];
        while (nex) {
            ary.push(nex);
            nex = this.next(nex);
        }
        return ary;
    }

    function sibling(curEle) {
        var ary = [];
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        if (pre) ary.push(pre);
        if (nex) ary.push(nex);
        return ary;
    }

    function siblings(curEle) {
        var prevAll = this.prevAll(curEle);
        var nextAll = this.nextAll(curEle);
        return prevAll.concat(nextAll);
    }

    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    function firstChild(curEle) {
        var ary = this.getChildren(curEle);
        return ary[0];
    }

    function lastChild(curEle) {
        var ary = this.getChildren(curEle);
        return ary[ary.length - 1];
    }

    function appendChild(parent, newEle) {
        parent.appendChild(newEle);
    }

    function prependChild(parent, newEle) {
        var first = this.firstChild(parent);
        if (first) {//如果有第一个子元素
            parent.insertBefore(newEle, first);
        } else {
            parent.appendChild(newEle);
        }

    }

    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    function insertAfter(newEle, oldEle) {
        var nex = this.next(oldEle);
        if (nex) {
            oldEle.parentNode.insertBefore(newEle, nex);
        } else {
            oldEle.parentNode.appendChild(newEle);
        }
    }

    return {
        //makeArray:类数组转数组
        makeArray: makeArray,
        //jsonParse:把JSON格式的字符串转为JSON格式的数据（对象）
        jsonParse: jsonParse,
        //win:处理浏览器盒子模型的兼容性
        win: win,
        //offset:求盒子模型到body的偏移量
        offset: offset,
        //rnd:求[n,m]之间的随机整数
        rnd: rnd,
        //getByClass:限定范围 的通过 class 来 获取元素
        getByClass: getByClass,
        //hasClass:判断 元素的className上 是否包含 某个class名'box1'；
        hasClass: hasClass,
        //addClass:如果元素的className上没有某个class名，才会添加该class名；
        //'box1 box2 box3'
        addClass: addClass,
        //removeClass:判断一个元素的class上是否有某个class名，如果有干掉他；
        removeClass: removeClass,
        //getCss:获取元素的非行间样式；
        getCss: getCss,
        //setCss:给元素的某个属性，设置一个样式
        setCss: setCss,
        //setGroupCss:给元素设置一组样式 {width:xxx,height:xxx}
        setGroupCss: setGroupCss,
        //css:getCss(curEle,attr)  setCss(curEle,attr,value) setGroupCss(curEle,opt)
        css: css,
        //getChildren:获取当前元素下的所有子元素，帅选出某个标签的元素集合；
        getChildren: getChildren,
        //prev:获取当前元素的上一个哥哥元素；
        prev: prev,
        next: next,
        //prevAll:获取当前元素所有的哥哥元素
        prevAll: prevAll,
        //nextAll:获取当前元素的所有弟弟元素
        nextAll: nextAll,
        //sibling:当前元素的相邻元素 prev+next
        sibling: sibling,
        //siblings:所有的兄弟元素 prevAll+nextAll;
        siblings: siblings,
        //index:求当前元素的索引
        index: index,
        //firstChild:求当前容器下第一个子元素
        firstChild: firstChild,
        //lastChild:求当前容器下最后一个子元素
        lastChild: lastChild,
        appendChild: appendChild,
        //prependChild:如果有第一个子元素，插入到第一个子元素的前面，否则，直接插入容器的末尾；
        prependChild: prependChild,
        insertBefore: insertBefore,
        //insertAfter:如果指定元素的弟弟元素存在的话，插入到弟弟元素的前面，否则，直接插入到容器的末尾；
        insertAfter: insertAfter

    }
})();









