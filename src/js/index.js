/**
 * Created by zhangyuxin on 17/6/17.
 */

import $ from 'jquery'
import point from './pointUnique'
import '../css/index.css';
(function ($, staPos, centerPoint) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var chooseLineList = {};
  var param = function () {
    return {
      //刷新频率相关
      now: 0,
      then: Date.now(),
      interval: 1000 / 10,//刷新频率  分母即fps 越大会影响CPU占用率
      delta: 0,
      //颜色表
      colorList: {
        1001: {
          r: 228,
          g: 120,
          b: 120,
          a: 1
        },
        1002: {
          r: 85,
          g: 145,
          b: 206,
          a: 1
        },
        1004: {
          r: 23,
          g: 190,
          b: 176,
          a: 1
        },
        1005: {
          r: 207,
          g: 112,
          b: 179,
          a: 1
        },
        1006: {
          r: 226,
          g: 161,
          b: 22,
          a: 1
        },
        1007: {
          r: 179,
          g: 143,
          b: 101,
          a: 1
        },
        1008: {
          r: 71,
          g: 184,
          b: 82,
          a: 1
        },
        1009: {
          r: 136,
          g: 173,
          b: 46,
          a: 1
        },
        1010: {
          r: 59,
          g: 174,
          b: 232,
          a: 1
        },
        1013: {
          r: 191,
          g: 126,
          b: 22,
          a: 1
        },
        1014: {
          r: 205,
          g: 128,
          b: 228,
          a: 1
        },
        1015: {
          r: 138,
          g: 112,
          b: 185,
          a: 1
        },
        1016: {
          r: 90,
          g: 142,
          b: 119,
          a: 1
        },
        1051: {
          r: 228,
          g: 120,
          b: 120,
          a: 1
        },
        1052: {
          r: 177,
          g: 134,
          b: 164,
          a: 1
        },
        1053: {
          r: 219,
          g: 130,
          b: 64,
          a: 1
        },
        1054: {
          r: 177,
          g: 153,
          b: 187,
          a: 1
        },
        1055: {
          r: 222,
          g: 89,
          b: 130,
          a: 1
        }
      },
      rate: 1,            //初始比例
      initRate: 1,        //默认比例
      initZoom: 0.75,     //默认缩放
      stepSize: 0.1,      //缩放步伐大小
      position: 933,      //位置偏移量
      baseFont: 16,       //默认字体大小
      lineWidth: 6.7,      //线路宽度
      pointR: 4,           //站点半径
      pointLWidth: 1.34,   //站点圆圈宽度
      pointColor: 'white', //站点填充色
      tranPointR: 6.7,     //换乘点半径
      tranPointLWidth: 2.7,//换乘点圆圈宽度
      tranPColor: 'white', //换乘点填充色
      canvasWidth: 2133,  //默认canvas宽度
      canvasHeight: 1733,
      lineMode: 1,         //模式
      //闪烁参数
      blinkRRate: 1.5,
      blinkBlur: 10,
      blinkColor: {
        r: 255, g: 0, b: 0
      },
      textColor: {
        r: 50, g: 50, b: 50
      },

      showAlpha: 1,
      hideAlpha: 0.1,

      lineBtnHtml: '<div class="line-bar"> <button id="b_1001" rel="0">1号线</button> <button id="b_1002" rel="0">2号线</button> <button id="b_1004" rel="0">4号线</button> <button id="b_1005" rel="0">5号线</button> <button id="b_1006" rel="0">6号线</button> <button id="b_1007" rel="0">7号线</button> <button id="b_1008" rel="0">8号线</button> <button id="b_1009" rel="0">9号线</button> <button id="b_1010" rel="0">10号线</button> <button id="b_1013" rel="0">13号线</button> <button id="b_1014" rel="0">14号线</button> <button id="b_1015" rel="0">15号线</button> <button id="b_1016" rel="0">16号线</button> <button id="b_1051" rel="0">八通线</button> <button id="b_1052" rel="0">昌平线</button> <button id="b_1053" rel="0">房山线</button> <button id="b_1055" rel="0">亦庄线</button> <button id="b_1054" rel="0">机场线</button> </div>',
      scaleBarHtml: '<div class="scale-bar"> <button  id="scaleBtnAdd" rel="1">+</button> <button id="scaleBtnDec" rel="0">-</button> </div>',
      modeBarHtml: '<div class="mode-bar"> <button id="modeBtn" ">单线模式</button> </div>'
    }
  }();
  var RENDERER = function () {
    return {
      init: function () {
        this.setParameters();
        requestAnimationFrame(this.render);
      },
      setParameters: function () {
        $('body').append(param.lineBtnHtml);
        $('body').append(param.scaleBarHtml);
        $('body').append(param.modeBarHtml);
        $('body').append('<div class="content" id="content" style="width: ' + param.canvasWidth * param.rate + 'px;height: ' + param.canvasHeight * param.rate + 'px"></div>');
        $('#content').append('<canvas id="myCanvas" width="' + param.canvasWidth * param.rate + '" height="' + param.canvasHeight * param.rate + '" class="my-canvas"></canvas>');
        $('#content').css('zoom', param.initZoom);
        $('#content').append('<div class="mask"></div>');
        this.canvas = document.getElementById("myCanvas");
        this.cxt = this.canvas.getContext("2d");
        this.cxt.imageSmoothingEnabled = true;
      },
      render: function () {
        requestAnimationFrame(RENDERER.render);
        param.now = Date.now();
        param.delta = param.now - param.then;
        if (param.delta > param.interval) {
          param.then = param.now - (param.delta % param.interval);
          RENDERER.cxt.clearRect(0, 0, param.canvasWidth * param.rate, param.canvasHeight * param.rate);
          RENDERER.drawMap();
        }
      },
      /***
       * 画地铁图
       */
      drawMap: function () {

        //画线
        for (var i in staPos) {
          var centerX = RENDERER.getPoint(staPos[i].cx, centerPoint.cx);
          var centerY = RENDERER.getPoint(staPos[i].cy, centerPoint.cy);
          if (staPos[i].hasOwnProperty('nextId') && staPos[i].nextId.length != 0) {
            for (var nextIndex = 0; nextIndex < staPos[i].nextId.length; nextIndex++) {

              var nextId = staPos[i].nextId[nextIndex];
              //获取所在线路
              var lineIndex = staPos[i].lineId[nextIndex];
              var bezier = undefined;
              //算下一个点的坐标
              var nextCenterX = RENDERER.getPoint(staPos[nextId].cx, centerPoint.cx);
              var nextCenterY = RENDERER.getPoint(staPos[nextId].cy, centerPoint.cy);
              var drawLine = param.lineMode ? RENDERER.drawDBLine : RENDERER.drawLine;
              drawLine(
                RENDERER.cxt,
                centerX,
                centerY,
                nextCenterX,
                nextCenterY,
                param.lineWidth * param.rate,
                RENDERER.getLineColor(lineIndex),
                staPos[i].hasOwnProperty('bezier') ? staPos[i].bezier[nextIndex] : undefined);
            }
          }
        }
        // 画点
        for (i in staPos) {
          //获取所在线路
          lineIndex = staPos[i].lineId[0];
          centerX = RENDERER.getPoint(staPos[i].cx, centerPoint.cx);
          centerY = RENDERER.getPoint(staPos[i].cy, centerPoint.cy);

          var nameX = RENDERER.getPoint(staPos[i].namePoint.x, parseInt(centerPoint.cx) + 10);
          var nameY = RENDERER.getPoint(staPos[i].namePoint.y, centerPoint.cy);

          var alpha = param.hideAlpha;

          for (var li = 0; li < staPos[i].lineId.length; li++) {

            if (param.colorList[staPos[i].lineId[li]].a == param.showAlpha) {
              alpha = param.showAlpha;
              break;
            }

          }
          // 画点 换乘站
          if (staPos[i].transfer) {
            if (staPos[i].hasOwnProperty('isBusy') && staPos[i].isBusy == true) {
              //闪烁点
              RENDERER.drawBlinkPoint(
                RENDERER.cxt,
                centerX,
                centerY,
                param.tranPointR * param.rate,
                param.tranPointLWidth * param.rate,
                RENDERER.getColor(param.blinkColor, alpha),
                RENDERER.getColor(param.blinkColor, alpha),
                staPos[i]);
            } else {
              RENDERER.drawPoint(
                RENDERER.cxt,
                centerX,
                centerY,
                param.tranPointR * param.rate,
                param.tranPointLWidth * param.rate,
                param.tranPColor,
                'rgba(0,0,0,' + alpha + ')')
            }
            RENDERER.drawText(
              RENDERER.cxt,
              nameX,
              nameY,
              staPos[i].name,
              RENDERER.getColor(param.textColor, alpha),
              param.baseFont * param.rate);

          } else {
            //画点 非换乘站
            if (staPos[i].hasOwnProperty('isBusy') && staPos[i].isBusy == true) {
              //闪烁点
              RENDERER.drawBlinkPoint(
                RENDERER.cxt,
                centerX,
                centerY,
                param.pointR * param.rate * param.blinkRRate,
                param.pointLWidth * param.rate,
                RENDERER.getColor(param.blinkColor, param.colorList[lineIndex].a),
                RENDERER.getLineColor(lineIndex),
                staPos[i]);
            } else {
              //正常点
              RENDERER.drawPoint(
                RENDERER.cxt,
                centerX,
                centerY,
                param.pointR * param.rate,
                param.pointLWidth * param.rate,
                param.pointColor,
                RENDERER.getLineColor(lineIndex));
            }
            RENDERER.drawText(
              RENDERER.cxt,
              nameX,
              nameY,
              staPos[i].name,
              RENDERER.getColor(param.textColor, param.colorList[lineIndex].a),
              param.baseFont * param.rate);
          }
        }
      },
      /***
       * 画点
       * @param context
       * @param x 坐标x
       * @param y 坐标y
       * @param r 点半径
       * @param lineWidth 边线宽度
       * @param fillColor 填充颜色
       * @param strokeColor 边线颜色
       */
      drawPoint: function (context, x, y, r, lineWidth, fillColor, strokeColor) {
        context.beginPath();
        context.lineWidth = lineWidth;//设置线宽
        context.arc(x, y, r, 0, 360, false);
        context.shadowBlur = 0;
        context.shadowColor = "transparent";
        context.fillStyle = fillColor;//填充颜色
        context.strokeStyle = strokeColor; //线颜色
        context.fill(); //画实心圆
        context.stroke();//画空心圆
        context.closePath();
      },

      /***
       * 画闪烁点
       * @param context
       * @param x 坐标x
       * @param y 坐标y
       * @param r 点半径
       * @param lineWidth 边线宽度
       * @param fillColor 填充颜色
       * @param strokeColor 边线颜色
       */
      drawBlinkPoint: function (context, x, y, r, lineWidth, fillColor, strokeColor, station) {
        if (station.hasOwnProperty('date')) {
          if (!station.hasOwnProperty('blur')) {
            station.blur = false;
          }
          if (parseInt(Date.now()) - station.date > 200) {
            station.blur = !station.blur;
            station.date = Date.now();
          }
        } else {
          station.date = Date.now();
        }
        context.beginPath();
        context.lineWidth = lineWidth;//设置线宽
        context.arc(x, y, r, 0, 360, false);
        context.shadowBlur = station.blur ? 10 : 0;
        context.shadowColor = "red";
        context.fillStyle = fillColor;//填充颜色
        context.strokeStyle = strokeColor; //线颜色
        context.fill(); //画实心圆
        context.stroke();//画空心圆
        context.closePath();
      },

      /***
       * 画线
       * @param context
       * @param x 起点坐标x
       * @param y 起点坐标y
       * @param nx 终点坐标x
       * @param ny 终点坐标y
       * @param lineWidth 边线宽度
       * @param color 线的颜色
       * @param bezier 贝塞尔曲线参数
       */
      drawLine: function (context, x, y, nx, ny, lineWidth, color, bezier) {
        context.strokeStyle = color;//线条颜色：绿色
        context.lineWidth = lineWidth;//设置线宽
        context.shadowBlur = 0;
        context.shadowColor = "transparent";
        if (bezier) {
          context.beginPath();
          context.moveTo(x, y);
          var bx = RENDERER.getPoint(bezier.x, centerPoint.cx);
          var by = RENDERER.getPoint(bezier.y, centerPoint.cy);
          if (bezier.hasOwnProperty('x2')) {
            var bx2 = RENDERER.getPoint(bezier.x2, centerPoint.cx);
            var by2 = RENDERER.getPoint(bezier.y2, centerPoint.cy);
            context.bezierCurveTo(bx, by, bx2, by2, nx, ny);
          } else {
            context.quadraticCurveTo(bx, by, nx, ny);
          }
          context.stroke();//画线框
          context.closePath();
        } else {
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(nx, ny);
          context.stroke();//画线框
          context.fill();//填充颜色
          context.closePath();
        }

      },
      /***
       * 画双线
       * @param context
       * @param x 起点坐标x
       * @param y 起点坐标y
       * @param nx 终点坐标x
       * @param ny 终点坐标y
       * @param lineWidth 两线间距 包括线本身
       * @param color 线的颜色
       * @param bezier 贝塞尔曲线参数
       */
      drawDBLine: function (context, x, y, nx, ny, lineWidth, color, bezier) {
        var offset = lineWidth / 2.0 * 0.707;
        var x1, y1, x2, y2, nx1, nx2, ny1, ny2;
        var bx1, by1, bx2, by2, bxt1, bxt2, byt1, byt2;//两个过渡点  可能只有一个
        context.strokeStyle = color;//线条颜色：绿色
        context.lineWidth = 1;//设置线宽
        context.shadowBlur = 0;
        context.shadowColor = "transparent";
        if (bezier) {
          var bx = RENDERER.getPoint(bezier.x, centerPoint.cx);
          var by = RENDERER.getPoint(bezier.y, centerPoint.cy);
          if (bezier.hasOwnProperty('x2')) {
            var bxt = RENDERER.getPoint(bezier.x2, centerPoint.cx);
            var byt = RENDERER.getPoint(bezier.y2, centerPoint.cy);
          }

          if ((x - nx < 0 && y - ny < 0) || (x - nx > 0 && y - ny > 0)) {
            x1 = x + offset;
            nx1 = nx + offset;
            y1 = y - offset;
            ny1 = ny - offset;
            x2 = x - offset;
            nx2 = nx - offset;
            y2 = y + offset;
            ny2 = ny + offset;

            bx1 = bx + offset;
            by1 = by - offset;
            bx2 = bx - offset;
            by2 = by + offset;
            if (bezier.hasOwnProperty('x2')) {
              bxt1 = bxt + offset;
              byt1 = byt - offset;
              bxt2 = bxt - offset;
              byt2 = byt + offset;
            }

          } else {//右上 左下
            x1 = x - offset;
            nx1 = nx - offset;
            y1 = y - offset;
            ny1 = ny - offset;
            x2 = x + offset;
            nx2 = nx + offset;
            y2 = y + offset;
            ny2 = ny + offset;

            bx1 = bx - offset;
            by1 = by - offset;
            bx2 = bx + offset;
            by2 = by + offset;
            if (bezier.hasOwnProperty('x2')) {
              bxt1 = bxt - offset;
              byt1 = byt - offset;
              bxt2 = bxt + offset;
              byt2 = byt + offset;
            }
          }
          if (bezier.hasOwnProperty('x2')) {
            context.beginPath();
            context.moveTo(x1, y1);
            context.bezierCurveTo(bx1, by1, bxt1, byt1, nx1, ny1);
            context.stroke();//画线框
            context.closePath();

            context.beginPath();
            context.moveTo(x2, y2);
            context.bezierCurveTo(bx2, by2, bxt2, byt2, nx2, ny2);
            context.stroke();//画线框
            context.closePath();
          } else {
            context.beginPath();
            context.moveTo(x1, y1);
            context.quadraticCurveTo(bx1, by1, nx1, ny1);
            context.stroke();//画线框
            context.closePath();

            context.beginPath();
            context.moveTo(x2, y2);
            context.quadraticCurveTo(bx2, by2, nx2, ny2);
            context.stroke();//画线框
            context.closePath();
          }
        } else {
          //水平或竖直的情况
          if (x == nx || y == ny) {
            offset = lineWidth / 2.0;
            context.beginPath();
            context.moveTo(x + offset, y + offset);
            context.lineTo(nx + offset, ny + offset);
            context.stroke();//画线框
            context.fill();//填充颜色
            context.closePath();

            context.beginPath();
            context.moveTo(x - offset, y - offset);
            context.lineTo(nx - offset, ny - offset);
            context.stroke();//画线框
            context.fill();//填充颜色
            context.closePath();
          } else {//斜线的情况
            // 两个点 左上或右下的关系
            if ((x - nx < 0 && y - ny < 0) || (x - nx > 0 && y - ny > 0)) {
              x1 = x + offset;
              nx1 = nx + offset;
              y1 = y - offset;
              ny1 = ny - offset;
              x2 = x - offset;
              nx2 = nx - offset;
              y2 = y + offset;
              ny2 = ny + offset;
            } else {//右上 左下
              x1 = x - offset;
              nx1 = nx - offset;
              y1 = y - offset;
              ny1 = ny - offset;
              x2 = x + offset;
              nx2 = nx + offset;
              y2 = y + offset;
              ny2 = ny + offset;
            }
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(nx1, ny1);
            context.stroke();//画线框
            context.fill();//填充颜色
            context.closePath();

            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(nx2, ny2);
            context.stroke();//画线框
            context.fill();//填充颜色
            context.closePath();
          }
        }

      },
      /***
       * 画文字
       * @param context
       * @param x 坐标x
       * @param y 坐标y
       * @param text 文本
       * @param color 文本颜色
       * @param size 字号
       */
      drawText: function (context, x, y, text, color, size) {
        context.fillStyle = color;
        context.shadowBlur = 0;
        context.shadowColor = "transparent";
        context.font = size + "px Microsoft YaHei";
        context.fillText(text, x, y);
      },
      /***
       * 根据颜色表获取对应地铁线路颜色
       * @param index 线路id
       * @returns {string}
       */
      getLineColor: function (index) {
        return 'rgba(' + param.colorList[index].r + ',' + param.colorList[index].g + ',' + param.colorList[index].b + ',' + param.colorList[index].a + ')';

      },
      /***
       * 获取在canvas上的点坐标
       * 其实就是和中心点做运算
       * @param point 坐标x 或 坐标y
       * @param centerPoint 中心点 坐标x 或 坐标y
       * @returns {Number} 坐标x 或 坐标y
       */
      getPoint: function (point, centerPoint) {
        return parseInt((parseFloat(point) - parseFloat(centerPoint) + param.position) * param.rate);
      },
      /***
       * 设置canvas尺寸
       * @param rate 缩放倍率
       */
      setCanvasSize: function (rate) {
        $('#myCanvas').attr('width', param.canvasWidth * rate);
        $('#myCanvas').attr('height', param.canvasHeight * rate);
        $('#content').css('width', param.canvasWidth * rate + 'px');
        $('#content').css('height', param.canvasHeight * rate + 'px');
      },
      getColor: function (color, a) {
        return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + a + ')';

      }
    }
  }();

  /**
   * 切换线路
   */
  function chooseLine() {
    var _this = event.target;
    var lineId = _this.id.split('_')[1];
    if ($(_this).attr('rel') == '0') {
      chooseLineList[lineId] = '1';
      $(_this).attr('rel', '1');
      $(_this).addClass('choose');
    } else {
      chooseLineList[lineId] = '0';
      $(_this).attr('rel', '0');
      $(_this).removeClass('choose');
    }
    var hasChoose = false;
    for (var i in param.colorList) {
      if (chooseLineList.hasOwnProperty(i) && chooseLineList[i] == 1) {
        param.colorList[i].a = param.showAlpha;
        hasChoose = true;
      } else {
        param.colorList[i].a = param.hideAlpha;
      }
    }
    if (!hasChoose) {
      for (var j in param.colorList) {
        param.colorList[j].a = '1';
      }
    }
  }

  /***
   * 放大缩小
   * @param isAdd 是否放大
   */
  function scaleMap() {
    if ($(event.target).attr('rel') == 1) {
      if (param.rate >= 2) {
        return
      }
      var scale = $('#content').css('zoom');
      if (scale != 'none') {
        scale = parseFloat($('#content').css('zoom'));
      } else {
        scale = param.initZoom;
      }
      if (param.rate < param.initRate) {
        scale += param.stepSize;
        $('#content').css('zoom', scale);
      } else if (param.rate > param.initRate) {
        param.rate += param.stepSize;
        RENDERER.setCanvasSize(param.rate);
      } else {
        if (scale < param.initZoom) {
          scale += param.stepSize;
          $('#content').css('zoom', scale);
        } else {
          param.rate += param.stepSize;
          RENDERER.setCanvasSize(param.rate);
          $('#content').css('zoom', param.initZoom);
        }
      }
    } else {
      var scale = $('#content').css('zoom');
      if (scale != 'none') {
        scale = parseFloat($('#content').css('zoom'));
      } else {
        scale = param.initZoom;
      }
      if (scale <= 0.25) {
        return;
      }
      if (param.rate > param.initRate) {
        param.rate -= param.stepSize;
        RENDERER.setCanvasSize(param.rate);
      } else if (param.rate < param.initRate) {
        console.log(scale);
        scale -= param.stepSize;
        $('#content').css('zoom', scale);
      } else {
        param.rate = param.initRate;
        RENDERER.setCanvasSize(param.rate);
        scale -= param.stepSize;
        $('#content').css('zoom', scale);
      }
    }
    $('.mask').html('');
    for (i in staPos) {
      //获取所在线路
      var centerX = RENDERER.getPoint(staPos[i].cx, centerPoint.cx);
      var centerY = RENDERER.getPoint(staPos[i].cy, centerPoint.cy);
      $('.mask').append('<div class="point" style="left: ' + centerX + 'px;top: ' + centerY + 'px;" ></div>');

    }
  }

  /***
   * 切换单线双线模式
   */
  function switchMode() {
    $(event.target).text(param.lineMode ? '双线模式' : '单线模式');
    param.lineMode = !param.lineMode;
  }

  RENDERER.init();
//给线路标识添加点击事件
  for (var i in param.colorList) {
    $('#b_' + i).click(chooseLine);
  }

  $('#scaleBtnAdd').click(scaleMap);
  $('#scaleBtnDec').click(scaleMap);
  $('#modeBtn').click(switchMode);

  staPos['s_1001002'].isBusy = true;
  staPos['s_1001014'].isBusy = true;
  staPos['s_1001013'].isBusy = true;
  staPos['s_1005009'].isBusy = true;
  staPos['s_1001018'].isBusy = true;
  staPos['s_1004015'].isBusy = true;
  staPos['s_1002019'].isBusy = true;
  staPos['s_1002006'].isBusy = true;

  staPos['s_1001021'].isBusy = true;
  staPos['s_1006014'].isBusy = true;
  staPos['s_1002014'].isBusy = true;
  staPos['s_1002010'].isBusy = true;


})($, point.pointUnique, point.centerPoint);
