---
layout: post
title: 一个比较完美的网页模板
date: 2018-05-17 20:35:29
tags:
- HTML
- CSS
- 布局
- footer
- 网页
categories: 建站
thumbnail: /images/posts/2018/05/sticky-footer-1.svg
---
>在制作网页的时候，我们常常需要在页面中出现：HEADER、CONTENT和FOOTER三大部分，而如何让他们三个呆在自己该呆着的地方困扰着很多人。

<!--More-->

首先，我们网页的内容不是固定的，用户的窗口大小也是不固定的，我们希望当内容不多的时候，网页能撑满全屏而不溢出，内容足够多的时候，每个东西能依次排好而不互相重叠。
![](/images/posts/2018/05/sticky-footer-1.svg)
同时，为了满足一些需求，比如在页面上任意位置点击就能出现一些效果，我们需要整个页面被元素填满。

>当你设置一个页面元素的高度(height)为100%时，期望这样元素能撑满整个浏览器窗口的高度，但大多数情况下，这样的做法没有任何效果。

按常理，当我们用CSS的height属性定义一个元素的高度时，这个元素应该按照设定在浏览器的纵向空间里扩展相应的空间距离。例如，如果一个div元素的CSS是``height: 100px;``，那它应该在页面的竖向空间里占满100px的高度。
而根据W3C的规范，百分比的高度在设定时需要根据这个元素的父元素容器的高度来计算。所以，如果你把一个div的高度设定为``height: 50%;``，而它的父元素的高度是100px，那么，这个div的高度应该是50px。

### 那为什么 height:100%; 不起作用

当设计一个页面时，你在里面放置了一个div元素，你希望它占满整个窗口高度，最自然的做法，你会给这个div添加``height: 100%;``的css属性。如果你要是设置宽度为``width: 100%;``，那这个元素的宽度会立刻扩展到窗口的整个横向宽度。然而，高度也会这样吗？

>__错。__

为了理解为什么不会，我们需要理解浏览器是如何计算高度和宽度的。Web浏览器在计算有效宽度时会考虑浏览器窗口的打开宽度。如果你不给宽度设定任何缺省值，那浏览器会自动将页面内容平铺填满整个横向宽度。
但是高度的计算方式完全不一样。事实上，浏览器根本就不计算内容的高度，除非内容超出了视窗范围（导致滚动条出现）。或者你给整个页面设置一个绝对高度。否则，浏览器就会简单的让内容往下堆砌，页面的高度根本就无需考虑。
因为页面并没有缺省的高度值，所以，当你让一个元素的高度设定为百分比高度时，无法根据获取父元素的高度，也就无法计算自己的高度。换句话说，父元素的高度只是一个缺省值：``height: auto;``。当你要求浏览器根据这样一个缺省值来计算百分比高度时，只能得到``undefined``的结果。也就是一个``null``值，浏览器不会对这个值有任何的反应。
那么，如果想让一个元素的百分比高度``height: 100%;``起作用，你需要给这个元素的所有父元素的高度设定一个有效值。所以，你需要这样做：

```html
<html>
  <body>
    <div style="height: 100%;">
      <p>
        想让这个div高度为 100% 。
      </p>
    </div>
  </body>
</html>
```

现在你给了这个div的高度为100%，它有两个父元素\<body\>和\<html\>。为了让你的div的百分比高度能起作用，你必须设定\<body\>和\<html\>的高度。

```html
<html style="height: 100%;">
  <body style="height: 100%;">
    <div style="height: 100%;">
      <p>
        这样这个div的高度就会100%了
      </p>
    </div>
  </body>
</html>
```

接下来我们就可以解决让footer固定在底部的问题了。在查阅了很多资料之后，我选择了absolute定位，最终结果如下：
HTML：

```html
<div class="main">
    <div class="wrapper">
        <div class="header">...
        </div>
        <div class="content">...
        </div>
    </div>
    <div class="footer">...
    </div>
</div>
```

CSS：

```css
.footer {
    background-color: #ffffff;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60pt;
    z-index: 1;
}
.main {
    position: relative;
    min-height: 100%;
}
.wrapper {
    width: 100%;
    height: 100%;
    padding-bottom: 60pt;
}
.content{
    margin:auto;
    max-width:1200px;
html,
body { height: 100%; padding: 0; margin: 0; }
}
```

在这里面中，main是整个页面的容器，将其最小高度设为100%可以保证整个页面都被元素填满，既可以保证footer可以通过``bottom: 0;``放在页面底部，也可以实现一些前文中提高的有趣功能。在<https://tools.gadfly.vip>（我的工具箱网站）中可以体验一下，在它的页面上随意点击，会随机出现一些文字。
