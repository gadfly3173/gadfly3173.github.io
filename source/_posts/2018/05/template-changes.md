---
title: 记录一下对模板和hexo做过的改动
layout: post
date: 2018-05-18 00:04:46
categories: 建站
tags:
- 备份
- 建站
- HTML
- CSS
- JS
- 纪实
permalink:

---
### 背景

在./themes/material/layout/layout.ejs 的``<body>``中加入

```ejs
<canvas id="tinyball-canvas" style="position:fixed;z-index:-99;display:block;">你这是什么垃圾浏览器，这都不能显示(╯‵□′)╯︵┻━┻</canvas>
<%- jsLsload({path:('js/tiniballs.js'),key:'tiniballs_js'}) %>
```

tiniballs.js 存放于./themes/material/source/js/中，内容如下：

```javascript
var WIDTH = window.innerWidth, HEIGHT = window.innerHeight, POINT = 15;

var canvas = document.getElementById('tinyball-canvas');
WIDTH = canvas.width = window.innerWidth;
HEIGHT = canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
context.strokeStyle = 'rgba(0,0,0,0.02)',
    context.strokeWidth = 1,
    context.fillStyle = 'rgba(0,0,0,0.05)';
var circleArr = [];

function Line(x, y, _x, _y, o) {
    this.beginX = x,
        this.beginY = y,
        this.closeX = _x,
        this.closeY = _y,
        this.o = o;
}

function Circle(x, y, r, moveX, moveY) {
    this.x = x,
        this.y = y,
        this.r = r,
        this.moveX = moveX,
        this.moveY = moveY;
}

function num(max, _min) {
    var min = arguments[1] || 0;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function drawCricle(cxt, x, y, r, moveX, moveY) {
    var circle = new Circle(x, y, r, moveX, moveY)
    cxt.beginPath()
    cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
    cxt.closePath()
    cxt.fill();
    return circle;
}

function drawLine(cxt, x, y, _x, _y, o) {
    var line = new Line(x, y, _x, _y, o)
    cxt.beginPath()
    cxt.strokeStyle = 'rgba(0,0,0,' + o + ')'
    cxt.moveTo(line.beginX, line.beginY)
    cxt.lineTo(line.closeX, line.closeY)
    cxt.closePath()
    cxt.stroke();

}

function init() {
    circleArr = [];
    for (var i = 0; i < POINT; i++) {
        circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10) / 40, num(10, -10) / 40));
    }
    draw();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < POINT; i++) {
        for (var j = 0; j < POINT; j++) {
            if (i + j < POINT) {
                var A = Math.abs(circleArr[i + j].x - circleArr[i].x),
                    B = Math.abs(circleArr[i + j].y - circleArr[i].y);
                var lineLength = Math.sqrt(A * A + B * B);
                var C = 1 / lineLength * 7 - 0.009;
                var lineOpacity = C > 0.03 ? 0.03 : C;
                if (lineOpacity > 0) {
                    drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i + j].x, circleArr[i + j].y, lineOpacity);
                }
            }
        }
    }
    for (var i = 0; i < POINT; i++) {
        drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
    }
}

$(document).ready(function () {
    init();
    setInterval(function () {
        for (var i = 0; i < POINT; i++) {
            var cir = circleArr[i];
            cir.x += cir.moveX;
            cir.y += cir.moveY;
            if (cir.x > WIDTH) cir.x = 0;
            else if (cir.x < 0) cir.x = WIDTH;
            if (cir.y > HEIGHT) cir.y = 0;
            else if (cir.y < 0) cir.y = HEIGHT;

        }
        draw();
    }, 16);
})
```

### ~~首行缩进(deprecated)~~

将./node_modules/marked/lib/marked.js 中的``Renderer.prototype.br = function()``部分修改为

```javascript
Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '</p><p>';
};
```

这样可以保证每个文章的 md 中的换行符被转义为``<p>``标签。
然后，将``./themes/material/source/css/style.min.css``中的``#post-content p``部分修改为

```css
#post-content p{
  font-size: 15px;
  line-height: 1.7;
  overflow: hidden;
  text-indent: 2em
}
```

这样，所有使用了 post-content 这个 class 的父元素中的 p 标签都会首行缩进两个字符。但是这样也影响了代码块。可以在``style.min.css``继续修改，也可以在``./themes/material/layout/_partial/config_css.ejs``中的``<!-- Other Styles -->``后的``<style>``标签中加上

```css
pre{
  text-indent: 0em;
}
```

### Slogan/欢迎语

我使用了 Hitokoto（一言·纯净）的 API，将``./themes/material/_config.yml``中的``uiux``部分的``slogan``属性修改为

```html
slogan: <div id="hitokoto" style="text-shadow:2px 2px 4px rgb(51,51,51);">一言·Hitokoto</div><script async type="text/javascript" src="https://v1.hitokoto.cn/?encode=js&select=%23hitokoto"></script>
```

### 首图/每日一图

在主题的`_config.yml`中

```yaml
# Jump Links Settings
url:
    rss: /atom.xml
    daily_pic: https://www.bing.com/gallery/
    logo:
```

### 发布

为了可以通过``hexo d -g``命令直接发布到我的 Github，需要将``./_config.yml``中的``# Deployment``部分修改为

```yml
deploy:
  type: git
  repo:
    github: git@github.com:gadfly3173/gadfly3173.github.io.git
  branch: master
```

### 代码高亮

为了使用 PrismJs，需要先下载对应的 CSS，然后在`./themes/material/layout/_partial/head.ejs`中添加

```ejs
    <!-- PrismJS -->
    <%- cssLsload('css/prism.tomorrow-night.full.min.css') %>
```

并删除主题的`pre`标签的 css
