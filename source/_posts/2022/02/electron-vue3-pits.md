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
<!-- More -->
## 空项目 SSL 握手异常

```log
[6104:0223/170435.000:ERROR:ssl_client_socket_impl.cc(983)] handshake failed; returned -1, SSL error code 1, net_error -101
```

原因是 Electron 默认开启 DoH，使用的是`https://chrome.cloudflare-dns.com/`。然而这东西在国内当然是会随时抽风的。
Electron 文档内提到可以配置`app.configureHostResolver`，~~但是一旦配置就会起不来，只能等 Electron 更新了。~~
`app.configureHostResolver`必须在 ready 事件出发后设置，否则会报错。

## 单实例

正常情况下 Electron 是可以多实例启动的，现在需要保证单实例启动。在主进程里进行如下配置

```typescript
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

// 此方法的返回值表示你的应用程序实例是否成功取得了锁。 如果它取得锁失败，你可以假设另一个应用实例已经取得了锁并且仍旧在运行，并立即退出。
const gotTheLock = app.requestSingleInstanceLock()
let mainWindow: BrowserWindow
// 如果我的应用已经存在，那么就退出当前的进程
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // 当运行第二个实例时,将会聚焦到 mainWindow 这个窗口
    if (mainWindow) {
      // 先从托盘呼出
      mainWindow.show()
      // 然后放大
      if (mainWindow.isMinimized()) mainWindow.restore()
      // 最后聚焦
      mainWindow.focus()
    }
  })

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {
    // 正常启动
  })
}
```
