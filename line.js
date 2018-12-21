/*
 * constructor { Line } 折线图构造函数
 * param { ctx: Context } 绘图环境
 * param { data: Array } 绘制折线图的数据
 * param { arrow: Object } 设置箭头的大小
 * param { padding: Object } 设置坐标轴到画布的距离
 * */
function Line(ctx, data, color, arrow, padding) {
    this.ctx = ctx;
    this.data = data;
    this.arrow = arrow || {width: 14, height: 20};
    this.padding = padding || {left: 10, right: 10, top: 10, bottom: 10};
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;

    /*设置上顶点坐标*/
    this.vertexTop = {
        x: this.padding.left,
        y: this.padding.top
    };

    /*设置原点坐标*/
    this.origin = {
        x: this.padding.left,
        y: this.ctx.canvas.height - this.padding.top
    };

    /*设置右顶点坐标*/
    this.vertexRight = {
        x: this.ctx.canvas.width - this.padding.right,
        y: this.ctx.canvas.width - this.padding.bottom
    };

    /*计算坐标轴最大的刻度*/
    this.coordWidth = this.ctx.canvas.width - this.padding.left - this.padding.right - 10;
    this.coordHeight = this.ctx.canvas.height - this.padding.top - this.padding.bottom - 10;
}

/*为Line构造原型添加成员*/
Line.prototype = {
    constructor: Line,

    draw: function () {
        this.drawCoord();
        this.drawArrow();
        this.drawLine();
    },
    /*绘制坐标轴*/
    drawCoord: function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.vertexTop.x, this.vertexTop.y);
        this.ctx.lineTo(this.origin.x, this.origin.y);
        this.ctx.lineTo(this.vertexRight.x, this.vertexRight.y);
        this.ctx.stroke();
    },
    /*绘制箭头*/
    drawArrow: function () {

        /*上箭头*/
        this.ctx.beginPath();
        this.ctx.moveTo(this.vertexTop.x, this.vertexTop.y);
        this.ctx.lineTo(this.vertexTop.x - this.arrow.width / 2, this.vertexTop.y + this.arrow.height);
        this.ctx.lineTo(this.vertexTop.x, this.vertexTop.y + this.arrow.height / 2);
        this.ctx.lineTo(this.vertexTop.x + this.arrow.width / 2, this.vertexTop.y + this.arrow.height);
        this.ctx.closePath();
        this.ctx.fill();

        /*右箭头*/
        this.ctx.beginPath();
        this.ctx.moveTo(this.vertexRight.x, this.vertexRight.y);
        this.ctx.lineTo(this.vertexRight.x - this.arrow.height, this.vertexRight.y - this.arrow.width / 2);
        this.ctx.lineTo(this.vertexRight.x - this.arrow.height / 2, this.vertexRight.y);
        this.ctx.lineTo(this.vertexRight.x - this.arrow.height, this.vertexRight.y + this.arrow.width / 2);
        this.ctx.closePath();
        this.ctx.fill();
    },
    /*绘制数据的折线图*/
    drawLine: function () {

        // 先清除之前的路径
        this.ctx.beginPath();

        // 保存当前的this
        var self = this;

        /*计算x和y轴坐标的缩放比值*/
        var ratioX = this.coordWidth / this.data.length,
            ratioY = this.coordHeight / Math.max.apply(null, this.data);

        //遍历所有数据，依次绘制点和线
        this.data.forEach(function (y, x) {
            self.ctx.fillRect(self.origin.x + ratioX * x - 2, self.origin.y - ratioY * y - 2, 4, 4);
            self.ctx.lineTo(self.origin.x + ratioX * x, self.origin.y - ratioY * y);
        });

        //绘制线
        this.ctx.stroke();
    }
}

jQuery.fn.line = function ( data,color ) {
    var $node = this.eq(0);
    var canvas = $('<canvas></canvas>').get(0);
    var ctx = canvas.getContext('2d');

    var width = parseInt($node.css('width'));
    var height = parseInt($node.css('height'));

    canvas.width = width;
    canvas.height = height;

    var line = new Line( ctx, data,color );
    line.draw();
    $node.append(canvas);
}
