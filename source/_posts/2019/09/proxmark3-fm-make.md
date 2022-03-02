---
title: proxmark3 固件编译
layout: post
date: 2019-09-26 22:04:26
categories: 开发
tags:
- 固件
- 编译
- 单片机
permalink:
hide_post_info:
---
我们知道在 Github 上有 proxmark3 的最新固件，今天聊一聊在 windows 下如何编译固件源码并刷入 proxmark3。
<!--More-->
pm3 的固件基本由 c 语言构成，在 windows 下进行编译存在一定的难度，好在 GitHub 上早有大神针对其制作的脚本，可以轻松地配置编译所需要的环境。

### 开发环境配置

这里我们使用的是[ProxSpace](https://github.com/Gator96100/ProxSpace),解压到合适的地方即可。
> ProxSpace is a collection of tools that are required to compile the firmware and client of the Proxmark III. At its core ProxSpace uses msys2. MSYS2 is a software distro and building platform for Windows, it provides a bash shell, Autotools, revision control systems and the like for building native Windows applications using MinGW-w64 toolchains. ProxSpace uses the GNU Arm Embedded Toolchain for compiling the Proxmark III firmware.

![](/images/posts/2019/09/proxspace.png)
然后准备 PM3 的源码：[Proxmark/proxmark3](https://github.com/Proxmark/proxmark3/)把他全部解压到 ProxSpace 的 pm3 文件夹中（没有的话就自己新建一个,如图即可）。
![](/images/posts/2019/09/pm3.png)

### 编译固件

双击打开`runme64.bat`（如果还是 32 位系统的话，则使用`runme.bat`），然后会开始自动配置环境，时间可能很长（视网速和本机性能而定），包括 MinGW、QT 之类的~~什么奇奇怪怪的东西~~，接着执行

```bash
make clean && make all
```

等待固件自动编译完成即可。

### 刷入固件

在刚才编译完的窗口中执行

```bash
./client/flasher comx -b ./bootrom/obj/bootrom.elf
./client/flasher comx ./armsrc/obj/fullimage.elf
```

其中 comx 代表 Proxmark 的端口号，根据本机情况修改 x 即可。如果刷完第一个 ELF 以后机器无反应或者掉线的话，拔掉数据线，按住机身按钮，再插上，不要松手，几秒钟后电脑就会识别到机器，然后再刷入第二个固件即可。第一个固件是 pm3 的 bootloader，第二个是完整镜像，更新固件需要全部刷入，并且需要先更新 bootloader 以防出错。如果在刷入第一个固件时就出现了刷到一半端口号改变的情况，则需要使用脚本对其强制多次刷入，可以参考以下脚本（存为 bat）自行修改制作。若脚本执行过程中依然执行不下去，则重新连接后再次启动即可。

```bash
@echo off
color 0a
MODE CON COLS=80 LINES=36
title ！！！！！！！！！！！！！！！！！注意！！！！！！！！！！！！！！！！！
echo.
echo.
echo.
echo                 ┏─────────────────────┓
echo                 │!!!!!!!!!!!!!!!!!!!注意!!!!!!!!!!!!!!!!!!!│
echo                 │─────────────────────│
echo                 │   请先关闭正在运行的GUI中文或英文软件    │
echo                 │   如果依然连接不上，缓慢走省略号表示     │
echo                 │   串口调用冲突，需要在任务管理器中关闭   │
echo                 │   "proxmark3.exe"进程 。并重启刷机程序   │
echo                 │                                          │
echo                 │   刷机过程中如果长时间等待超过一分钟无   │
echo                 │   反应，不要关闭窗口，按住按钮不放，重新 │
echo                 │   拔插USB口即可强制刷入，直至升级完成    │
echo                 │   即可松开按钮！                         │
echo                 │                                          │
echo                 │                                          │
echo                 ┗─────────────────────┛
echo.
echo.
echo.
set num=
set /p num= 请输入【设备管理器—端口—Proxmark3】的串口号(例如"5"):

echo.
echo.

goto :all


:all
cls
title 正在烧写Proxmark3固件至[xxx固件],请等候片刻……
echo.
echo                 ┏────────────────────┓
echo                 │正在刷新 bootrom.elf,请等候片刻……     │
echo                 ┗────────────────────┛
echo.
.\client\flasher.exe com%num% -b  .\bootrom\obj\bootrom.elf
ping 127.0.0.1 -n 8 >nul
taskkill /f /im flasher.exe


:next
cls
echo.
echo                 ┏────────────────────┓
echo                 │正在刷新 fullimage.elf,请等候片刻……   │
echo                 ┗────────────────────┛
echo.
.\client\flasher.exe com%num%  .\armsrc\obj\fullimage.elf
ping 127.0.0.1 -n 3 >nul
taskkill /f /im flasher.exe
cls
title 恭喜Proxmark3-xxx固件成功升级！
echo.
echo.
echo                ┏──────────────────────┓
echo                │    恭喜您！ xxx出厂固件全部刷写完成！    │
echo                │                                            │
echo                │日行一善，善如春园之草，不见其长，日有所增; │
echo                │                                            │
echo                │日行一恶，恶如磨刀之石，不见其亏，日有所减! │
echo                │                                            │
echo                │                                   BinAry   │
echo                ┗──────────────────────┛
echo.
pause.
cls
MODE CON COLS=130 LINES=36
cmd.exe

```

而 proxspace 工作目录下的`.\pm3\client\proxmark3.exe`就是匹配最新固件的 pm3 的命令行客户端了。
