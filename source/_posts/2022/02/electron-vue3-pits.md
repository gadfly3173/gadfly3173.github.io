---
title: Electron Vue3 踩坑笔记
layout: post
typora-root-url: ..
date: 2022-02-23 17:01:49
categories: Electron
tags:
  - Electron
  - Vue3
  - 前端
  - 客户端
permalink:
hide_post_info:
---
记录一下 Electron 踩坑

## 空项目SSL握手异常

```log
[6104:0223/170435.000:ERROR:ssl_client_socket_impl.cc(983)] handshake failed; returned -1, SSL error code 1, net_error -101
```

原因是 Electron 默认开启 DoH，使用的是`https://chrome.cloudflare-dns.com/`。然而这东西在国内当然是会随时抽风的。
Electron 文档内提到可以配置`app.configureHostResolver`，但是一旦配置就会起不来，只能等 Electron 更新了。
