---
title: 时区、时间戳与时间格式化：解决 SourceGit 中的时区问题
layout: post
typora-root-url: ..
hide_post_info: false
date: 2024-07-03 00:26:33
categories:
  - 技术
  - 开发
  - 时区
tags:
  - 时区
  - 时间戳
  - 时间格式化
  - SourceGit
  - C#
  - UTC
  - 夏令时
permalink:
---
时区、时间戳与时间格式化：解决 SourceGit 中的时区问题。本文由文心一言撰写，本人润色。

<!-- More -->

在参与 SourceGit 项目的过程中，我亲自遇到并解决了一个关于时区处理的问题。这个经历让我深刻体会到了在软件开发中正确处理时间和时区的重要性。

### 问题的发现

最初，是在 SourceGit 的 GitHub [Issue #229](https://github.com/sourcegit-scm/sourcegit/issues/229) 中，用户 `ghiboz` 报告了一个关于 commit 时间未使用正确时区的问题。他发现在使用自定义服务器时（该服务器位于中欧夏令时，CEST），SourceGit 列出的 commit 时间与预期的时区不符。

### 问题的分析

在查看问题详情后，我与仓库维护者 `love-linger` 一起分析了可能的原因。我们注意到，commit 的日期时间是从 `git log --pretty=format:"%ct"` 命令获取的，这是一个 Unix 时间戳，表示自 1970 年 1 月 1 日（UTC）以来的秒数。由于 Unix 时间戳不包含时区信息，如果在转换过程中处理不当，就可能导致时区错误。

经过进一步的讨论，我提出一个假设：问题可能出在初始化时将 UTC 时间戳转换为了本地时间，而不是在需要时（如显示给用户时）才进行转换。这样的做法可能不会反映夏令时等时区变化，从而导致时区问题。

出现问题的代码：

```csharp
public string CommitterTimeStr => _utcStart.AddSeconds(CommitterTime).ToString("yyyy/MM/dd HH:mm:ss");
public string CommitterTimeShortStr => _utcStart.AddSeconds(CommitterTime).ToString("yyyy/MM/dd");

private static readonly DateTime _utcStart = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).ToLocalTime();
```

### 解决方案的实施

为了解决这个问题，我与仓库的维护者 `love-linger` 进行了沟通，并提出了修改方案。我们决定在显示 commit 时间时，将 UTC 时间戳正确地转换为用户的本地时间，而不是在初始化时转换。

`love-linger` 迅速响应了我的建议，并在不久后提交了一个修复此问题的 [commit（57a2144）](https://github.com/sourcegit-scm/sourcegit/commit/57a2144777f6362d75212d6b3d160715a5e0c28b)。这个修复确保了 commit 时间在显示给用户时能够正确反映用户的本地时区。

修复后的代码：

```csharp
DateTime.UnixEpoch.AddSeconds(CommitterTime).ToLocalTime().ToString("yyyy/MM/dd HH:mm:ss")
```

### 总结与反思

在软件开发中，时区、时间戳和时间格式化是紧密相关的概念。特别是当涉及到全球范围内的用户时，正确地处理这些概念变得至关重要。其中，一个经常被忽略的陷阱是将 UTC 时间戳（例如 Unix 时间戳）直接转换为本地时间，并在转换后的基础上进行计算。这种做法在某些情况下，特别是在夏令时调整时，可能会导致问题。

夏令时是一种调整时间的制度，用于更有效地利用夏季的日光。它通常在每年的固定日期进行更改，使得时钟向前或向后调整一小时。然而，这种调整对于依赖固定 UTC 时间戳转换为本地时间的系统来说，可能会造成混乱。

当我们将 UTC 时间戳转换为本地时间时，我们实际上是在假设一个固定的偏移量，该偏移量代表本地时间与 UTC 时间之间的差异。但是，当夏令时调整发生时，这个偏移量会突然改变。如果我们事先将 UTC 时间戳转换为本地时间，并在这个基础上进行计算或显示，那么计算结果或显示的时间将会是错误的，因为它没有考虑到夏令时的变化。

正确的做法应该是在需要显示或计算时间时，再根据当前的夏令时状态将 UTC 时间戳转换为本地时间。这样可以确保无论是否发生夏令时调整，我们都能得到准确的时间和日期。

通过上面的分析，我们可以看到，正确处理时区、时间戳和时间格式化的关系对于确保软件在全球范围内提供准确、一致的时间显示至关重要。在涉及全球用户的软件开发中，我们应该始终关注这些细节，以避免出现因时区问题而导致的错误和混淆。
