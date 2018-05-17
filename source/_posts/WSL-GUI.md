---
title: 【纪实】WSL初探索 - 神奇的GUI
date: 2017-07-05 17:42:05
categories: 系统
tags:
- WSL
- X Server
- Windows
- Linux
- 子系统
- 虚拟机
- 纪实
---
>WSL真是一个神奇的小妖精啊=￣ω￣=

<!--more-->

前段时间为了体验一下win10的功能，在某人的安利下，我把我的老win7升级成了win10，然而，遇到了一大堆莫名其妙的权限问题。。。甚至都不能更新了。。。看着这坑爹玩意儿，我的内心仿佛有千万头草泥马奔过。。。
![](/images/posts/sticker/duzui.gif)
显然在这种莫名其妙的问题上浪费时间是没意思的，于是我果断重装(⊙v⊙)
果然，重装完成后，啥事也不用折腾了，按照正常步骤添加WSL就好了。在GoogleWSL配置过程的时候，我意外发现了一条新闻，讲的是在开发者大会上，有人让WSL显示了GUI。
![](/images/posts/sticker/huajidog.gif)
这么好玩的东西我怎么可以不玩呢？果断按照文章藐视，安装了Xming X Server，配置完bash后，在bash中输入
```bash
# DISPLAY=:0 firefox
```
firefox在这里仅作为一个例子，你可以用这个方法启动任何GUI应用\(^o^)/~
![](/images/posts/2017/07/firefox_bash.png)
哦对了，使用这个命令前，记得要启动X Server，否则会提示拒绝连接哦！