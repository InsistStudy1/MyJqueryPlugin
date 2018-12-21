/**
 * Created by Machenike on 2018/6/13.
 */

$.fn.extend({
    empty: function () {
        for (var i = 0, len = this.length; i < len; i++) {
            this[i].innerHTML = '';
        }
        return this;
    },
    _empty: function () {
        this.each(function () {
            this.innerHTML = '';
        });
        return this;
    },
    remove: function () {
        this.each(function () {
            this.parentNode.removeChild(this);
        })
        return this;
    },
    html: function (html) {
        if (arguments.length === 0) {
            return this.get(0).innerHTML;
        } else {
            this.each(function () {
                this.innerHTML = html;
            })
        }
        return this;
    },
    text: function (text) {
        if (arguments.length === 0) {
            var result = '';
            this.each(function () {
                result += this.innerText;
            });
            return result;
        } else {
            this.each(function () {
                this.innerText = text;
            })
        }
        return this;
    }
})