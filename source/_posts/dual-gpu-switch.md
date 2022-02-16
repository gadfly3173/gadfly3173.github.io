---
title: 双显卡切换？独显输出核显渲染？
layout: post
date: 2018-07-31 10:09:53
categories: 电脑
tags:
- 显卡
- 独显
- 核显
- 切换
permalink:
hide_post_info:
---
用台式机时，Intel用户可能会发现一件很尴尬的事情，那就是CPU里的核显在使用独显时几乎没有用。那么有什么办法可以让核显来替独显分担，降低功耗呢？
要达到这样的目的，我们需要先在BIOS里让核显运行。在我的微星主板的BIOS里就是`内建显示配置`->`集成显卡多显示器`->`允许`即可。
然后在Windows中，打开 <https://downloadcenter.intel.com/zh-cn/product/80939/-> ，在里面下载对应CPU的驱动。
接着，在桌面右键->`显示设置`->`图形设置`->`浏览`，选择你需要用核显运行的程序，点击`选项`，选择节能。通过这样的操作之后，我们就可以指定特定的程序通过核显运行，也能在OBS中使用Intel QuickSync编码器来进行编码，极大提升硬件资源利用率。
详见视频： [https://www.bilibili.com/video/av28150115/](https://www.bilibili.com/video/av28150115/)

<iframe src="//player.bilibili.com/player.html?aid=28150115&cid=48650182&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" height="100%"> </iframe>

![图片](/images/posts/2018/07/psb.gif)

