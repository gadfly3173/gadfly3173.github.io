---
title: Claude Agent SDK 身份伪装：让 API 把 SDK 当成 CLI
layout: post
typora-root-url: ..
hide_post_info: false
date: 2026-04-14 12:00:00
categories:
- 开发
- Claude
tags:
  - Claude
  - SDK
  - User-Agent
  - CLI
  - 身份伪装
permalink:
---

Claude Agent SDK 在调用 API 时会暴露自己是 SDK 的身份，导致 Claude 在 system prompt 中声称自己是 "running within the Claude Agent SDK"，而不是官方 CLI。如果你想让 Claude 表现得像原生 CLI，需要从多个层面进行身份伪装。

<!-- More -->

## 问题背景

### 遇到的实际问题

在维护 [jetbrains-cc-gui](https://github.com/zhukunpenglinyutong/jetbrains-cc-gui) 项目时，我发现通过 Claude Agent SDK 调用 Claude Code 时，系统提示词会变成：

```text
You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK.
```

或者：

```text
You are a Claude agent, built on Anthropic's Claude Agent SDK.
```

而智谱（作为 Anthropic API 的代理服务商）对系统提示词有严格要求：必须开头为 `You are Claude Code, Anthropic's official CLI for Claude.`，否则会返回速率限制错误：

```json
{"error":{"code":"1302","message":"您的账户已达到速率限制，请您控制请求频率"},"request_id":"2026041314372115099c8b3a024339"}
```

这个错误看起来像是速率限制，但实际上是因为系统提示词不符合智谱的要求而被拒绝。

### CLI 与 SDK 的身份差异

在 `cli.js`（位于 `~/.codemoss/dependencies/claude-sdk/node_modules`）中，`gv8()` 函数根据运行模式选择不同的 system prompt 首句：

```javascript
function gv8(q) {
  if (cq() === "vertex") return Fh1;
  if (q?.isNonInteractive) {
    if (q.hasAppendSystemPrompt) return feq;
    return Zeq;
  }
  return Fh1;
}
```

三个变体对应不同的身份声明：

| 变量 | 模式 | 提示词 | 是否暴露 SDK |
|------|------|--------|--------------|
| Fh1 | CLI / Vertex | `You are Claude Code, Anthropic's official CLI for Claude.` | 否 |
| feq | SDK 非交互 + hasAppendSystemPrompt | `You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK.` | 是 |
| Zeq | SDK 非交互（无 append） | `You are a Claude agent, built on Anthropic's Claude Agent SDK.` | 是 |

### API 层面的身份暴露

除了 system prompt，SDK 还会在 API 请求中暴露身份：

1. **User-Agent Header**：SDK 会发送包含 `agent-sdk` 版本的信息
2. **环境变量**：`CLAUDE_AGENT_SDK_VERSION` 和 `CLAUDE_CODE_ENTRYPOINT=sdk-ts` 会被传递给子进程
3. **请求头**：缺少 CLI 特有的 `x-app: cli` header

## 解决方案

CLI 身份伪装需要从两个层面入手：**System Prompt 层面** 和 **API 请求层面**。前者解决 Claude 自述身份的问题，后者解决 API 识别 SDK 的问题。两者可以独立使用，也可以组合使用。

### System Prompt 层面（方案一/方案二，任选其一）

SDK 在 `cli.js` 中通过 `gv8()` 函数根据运行模式选择不同的身份声明，导致非交互模式下 Claude 自称是 "running within the Claude Agent SDK"。有两种解决方式：

#### 方案一：修改 cli.js（直接破解）

直接修改 SDK 的 `cli.js`，将 `feq` 和 `Zeq` 的值改为与 `Fh1` 一致：

```javascript
// cli.js 修改前
feq="You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."
Zeq="You are a Claude agent, built on Anthropic's Claude Agent SDK."

// cli.js 修改后
feq="You are Claude Code, Anthropic's official CLI for Claude."
Zeq="You are Claude Code, Anthropic's official CLI for Claude."
```

这种方式简单粗暴，但每次 SDK 更新都需要重新修改。

#### 方案二：包装 System Prompt（推荐）

通过 preset append 形式强行追加身份约束，不修改 SDK 源码：

```javascript
const CLAUDE_CODE_IDENTITY_APPEND_PROMPT = `## Runtime Identity

You are Claude Code, Anthropic's official CLI for Claude.

When you describe your identity or runtime, use that phrasing. Do not proactively present yourself as a Claude Agent SDK agent unless the user explicitly asks about implementation details.`;

function wrapClaudeSdkSystemPrompt(systemPrompt) {
  const sections = [CLAUDE_CODE_IDENTITY_APPEND_PROMPT];

  if (typeof systemPrompt === "string" && systemPrompt.trim()) {
    sections.push(systemPrompt.trim());
  } else if (
    systemPrompt &&
    typeof systemPrompt === "object" &&
    systemPrompt.type === "preset" &&
    typeof systemPrompt.append === "string" &&
    systemPrompt.append.trim()
  ) {
    sections.push(systemPrompt.append.trim());
  }

  return {
    type: "preset",
    append: sections.join("\n\n")
  };
}
```

在调用 SDK 时，把原来的 `systemPrompt: config.systemPrompt` 改成：

```javascript
systemPrompt: wrapClaudeSdkSystemPrompt(config.systemPrompt)
```

### API 请求层面（方案三，可与方案一/方案二组合使用）

这是 [jetbrains-cc-gui](https://github.com/zhukunpenglinyutong/jetbrains-cc-gui) 项目采用的方案（完整实现代码可参考提交 [1aaec32](https://github.com/zhukunpenglinyutong/jetbrains-cc-gui/commit/1aaec32b80fde5fb693acdcbfce41fe9b499af69)），从多个层面伪装 CLI 身份。

#### 1. 配置环境变量

在进程启动时配置 CLI 身份环境变量：

```javascript
export function configureCliIdentity() {
  if (!process.env.CLAUDE_CODE_ENTRYPOINT) {
    process.env.CLAUDE_CODE_ENTRYPOINT = 'cli';
  }
  if (!process.env.USER_TYPE) {
    process.env.USER_TYPE = 'external';
  }
  delete process.env.CLAUDE_AGENT_SDK_VERSION;
}
```

#### 2. 构建 CLI 风格的 User-Agent

从 SDK 的 `manifest.json` 动态获取 CLI 版本：

```javascript
const FALLBACK_CLI_VERSION = '2.1.88';
let _cachedCliVersion = null;

function resolveCliVersionFromSdk() {
  if (_cachedCliVersion) return _cachedCliVersion;

  try {
    const depsBase = join(getCodemossDir(), 'dependencies');
    const sdkDir = join(depsBase, 'claude-sdk', 'node_modules', '@anthropic-ai', 'claude-agent-sdk');

    // Try manifest.json first (contains the bundled CLI version)
    const manifestPath = join(sdkDir, 'manifest.json');
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      if (manifest?.version) {
        _cachedCliVersion = manifest.version;
        return _cachedCliVersion;
      }
    }

    // Fallback: derive from SDK package.json version (0.x.y -> x.1.y)
    // e.g., SDK 0.2.88 -> CLI 2.1.88
    const pkgPath = join(sdkDir, 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      if (pkg?.version) {
        const parts = pkg.version.split('.');
        if (parts.length >= 3) {
          _cachedCliVersion = `${parts[1]}.1.${parts[2]}`;
          return _cachedCliVersion;
        }
      }
    }
  } catch {
    // Ignore errors, use fallback
  }

  _cachedCliVersion = FALLBACK_CLI_VERSION;
  return _cachedCliVersion;
}

export function getCliUserAgent() {
  const version = getCliVersion();
  const userType = process.env.USER_TYPE || 'external';
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT || 'cli';
  return `claude-cli/${version} (${userType}, ${entrypoint})`;
}
```

#### 3. 为 SDK 子进程构建干净的环境变量

```javascript
export function buildCliEnv() {
  const env = {
    ...process.env,
    CLAUDE_CODE_ENTRYPOINT: 'cli',
    USER_TYPE: 'external',
  };
  delete env.CLAUDE_AGENT_SDK_VERSION;
  return env;
}
```

#### 4. 在 Anthropic SDK 初始化时添加 CLI Headers

```javascript
const cliHeaders = {
  'x-app': 'cli',
  'User-Agent': getCliUserAgent()
};

const client = new Anthropic({
  authToken: apiKey,
  apiKey: null,
  baseURL: baseUrl || undefined,
  defaultHeaders: cliHeaders  // 关键：添加 CLI 风格的 headers
});
```

#### 5. 在 SDK query 调用时传入干净的环境

```javascript
const options = {
  cwd: workingDirectory,
  permissionMode: 'default',
  model: sdkModelName,
  maxTurns: 100,
  env: buildCliEnv(),  // 关键：使用 CLI 环境变量
  enableFileCheckpointing: true,
  tools: { type: 'preset', preset: 'claude_code' },
  // ...
};

const result = await query(options);
```

## 总结

完整的 CLI 身份伪装需要覆盖以下层面：

| 层面 | SDK 默认行为 | CLI 伪装方案 |
|------|--------------|--------------|
| System Prompt | 声明 SDK 身份 | 包装成 preset append 追加 CLI 身份约束 |
| User-Agent Header | 包含 agent-sdk 版本 | 使用 `claude-cli/{VERSION} (external, cli)` |
| x-app Header | 无 | 设置为 `cli` |
| CLAUDE_CODE_ENTRYPOINT | `sdk-ts` | `cli` |
| CLAUDE_AGENT_SDK_VERSION | 存在 | 删除 |
| USER_TYPE | 无 | `external` |

方案三解决了 API 请求层面的身份伪装，它确保了：

1. API 请求看起来像是来自 CLI（User-Agent、x-app header）
2. SDK 子进程继承的是 CLI 环境变量（删除 CLAUDE_AGENT_SDK_VERSION）

方案三可以与方案一或方案二组合使用：方案一/方案二解决 System Prompt 层面的身份声明，方案三解决 API 请求层面的身份识别。两者组合使用可以实现最完整的 CLI 身份伪装效果。

这样 Claude 就会表现得像原生 CLI，而不是 "running within the Claude Agent SDK"。
