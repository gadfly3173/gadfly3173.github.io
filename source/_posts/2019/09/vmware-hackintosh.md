---
title: Vmware 安装黑苹果全记录
layout: post
date: 2019-09-20 17:05:09
categories:
- 纪实
tags:
- 纪实
- 系统
- 黑苹果
permalink:
hide_post_info:
---
由于学校有个 Ios 开发课程，不得不开始使用我最厌恶的 MACos。
<!--More-->
#### 安装过程

##### 首先 Google 一个 Vmware 出来装好

然后找一下合适的 MACos 镜像。我这边用的是：
百度网盘：链接: [https://pan.baidu.com/s/1Y-SAspAY-28pccir9JsDhA](https://pan.baidu.com/s/1Y-SAspAY-28pccir9JsDhA) 提取码: kegh
然后前往[https://github.com/DrDonk/unlocker](https://github.com/DrDonk/unlocker)下载 vmware-unlocker 以便解除 Vmware 对 MAC 虚拟机的限制

##### unlocker

关闭 vmware 的所有服务
解压并打开下载的 UnLocker 文件夹, 右键 win-install, 选择以管理员身份运行
![](/images/posts/2019/09/unlocker.webp)

##### 创建

打开 VMWare WorkStation, 点击创建新的虚拟机，选择自定义高级
![](/images/posts/2019/09/newVM.webp)

##### 选择虚拟机版本

![](/images/posts/2019/09/compatibility.webp)

##### 选择操作系统类型

![](/images/posts/2019/09/systemType.webp)
操作系统类型选择 Apple Mac OS X
版本选择你的镜像版本, 网盘中分享的是 Mac OS 10.13 版本
![](/images/posts/2019/09/continueInstall.webp)

##### 网络 NAT 即可，其他默认

新建磁盘，大小自己决定，建议使用**单个文件**而不是多个文件
![](/images/posts/2019/09/newDisk.webp)

##### 修正文件

打开你虚拟机存放的文件夹, 找到这个 vmx 扩展名的文件, 右键用记事本打开
![](/images/posts/2019/09/vmx.webp)
![](/images/posts/2019/09/vmxEdit.webp)
在这两个之间, 插入如下代码

```bash
smc.version = "0"
cpuid.0.eax = "0000:0000:0000:0000:0000:0000:0000:1011"
cpuid.0.ebx = "0111:0101:0110:1110:0110:0101:0100:0111"
cpuid.0.ecx = "0110:1100:0110:0101:0111:0100:0110:1110"
cpuid.0.edx = "0100:1001:0110:0101:0110:1110:0110:1001"
cpuid.1.eax = "0000:0000:0000:0001:0000:0110:0111:0001"
cpuid.1.ebx = "0000:0010:0000:0001:0000:1000:0000:0000"
cpuid.1.ecx = "1000:0010:1001:1000:0010:0010:0000:0011"
cpuid.1.edx = "0000:1111:1010:1011:1111:1011:1111:1111"
featureCompat.enable = "FALSE"
```

安装 MACos 的过程中可能会遇到找不到 vmware 分配的虚拟磁盘的情况，此时选择磁盘工具，对没有格式化的虚拟磁盘进行格式化即可

#### 更改分辨率

首先提高虚拟机设置中此处的分辨率
![](/images/posts/2019/09/fenbianlv.webp)
然后进入系统中，在终端输入：

```bash
1920*1080分辨率：
sudo nvram AC20C489-DD86-4E99-992C-B7C742C1DDA9:width=%80%07%00%00
sudo nvram AC20C489-DD86-4E99-992C-B7C742C1DDA9:height=%38%04%00%00

 3840*2160分辨率：
sudo nvram AC20C489-DD86-4E99-992C-B7C742C1DDA9:width=%00%0F%00%00
sudo nvram AC20C489-DD86-4E99-992C-B7C742C1DDA9:height=%70%08%00%00
```

解释：
width=%00%0F%00%00 是宽度的 16 进制表示，将四个数字倒过来写就是 00 00 0f 00, 相当于十进制的 3840
height=%70%08%00%00 是高度的 16 进制表示，将四个数字倒过来写就是 00 00 08 70, 相当于十进制的 2160
所以，上面的两条命令执行完之后，分辨率将被设置为 3840*2160， 其他的分辨率依此类推

#### 参考资料

- [(AMD Ryzen, Inter)在 VMWare 中安装 Mac OS 10.13 High Sierra,黑苹果安装教程 - 简书](https://www.jianshu.com/p/4d83f2d51abe)
- [VMware15 安装 mac OS 10.14 分辨率调整为 1920*1080？_电脑基础_Dkukoc](https://www.dkukoc.com/post/226.html)
