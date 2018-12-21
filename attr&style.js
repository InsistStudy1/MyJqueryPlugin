/**
 * Created by Machenike on 2018/6/17.
 */
$.extend({
    getStyle: function ( dom, styleName ) {
        if(window.getComputedStyle){
            return getComputedStyle(dom)[styleName];
        }else {
            return dom.currentStyle[styleName];
        }
    }
})

$.fn.extend({
    appendTo: function (selector) {
        /*
         * 1、定义一个数组，用来存储将来被添加的元素
         * 2、把selector包装成jq实例，方便使用
         * 3、在外层遍历目标元素（selector包装成的jQ实例）
         * 4、在内层遍历所有元素（this）
         * 5、判断遍历目标元素的次数，如果是第一次，把元素添加到目标元素上，添加之后把被添加的元素添加到数组中
         * 6、否则，添加元素clone版本，添加之后把被添加的元素添加到数组中
         * 7、把被添加元素组成的数组包装成jQ实例返回
         * */
        var result = [], $selector = $(selector),self = this,tempNode = null;
        $selector.each(function ( index, val ) {
            self.each(function () {
                tempNode = index === 0 ? this : this.cloneNode(true);
                val.appendChild(tempNode);
                result.push(tempNode);
            });
        })
        return jQuery(result);
    },
    prependTo: function (selector) {
        /*
         * 1、定义一个数组，用来存储将来被添加的元素
         * 2、把selector包装成jq实例，方便使用
         * 3、在外层遍历目标元素（selector包装成的jQ实例）
         * 4、在内层遍历所有元素（this）
         * 5、判断遍历目标元素的次数，如果是第一次，把元素添加到目标元素最前面，添加之后把被添加的元素添加到数组中
         * 6、否则，添加元素clone版本，添加之后把被添加的元素添加到数组中
         * 7、把被添加元素组成的数组包装成jQ实例返回
         * */
        var result = [], $selector = $(selector),self = this,tempNode = null;
        $selector.each(function ( index, val ) {
            self.each(function () {
                tempNode = index === 0 ? this : this.cloneNode(true);
                val.insertBefore(tempNode,val.firstChild);
                result.push(tempNode);
            });
        })
        return jQuery(result);
    },
    append: function (context) {
        /*
         * 实现思路：
         * 1、判断传入字符是不是字符串，如果是遍历所有元素，把所有元素的innerHTML加上selector
         * 2、如果不是调用appendTo方法
         * */
        if(jQuery.isString(context)){
            this.innerHTML += context;
        }else {
            $(context).appendTo(this);
        }
        return this;
    },
    prepend: function () {
        if(jQuery.isString(context)){
            this.innerHTML = context+this.innerHTML;
        }else {
            $(context).prependTo(this);
        }
        return this;
    },
    attr: function (attr, value) {
        /*
         * 实现思路：
         * 1、判断arguments.length的长度
         * 2、如果长度为1，继续判断attr是否为字符串
         * 3、如果为字符串，返回第一个元素指定属性节点值
         * 4、如果为对象，外部遍历所有元素，内部遍历对象，得到所有属性节点值，把所有属性都添加到这个对象上
         * 5、如果arguments.length的长度大于等于2，那么遍历所有元素，分别给他们设置新的属性节点值
         * 5、返回this
         * */
        if (arguments.length === 1) {
            if (jQuery.isString(attr)) {
                return this.get(0).getAttribute(attr);
            } else if (jQuery.isObject(attr)) {
                this.each(function () {
                    var self = this;
                    jQuery.each(attr, function (key, val) {
                        self.setAttribute(key, val);
                    })
                })
            }
        } else {
            this.each(function () {
                this.setAttribute(attr, value)
            })
        }
        return this;
    },
    prop: function (attr, value) {
        /*
         * 实现思路：
         * 1、判断arguments.length的长度
         * 2、如果长度为1，继续判断attr是否为字符串
         * 3、如果为字符串，返回第一个元素指定属性值
         * 4、如果为对象，外部遍历所有元素，内部遍历对象，得到所有属性值，把所有属性都添加到这个对象上
         * 5、如果arguments.length的长度大于等于2，那么遍历所有元素，分别给他们设置新的属性值
         * 5、返回this
         * */
        if (arguments.length === 1) {
            if (jQuery.isString(attr)) {
                return this[0][attr];
            } else if (jQuery.isObject(attr)) {
                this.each(function () {
                    var self = this;
                    jQuery.each(attr, function (key, value) {
                        self[key] = value;
                    })
                })
            }
        } else if (arguments.length >= 2) {
            this.each(function () {
                this[attr] = value;
            })
        }
        return this;
    },
    css: function (styleName, style) {
        /*
         * 实现思路：
         * 1、判断arguments.length的长度
         * 2、如果长度为1，继续判断styleName是否为字符串
         * 3、如果为字符串，返回第一个元素指定样式值
         * 4、如果为对象，外部遍历所有元素，内部遍历对象，得到所有样式值，把所有样式都添加到这个对象上
         * 5、如果arguments.length的长度大于等于2，那么遍历所有元素，分别给他们设置新的样式
         * 5、返回this
         * */
        if (arguments.length === 1) {
            if (jQuery.isString(styleName)) {
                return jQuery.getStyle(this.get(0),styleName)
            }else if(jQuery.isObject(styleName)){
                this.each(function () {
                    var self = this;
                    jQuery.each( styleName, function ( key,val) {
                        self.style[key] = val;
                    })
                })
            }

        } else {
            this.each(function () {
                this.style[styleName] = style;
            })
        }
    },
    val: function ( value ) {
        if(arguments.length === 0){
            return this.get(0).value;
        }else if(arguments.length === 1){
            this.each(function () {
                this.value = value;
            })
        }
        return this;
    },
    hasClass: function ( className ) {
        /*
         * 实现思路：
         * 1、遍历所有元素
         * 2、依次获取每个className，为了方便首尾加空格
         * 3、利用处理过的className字符串的indexOf方法判断有没有指定的className（这个className首尾也要加空格）
         * 4、如果有一个元素的判断结果不为-1，返回true
         * */
        var flag = false;
        this.each(function () {
            if((' '+ this.className + ' ').indexOf(' ' + className + ' ') != -1){
                flag = true;
                return false;
            }
        })
        return flag;
    },
    addClass: function ( className ) {
        /*
         * 实现思路：
         * 0、新建一个装类的数组，把传进来的字符串以空格分界转换成数组
         * 1、遍历所有元素，遍历数组，通过hasClass判断是否存在类名
         * 2，如果存在就忽略，不存在就添加类名
         * 3、返回this
         * */
        var classNameArr = jQuery.trim(className).split(' ');
        this.each(function () {
            var $self = jQuery( this );

            // 遍历所有要添加的class
            jQuery.each( classNameArr, function( i, val ) {
                // 如果元素没有相应的class则进行添加
                if( !$self.hasClass( val ) ) {

                    // jQ实例没有className属性，
                    // 得先通过实例得到原生DOM，再获取
                    $self[ 0 ].className += ' ' + val;
                }
            });
        })
        return this;
    },
    removeClass: function ( className ) {
        /*
         * 实现思路：
         * 0、新建一个装类的数组，把传进来的字符串以空格分界转换成数组
         * 1、遍历所有元素，遍历数组，通过hasClass判断是否存在类名
         * 2，如果存在就删除，不存在就忽略
         * 3、返回this
         * */
        if(arguments.length === 0){
            this.each(function () {
                this.className = '';
            })
        }else {
            var classNameArr = jQuery.trim(className).split(' ');
            this.each(function () {
                var self = this;
                jQuery.each(classNameArr, function (index, val) {
                    if($(self).hasClass(val)){
                        self.className = jQuery.trim((' '+self.className+' ').replace(' '+val+' ',' '));
                    }
                })
            })
        }

        return this;
    },
    toggleClass: function ( className ) {
        var classNameArr = jQuery.trim(className).split(' ');
        this.each(function () {
            var $self = $(this);
            jQuery.each(classNameArr, function (index, val) {
                if($self.hasClass(val)){
//                            self.className = jQuery.trim((' '+self.className+' ').replace(' '+val+' ',' '));
                    $self.removeClass(val);
                }else {
//                            self.className += ' ' + classNameArr[index];
                    $self.addClass(val);
                }
            })
        })
        return this;
    }
})