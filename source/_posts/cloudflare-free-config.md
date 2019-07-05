---
title: Cloudflare免费版设置笔记
layout: post
date: 2019-07-05 15:50:53
categories: 技术
tags:
- Cloudflare
- CDN
- 配置
- 笔记
permalink:
visible:
thumbnail: https://uploader.shimo.im/f/ry3pIWEbWAs7Fm5B.png
---
![图片](https://uploader.shimo.im/f/ry3pIWEbWAs7Fm5B.png)
首先当然是到这里（[https://www.cloudflare.com](https://www.cloudflare.com)）来登录/注册。注册很简单，一个邮箱就行了。然后他会给你发一封确认邮件，确认完成即可进行配置。
然后会提示你输入你的域名，这时输入不带子域名的域名即可，如我的是`gadfly.vip`，然后点击`add site`即可，它会自动扫描你已经存在的DNS解析记录，不过有可能解析不全。接下来它会让你把你的DNS服务器改成他给你提供的。每个人的DNS服务器不一定一样，按照网页上给你提供的去修改即可。
### 点击上面的DNS标签后即可打开这个页面
![图片](https://uploader.shimo.im/f/JqPSWgoD5RYn0wdw.png)
其中橙黄色的云朵表示使用CDN，灰色的表示不使用。Cloudflare不支持在根域名下同时绑定MX记录和A记录，配置时需要注意。
### Crypto标签中的设置用于配置SSL相关内容。
![图片](https://uploader.shimo.im/f/XZRljEOSqxkklYYa.png)
Cloudflare提供了三种SSL模式
* Flexible - 用户至Cloudflare为HTTPS加密传输，Cloudflare至服务器为HTTP传输
* Full - 两端均为HTTPS加密传输，服务器端可以使用自己签名的证书
* Full（Strict）- 两端均为HTTPS加密传输，且服务器端必须使用可信任的证书

![图片](https://uploader.shimo.im/f/UShcOveokHwkZ5Vr.png)
origin certificates可以通过cloudflare生成一份可信任的SSL证书并下载，可以安装到服务器上。
Always Use HTTPS用于强制HTTPS访问。
HSTS是告诉浏览器网站只通过HTTPS访问，防止有攻击者拦截用户通过HTTP访问的请求。个人觉得开启会更好。
![图片](https://uploader.shimo.im/f/AmaIOEoCxNgnRmJa.png)
这些全开着就完事了，最小TLS版本建议低一点，要不然垃圾浏览器就打不开了。
![图片](https://uploader.shimo.im/f/e6bwW5OrXEApImyP.png)
TLS1.3开着，自动HTTPS重写是把你网页上的http链接全都转成https，如果你网站上有些资源没法走https的话，那还是别开了
### Speed里这些都开着吧
![图片](https://uploader.shimo.im/f/5GjX3IJ9VYEeqmX6.png)
![图片](https://uploader.shimo.im/f/7K7ylRrrxjA1daiq.png)
![图片](https://uploader.shimo.im/f/LE4tFz8WyEMIXI73.png)
