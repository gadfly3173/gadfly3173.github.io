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
hide_post_info: false
---
记录一下 Electron 踩坑
<!-- More -->
## 空项目 SSL 握手异常

```log
[6104:0223/170435.000:ERROR:ssl_client_socket_impl.cc(983)] handshake failed; returned -1, SSL error code 1, net_error -101
```

原因是 Electron 默认开启 DoH，使用的是`https://chrome.cloudflare-dns.com/`。然而这东西在国内当然是会随时抽风的。Electron 文档内提到可以配置`app.configureHostResolver`，~~但是一旦配置就会起不来，只能等 Electron 更新了。~~`app.configureHostResolver`必须在 ready 事件出发后设置，否则会报错。

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

## NSIS 安装、卸载程序执行时关闭正在运行的应用

NSIS 默认情况下不会在执行时关闭正在运行的应用，并且不会报错。。。好在 electron-builder 提供了自行修改 nsh 的功能，可以自行编写以下脚本，通过 electron-builder 的 include 配置注入。

```nsh
; http://bcoder.com/others/kill-process-when-install-or-uninstall-programs-by-the-package-made-by-nsis
; https://www.electron.build/configuration/nsis#custom-nsis-script
; This callback will be called when the installer is nearly finished initializing. If the '.onInit' function calls Abort, the installer will quit instantly
!macro customInit
  ; File /oname=$PLUGINSDIR\KillProcDLL.dll "${BUILD_RESOURCES_DIR}\KillProcDLL.dll"
  ${nsProcess::KillProcess} "${PRODUCT_FILENAME}.exe" $R0
!macroend

; This callback will be called when the uninstaller is nearly finished initializing. If the 'un.onInit' function calls Abort, the uninstaller will quit instantly. Note that this function can verify and/or modify $INSTDIR if necessary.
!macro customUnInit
  ; File /oname=$PLUGINSDIR\KillProcDLL.dll "${BUILD_RESOURCES_DIR}\KillProcDLL.dll"
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "是否确认卸载 ${SHORTCUT_NAME} 及其所有组件?" IDYES NoAbort IDYES +2
  Abort
  NoAbort:
    ${nsProcess::KillProcess} "${PRODUCT_FILENAME}.exe" $R0
!macroend
```

## 启动时最大化窗口

需要创建窗口时设置`show: false`，然后捕获`ready-to-show`事件，进行最大化和显示的处理。直接最大化会出现窗口不在最上面的问题，因此需要在最大化之前设置窗口在顶部，最后再取消该设置。

```typescript
  mainWindow = new BrowserWindow({
    show: false,
    // ...
  })
  // 初始最大化
  mainWindow.once('ready-to-show', () => {
    const win = mainWindow as BrowserWindow
    win.setAlwaysOnTop(true)
    win.maximize()
    win.show()
    win.setAlwaysOnTop(false)
  })
```

## 关闭窗口时二次确认

为避免用户误操作关闭窗口丢失数据，需要在关闭窗口时二次确认。这是调用 electron 默认 dialog 的方式，如果需要结合渲染层，需要另外进行 IPC 调用。

```typescript
  mainWindow.on('close', async e => {
    // 阻止默认行为，一定要有
    e.preventDefault()
    const { response } = await dialog.showMessageBox({
      type: 'info',
      title: '关闭确认',
      defaultId: 0,
      message: '确定要关闭应用吗？',
      buttons: ['确定', '取消'],
    })
    if (response === 0) {
      mainWindow = null
      // 不要用quit() 会弹两次
      // exit()直接关闭客户端，不会执行quit();
      app.exit()
    }
  })
```
