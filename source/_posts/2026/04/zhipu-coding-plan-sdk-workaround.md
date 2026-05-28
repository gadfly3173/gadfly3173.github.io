---
title: 智谱 1302 限流之谜：一个逗号引发的血案
layout: post
typora-root-url: ..
hide_post_info: false
date: 2026-04-13 12:00:00
categories:
  - 开发
  - Claude
tags:
  - Claude
  - 智谱
  - Agent SDK
  - 踩坑
permalink:
---

通过 Claude Agent SDK 调用 Claude Code 时，系统提示词会变成：

`You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK.`

或者：

`You are a Claude agent, built on Anthropic's Claude Agent SDK.`

而智谱要求系统提示词**必须**开头为：

`You are Claude Code, Anthropic's official CLI for Claude.`

否则可能会遇到以下错误：

<!-- More -->

```json
{"error":{"code":"1302","message":"您的账户已达到速率限制，请您控制请求频率"},"request_id":"2026041314372115099c8b3a024339"}
```

这个 1302 看着像限流，其实不是。在这之前我已经把 SDK 的 UA 伪装过了（因为 a➕官方说后面可能不让 SDK 用户用订阅了），结果还是遇到了这个问题。拿 Reqable 抓包之后丢给 GLM-5.1 问了问，说是可能 system prompt 有问题，替换掉之后果然就能用了 :rofl:

解决方法很简单，找到 `node_modules/@anthropic-ai/claude-agent-sdk/cli.js`，把里面那两个命中不了规则的提示词字符串换了就行：

```diff
- "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."
- "You are a Claude agent, built on Anthropic's Claude Agent SDK."
+ "You are Claude Code, Anthropic's official CLI for Claude."
+ "You are Claude Code, Anthropic's official CLI for Claude."
```

简单粗暴，但管用。

> **注意**：从 Claude Agent SDK v2.1.113 开始，不再提供 cli.js 文件，此方法仅适用于 v2.1.112 及以下版本。如果 SDK 更新后找不到 cli.js，可以考虑让 AI 帮你改 cli.js 里的逻辑，或者修改你的 SDK 调用方式，linux.do 上有人整理好了 [调用模板](https://linux.do/t/topic/1956694/19)。

---

顺带一提，智谱这个判定是个自动策略——流量多的时候禁止所有非终端调用，流量少的时候恢复。所以这个 1302 可能时有时无。另外这个规则连官方 VSCode 插件也一起误伤了，毕竟 VSCode 插件也是走的 SDK 调用。草台班子实锤了。
