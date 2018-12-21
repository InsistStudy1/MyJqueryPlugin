/**
 * Created by Machenike on 2018/6/23.
 */
$.extend({

    // ajax默认配置
    ajaxSettings: {
        url: location.href,     //默认url为本机地址
        type: "GET",            //默认请求方式为GET
        async: true,            //默认为异步请求
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",    //POST发送信息时设置请求头信息需要使用
        timeout: null,  //默认不看延时信息
        dataType: "JSON",       //返回的默认数据
        success: function () {
        },
        error: function ( msg ) {
            console.log(msg);
        },
        complete: function () {
        }
    },

    //把对象转换成url格式
    urlStringify: function (data) {
        var result = '', key;
        for (key in data) {
            //为了防止window发送汉字造成乱码，所以需要统一遍码一下
            result += window.encodeURIComponent(key) + '=' + window.encodeURIComponent(data[key]) + '&';
        }
        return result.slice(0, -1);
    },

    // 加工options
    processOptions: function ( options ) {
        // 存储要执行ajax的参数
        var optionsNew = {};
        //合并默认配置信息和用户输入配置信息得到一个新的配置信息
        $.extend(optionsNew, jQuery.ajaxSettings, options);

        if (optionsNew.type === "GET") {
            optionsNew.url += '?' + jQuery.urlStringify(optionsNew.data);
            optionsNew.data = null;
        }

        return optionsNew;
    },

    ajax: function (options) {
        // 存储要执行ajax的参数
        var optionsNew, xhr, result, time;

        //加工得到一份处理好的配置
        optionsNew = jQuery.processOptions(options);

        //创建xhr对象，发送请求
        xhr = new XMLHttpRequest();
        xhr.open(optionsNew.type, optionsNew.url, optionsNew.async);

        //如果是POST请求，添加一个请求头
        if (optionsNew.type === "POST") {
            optionsNew.setRequestHeader('Content-Type', optionsNew.contentType);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                clearTimeout(time);

                optionsNew.complete();
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    switch (optionsNew.dataType){
                        case "JSON":
                            result = JSON.parse(xhr.responseText);
                            break;
                        case "script":
                            eval(xhr.responseText);
                            result = xhr.responseText;
                            break;
                        case "style":
                            var style = $('<style></style>').html(xhr.responseText).appendTo("head");
                            result = xhr.responseText;
                            break;
                        default:
                            result = xhr.responseText;
                            break
                    }
                    optionsNew.success(result);
                } else {
                    optionsNew.error(xhr.status);
                }
            }
        }
        if(optionsNew.timeout){
            time = setTimeout(function () {
                optionsNew.error('请求超时');
                xhr.onreadystatechange = null;
            },optionsNew.timeout)
        }
        xhr.send(optionsNew.data);
    }
})