---
title: dotnet sdk/runtime 10 在 类 Debian/Ubuntu 环境下安装的临时修复
layout: post
typora-root-url: ..
hide_post_info: false
date: 2025-11-25 15:18:54
categories:
- 系统
- 开发
- Linux
tags:
- dotnet
- Linux
- Debian
- Ubuntu
- apt
- 依赖修复
permalink:
---
抽象的微软前两年对 dotnet 的 apt 源进行了调整，
> 从 Ubuntu 22.04 开始，Microsoft 不再将适用于 Ubuntu 的 .NET 分发到 Microsoft 软件包存储库。

而它自己对官方 Debian 源的维护进入了只要 Debian 能跑，其他系统不管死活的状态，之前为了 dotnet 8 在 ubuntu 24 还能不能继续用官方 Debian 源的问题纠结了几个月： https://github.com/dotnet/sdk/issues/40506 。现在 dotnet 10 发布了，又出现了类似的问题（有人直接在这个 issue 里提了），因为 sb 微软把 `dotnet-runtime-deps-10.0` 里的 libicu 依赖变成了只有 78、77、76、72，中间的 74 被跳掉了。显然 `libicu` 这些小版本对于 dotnet 来说都是支持的，而我使用的 Deepin V25 正好只有 `libicu74`。这个问题我也提了个issue: https://github.com/dotnet/runtime/issues/121829

显然不能指望微软极低的工作效率，我的解决方案是创建一个 `libicu78` 的虚拟包，这样 apt 就不会阻止我通过微软的 debian 源安装和升级了。

```bash
# 1. 安装 equivs（若未安装）
sudo apt update && sudo apt install -y equivs

# 2. 创建虚拟包声明 libicu78（选一个缺失但最高的版本，如 78）
equivs-control libicu78.control

# 编辑控制文件
cat > libicu78.control <<EOF
Section: misc
Priority: optional
Standards-Version: 3.9.2

Package: libicu78
Version: 74.2-1+dummy
Maintainer: homolo <homolo@example.com>
Provides: libicu78
Description: Dummy package to satisfy dotnet-runtime-deps-10.0 dependency
 This is a dummy package that claims to provide libicu78,
 while the actual implementation is libicu74 (which is ABI-compatible).
EOF

# 3. 构建并安装虚拟包
equivs-build libicu78.control
sudo dpkg -i libicu78_74.2-1+dummy_all.deb

# 4. 现在再尝试安装 dotnet-sdk-10.0
sudo apt update
sudo apt install dotnet-sdk-10.0
```