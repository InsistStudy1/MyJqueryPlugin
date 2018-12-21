/**
 * Created by Machenike on 2018/6/22.
 */
/**
 * Created by Machenike on 2018/5/4.
 */
(function (w) {
    // 把角度转换成弧度
    function angleToRadian(angle) {
        return Math.PI / 180 * angle;
    }

    // 混入式继承，obj1继承obj2
    function extend(obj1, obj2) {
        for (var key in obj2) {
            // 判断：只有obj2才会copy到obj1上
            if (obj2.hasOwnProperty(key)) {
                obj1[key] = obj2[key];
            }
        }
    }

    /*
     * constructor: { pie } 饼图的构造函数
     * param：{ x:number } 圆心x轴坐标
     * param：{ y:number } 圆心y轴坐标
     * param: { r:number } 圆的半径
     * param：{ data:Array } 数据
     * */
    function Pie(ctx, x, y, r, data) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.r = r;
        this.data = data;
        // 一组颜色
        this.colors = ['orange', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'peru', 'pink'];
    }

    //给原型扩充方法
    extend(Pie.prototype, {
        //绘制饼图
        draw: function () {
            //保存一下this
            var self = this;

            //算出数据总和
            var hashTotal = 0;
            this.data.forEach(function (obj) {
                hashTotal += obj.val;
            });

            //计算一个数据所占用的角度
            var ration = 360 / hashTotal;

            //初始化起始角度和结束角度
            var startRadian = 0,
                endRadian = 0,
                lineX, lineY;

            this.data.forEach(function (obj, i) {
                //每次遍历时，开始角度等于上一次结束角度
                startRadian = endRadian;
                //这个结束角度 = 上一个扇形的结束角度 + 当前数值所对应的角度
                endRadian = endRadian + obj.val * ration;

                var lineAngle = startRadian + obj.val * ration / 2;

                //求出画线经过点的x和y坐标
                lineX = self.x + (self.r + 20) * Math.cos(angleToRadian(lineAngle));
                lineY = self.y + (self.r + 20) * Math.sin(angleToRadian(lineAngle));

                //画出每一个扇形
                self.ctx.beginPath();
                self.ctx.moveTo(self.x, self.y);
                self.ctx.arc(self.x, self.y, self.r, angleToRadian(startRadian), angleToRadian(endRadian));
                self.ctx.closePath();
                self.ctx.fillStyle = self.colors[i];
                self.ctx.fill();

                //画出每一个扇形的平分线
                self.ctx.beginPath();
                self.ctx.moveTo(self.x, self.y);
                self.ctx.lineTo(lineX, lineY);
                self.ctx.strokeStyle = self.colors[i];
                self.ctx.stroke();

                //判断文字方向
                if (lineAngle >= 90 && lineAngle < 270) {
                    self.ctx.textAlign = 'right';
                } else {
                    self.ctx.textAlign = 'left';
                }
                self.ctx.font = '1em 微软雅黑';
                //绘制文字
                self.ctx.fillText(obj.msg, lineX, lineY);
            })

        }
    });

    $.fn.pipe = function ( data ) {
        var $node = this.eq(0);
        var canvas = $('<canvas></canvas>').get(0);
        var ctx = canvas.getContext('2d');

        var width = parseInt($node.css('width'));
        var height = parseInt($node.css('height'));

        canvas.width = width;
        canvas.height = height;

        var r = Math.min(width,height)/2 - 80;

        var pipe = new Pie( ctx, width/2, height/2, r ,data);
        pipe.draw();

        $node.append(canvas);
    }
})(window);