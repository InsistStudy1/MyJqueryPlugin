/**
 * Created by Machenike on 2018/6/11.
 */
(function (w) {

    //定义jQuery工厂函数
    function jQuery(selector) {
        return new jQuery.fn.init(selector);
    }

    jQuery.fn = jQuery.prototype = {
        jquery: '1.1.0',//jQuery版本号

        constructor: jQuery,

        selector: '', //默认选择器

        length: 0, //实例默认长度

        //把实例转换成数组
        toArray: function () {
            return [].slice.call(this);
        },

        //获取实例内指定元素
        get: function (num) {
            return num != null ?
                (num < 0 ? this[this.length - 1] : this[num]) :
                [].slice.call(this);
        },

        each: function (callback) {
            return jQuery.each(this, callback);
        },

        map: function (callback) {
            return jQuery.map(this, callback);
        },

        //截取指定下标之间的元素，构成一个新的jQuery对象返回
        slice: function () {
            return jQuery([].slice.apply(this, arguments));
        },

        first: function () {
            return this.eq(0);
        },

        last: function () {
            return this.eq(-1);
        },

        //获取实例内指定元素并转换为jQuery对象
        eq: function (num) {
            return num != null ? jQuery(this.get(num)) : jQuery();
        },

        //原型的方法供实例调用，this指向实例，所以不用更改this指向
        push: [].push(),
        splice: [].splice(),
        sort: [].sort()
    }

    //给jQuery和原型分别添加extend方法（继承方法）
    jQuery.extend = jQuery.fn.extend = function () {
        var i = 1, key,
            target = arguments[0],
            arg = arguments,
            argLen = arg.length;

        if (argLen === 1) {
            target = this;
            i = 0;
        }

        // 遍历得到后面所有的对象
        for (; i < argLen; i++) {

            // 遍历每一个对象所有的属性
            for (key in arg[i]) {
                target[ key ] = arg[ i ][ key ];
            }
        }

        //给谁混入就返回谁
        return target;
    }

    jQuery.extend = jQuery.fn.extend = function () {
        var i = 1,key, arg = arguments, argLen = arg.length, target = arg[0];
        if (arguments.length === 1) {
            target = this;
            i = 0;
        }
        for(;i<argLen;i++){
            for (key in arg[i]) {
                target[ key ] = arg[ i ][ key ];
            }
        }
        return target;
    }
    //给jQuery添加静态方法
    jQuery.extend({
        //去掉首尾空格
        trim: function (str) {
            if (!str) {
                return str;
            } else if (str.trim) {
                return str.trim();
            } else {
                return str.replace('/^\s+|\s+$/');
            }
        },

        //判断是否是string
        isString: function (str) {
            return typeof str === 'string';
        },

        //判断是否是window
        isWindow: function (w) {
            return w.window === w;
        },

        //判断是否是Function
        isFunction: function (fn) {
            return typeof fn === 'function';
        },

        //判断是否是对象
        isObject: function (obj) {
            return obj != null && (typeof obj === 'object' || typeof obj === 'function');
        },

        //判断是否是数组或者伪数组
        isLikeArray: function (arr) {
            //过滤掉window，function以及不是obj的
            if (jQuery.isWindow(arr) || jQuery.isFunction(arr) || !jQuery.isObject(arr)) {
                return false;
            }
            //如果是真数组
            if (({}).toString.call(arr) === '[object Array]') {
                return true;
            }
            //如果是伪数组
            if ('length' in arr && typeof arr.length == 'number' && ( arr.length === 0 || arr.length - 1 in arr  )) {
                return true;
            }
            return false;
        },

        //遍历实例中所有元素，并把对应索引和值传给回调函数
        each: function (obj, callback) {
            var len, i = 0;
            if (jQuery.isLikeArray(obj)) {
                len = obj.length;
                for (; i < len; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }
            //保持链式编程
            return obj;
        },

        //把回调函数的返回值组成一个数组返回
        map: function (obj, callback) {
            var len, i = 0, value, result = [];
            if (jQuery.isLikeArray(obj)) {
                len = obj.length;
                for (; i < len; i++) {
                    value = callback(obj[i], i);
                    if (value != null) {
                        result.push(value);
                    }
                }
            } else {
                for (i in obj) {
                    value = callback(obj[i], i);
                    if (value != null) {
                        result.push(value);
                    }
                }
            }
            return [].concat.apply([], result);
        },

        //执行入口函数
        ready: function (fn) {
            if (document.readyState == 'complete') {
                fn();
            } else if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', fn)
            } else {
                document.attachEvent('onreadystatechange', function () {
                    if (document.readyState == 'complete') {
                        fn();
                    }
                })
            }
        }
    })

    //jQuery中唯一的构造函数
    var init = jQuery.fn.init = function (selector) {

        // 传入null、NaN、undefined、false、0、''返回空实例
        if (!selector) {
            return this;
        }

        //判断是否是function(){}入口函数
        if (jQuery.isFunction(selector)) {
            jQuery.ready(selector);
        }

        //判断是否是字符串
        else if (typeof selector === 'string') {

            //去掉首尾空格，提高用户体验
            selector = jQuery.trim(selector);

            //判断是否是html片段
            if (selector.charAt(0) == '<' &&
                selector.charAt(selector.length - 1) == '>' &&
                selector.length >= 3) {

                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = selector;
                [].push.apply(this, tempDiv.childNodes);

            }
            //如果不是html片段，就当选择器处理
            else {

                try {
                    [].push.apply(this, document.querySelectorAll(selector));
                } catch (e) {
                    //如果报错就直接返回个空实例，并且length = 0
                    this.length = 0;
                }
            }

        }
        //判断是否是数组或者伪数组
        else if (jQuery.isLikeArray(selector)) {
            [].push.apply(this, [].slice.call(selector));
        }
        //如果都不是
        else {
            this[0] = selector;
            this.length = 1;
        }
    }

    //为了给外部添加jQuery插件，让init的原型和jQuery的原型指向同一个对象
    init.prototype = jQuery.fn;

    //向外界暴露jQuery和$两个变量
    w.jQuery = w.$ = jQuery;

}(window));