---
title: 当机场屏蔽了 22 端口：SSH over HTTPS
layout: post
typora-root-url: ..
hide_post_info: false
date: 2026-02-03 11:36:22
categories:
  - 开发
  - SSH
tags:
  - SSH
  - GitHub
  - GitLab
  - 代理
  - 机场
permalink:
---

最近次元链接等一些机场开始屏蔽 22 端口，导致无法通过 SSH 协议访问 GitHub/GitLab 等代码托管平台。遇到这种情况，可以使用 SSH over HTTPS 功能，通过 443 端口来连接 SSH 服务，从而绕过端口屏蔽的问题。

<!-- More -->

SSH 默认用的是 22 端口，但 GitHub 和 GitLab 其实都提供了 HTTPS 端口（443）的 SSH 服务，专门用来应付这种情况。改一下 SSH 配置就能解决。

## GitHub

GitHub 的 SSH over HTTPS 地址是 `ssh.github.com`，配置如下：

```bash
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
```

## GitLab

GitLab 的叫法有点不一样，叫 Alt SSH，地址是 `altssh.gitlab.com`：

```bash
Host gitlab.com
    Hostname altssh.gitlab.com
    Port 443
    User git
```

## 完整配置

顺便加个全局的连接超时，避免卡住太久：

```bash
~/.ssh/config
Host *
    ConnectTimeout 5

Host github.com
    Hostname ssh.github.com
    Port 443
    User git

Host gitlab.com
    Hostname altssh.gitlab.com
    Port 443
    User git
```

改完直接 `git push` 就能用了，SSH 协议还是那个 SSH，只是换了条路走而已。

## 验证

想确认一下配置有没有生效，可以这么测：

```bash
# GitHub
ssh -T git@github.com

# GitLab
ssh -T git@gitlab.com
```

能看到对应的欢迎信息就没问题了。

---

顺带一提，如果你用的是自建 GitLab 或 Gitea 等平台，也可以自己在 Nginx/反向代理层把 SSH 流量代理一下，原理是一样的。
