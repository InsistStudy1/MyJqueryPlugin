/**
 * Created by Machenike on 2018/6/21.
 */
$.extend({
    //事件添加兼容处理
    addEvent: function (ele, type, fn) {
        if (ele.addEventListener) {
            ele.addEventListener(type, fn);
        } else {
            ele.attachEvent('on' + type, fn);
        }
    },
    //事件移除兼容处理
    removeEvent: function (ele, type, fn) {
        if (ele.removeEventListener) {
            ele.removeEventListener(type, fn);
        } else {
            ele.detachEvent('on' + type, fn);
        }
    }
});
$.fn.extend({
    //事件添加
    on: function (type, fn) {
        this.each(function () {
            //如果事件缓存对象存在的话，就用原来的，否则初始化一个
            this.$_event_cache = this.$_event_cache || {};

            //存储this
            var self = this;

            //判断对应事件的数组是否存在
            if (!this.$_event_cache[type]) {
                //新建事件对应数组并把回调传入进去
                this.$_event_cache[type] = [fn];

                //给每个元素绑定事件
                jQuery.addEvent(this, type, function (e) {
                    //遍历事件对应的数组，获得回调函数并执行，且传入this和事件对象
                    jQuery.each(self.$_event_cache[type], function () {
                        this.call(self, e);
                    })
                })
            } else {
                this.$_event_cache[type].push(fn);
            }
        })
        return this;
    },

    //事件移除
    off: function (type, fn) {

        // 存储传入参数
        var argLen = arguments.length;

        this.each(function () {

            if (!this.$_event_cache) {
                return;
            }

            if (argLen === 0) {
                for (var key in this.$_event_cache) {
                    this.$_event_cache[key] = [];
                }
            } else if (argLen === 1) {
                this.$_event_cache[type] = [];
            } else {
                for (var i = this.$_event_cache[type].length; i >= 0; i--) {
                    if (this.$_event_cache[type][i] === fn) {
                        this.$_event_cache[type].splice(i, 1);
                    }
                }
            }

            return this;
        })
    }
})

//单独添加某事件范例
//如果要绑定多个事件太麻烦，要一个个写


// 得到存储所有事件的数组
var events = ( "blur focus focusin focusout load resize scroll unload click dblclick " +
"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
"change select submit keydown keypress keyup error contextmenu" ).split( " " );

//批量给原型添加事件，他们都复用了on方法
jQuery.each(events, function (key, eventName) {

    //给原型添加方法，供实例使用，所以内部this指向实例
    $.fn[eventName] = function (fn) {

        //实例可以调用on方法绑定事件
        return this.on(eventName, fn);
    }
})