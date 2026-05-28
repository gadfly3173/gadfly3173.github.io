---
title: SourceGit 内存泄漏排查记：哪来的 350 MB 的 TextMate Grammar
layout: post
typora-root-url: ..
hide_post_info: false
date: 2026-05-28 12:26:00
categories:
  - 开发
  - .NET
tags:
  - .NET
  - Avalonia
  - SourceGit
  - 内存泄漏
  - 踩坑
permalink:
---

SourceGit 用久了内存会悄悄涨到 1 GB 以上。排查发现，TextMate 语法高亮的 grammar 数据占了其中约 350 MB，而且是同一个 grammar 被反复加载、各自缓存。

<!-- More -->

## 问题表现

跑 SourceGit（AOT 版本）大约 6 天，开了 4～5 个仓库，进程 RSS 涨到了 **~1.15 GB**。通过 `/proc/<pid>/smaps` 分析匿名内存段，发现 TextMate grammar 的 scope 定义（`keyword.preprocessor.error.cs`、`meta.function-call.parameters.r` 等）在匿名 `rw-p` 段里大量重复——约 105 个 5～7 MB 的段各自包含了一套完整的 grammar 定义，每个段里大约 460～480 个 scope 关键词。

| 类别 | RSS | 占比 |
|------|-----|------|
| TextMate grammar 数据 | 345 MB | 30% |
| .NET LOH | 172 MB | 15% |
| .NET SOH | 138 MB | 12% |
| 其他 GC 段 | 204 MB | 18% |
| GPU / Skia 缓存 | 61 MB | 5% |
| 原生堆 | 55 MB | 5% |
| 其他 | 175 MB | 15% |

## 原因

问题出在 `TextMateHelper.CreateForEditor()` 这个工厂方法上：

```csharp
public static TextMate.Installation CreateForEditor(TextEditor editor)
{
    return editor.InstallTextMate(
        Application.Current?.ActualThemeVariant == ThemeVariant.Dark
            ? new RegistryOptionsWrapper(ThemeName.DarkPlus)
            : new RegistryOptionsWrapper(ThemeName.LightPlus));
}
```

每次调用都 `new` 了一个新的 `RegistryOptionsWrapper`。这个 wrapper 内部持有一个 `RegistryOptions _backend`，是 TextMateSharp 库提供的语法注册表，负责加载和管理 grammar 定义（`IRawGrammar`）和主题（`IRawTheme`）。

关键在于，`RegistryOptions` 内部有缓存机制——加载过的 grammar 会被存起来，后续通过 scope name 查找时直接返回。但这个缓存是**实例级别**的。每次 `new RegistryOptionsWrapper`，就带了一份新的独立缓存。

而 `CreateForEditor` 在至少 7 个 view 里被调用：

- `TextDiffView` — 代码差异查看器
- `Blame` — 逐行追溯
- `CommandLogContentPresenter` — 命令日志
- `MergeConflictEditor` — 冲突解决
- `AIAssistant` — AI 助手
- `SelfUpdate` — 自更新日志
- `RevisionFileContentViewer` — 历史文件查看

当你浏览不同文件的 diff 时，这些 view 会创建各自的 `TextMate.Installation`，每个 installation 绑定一个 `RegistryOptionsWrapper`，每个 wrapper 绑定一个独立的 `RegistryOptions`。虽然 view 销毁时会调用 `_textMate.Dispose()`，但在多个 view 生命周期重叠的阶段，同一套 grammar 数据在内存里同时存在多份副本——每次 `GrammarReader.ReadGrammarSync` 解析出来的 `IRawGrammar` 对象（包含 patterns、beginCaptures、endCaptures 等完整语法树）都被独立持有。

随着使用时间的增长，不同文件类型触发不同的 grammar 加载，每份 wrapper 里都缓存着相同 scope 的不同副本，累积到了 200～350 MB。

## 我的修复方案

思路比较直接——把 `RegistryOptionsWrapper` 做成按主题缓存的全局单例：

```csharp
private static RegistryOptionsWrapper s_darkRegistry;
private static RegistryOptionsWrapper s_lightRegistry;

public static TextMate.Installation CreateForEditor(TextEditor editor)
{
    var isDark = Application.Current?.ActualThemeVariant == ThemeVariant.Dark;
    var registry = isDark == true
        ? (s_darkRegistry ??= new RegistryOptionsWrapper(ThemeName.DarkPlus))
        : (s_lightRegistry ??= new RegistryOptionsWrapper(ThemeName.LightPlus));
    return editor.InstallTextMate(registry);
}
```

所有编辑器共享同一个 wrapper 实例，grammar 缓存自然也就只有一份了。但这个方案有个隐患：`RegistryOptionsWrapper` 上有一个 `LastScope` 属性，用于跟踪当前编辑器设置的语法 scope。如果多个编辑器共享同一个 wrapper 实例，`LastScope` 就会被互相覆盖，导致 `SetGrammarByFileName` 中的 scope 变更检测出错。需要把 `LastScope` 从 wrapper 移到 `TextMate.Installation` 或者每个 view 自己的状态里。

## 维护者的修复方案

维护者 [leo](https://github.com/longshuang) 在 [commit 0938fd4](https://github.com/sourcegit-scm/sourcegit/commit/0938fd49d4c47dff161f0a86e47987c672e58826) 中选择了另一条路——**不在 wrapper 层面做单例，而是在 grammar 加载的最底层做全局缓存**。

具体来说，在 `GrammarUtility` 静态类里加了两个静态字典：

```csharp
private static readonly Dictionary<string, IRawGrammar> s_cachedRawGrammars = new();
private static readonly Dictionary<ThemeName, IRawTheme> s_cachedTheme = new();
```

`GetGrammar` 的查找流程变成了：

1. 先查 `s_cachedRawGrammars`，命中直接返回（所有 wrapper 共享这个字典）
2. 未命中则走原来的逻辑（extra grammar → `_backend.GetGrammar`）
3. 加载完后存入 `s_cachedRawGrammars`，后续任何 wrapper 都能命中

theme 同理，`LoadTheme` 方法被改写成先查 `s_cachedTheme`，未命中才调用 `_backend.LoadTheme` 并缓存。

这样做的好处是每个 view 仍然有自己独立的 `RegistryOptionsWrapper` 和 `_backend` 实例，`LastScope` 等 per-view 状态不会被跨实例污染，不需要额外处理。同时 grammar/theme 对象层面的全局缓存保证了同一份 grammar 在内存中只存在一个副本。

## 两种方案的对比

| 维度 | 我的方案（全局单例 wrapper） | 维护者方案（缓存底层对象） |
|------|---|---|
| 缓存层级 | 在 `RegistryOptionsWrapper` 实例层面共享 | 在 `IRawGrammar` / `IRawTheme` 对象层面共享 |
| wrapper 实例数 | 全局最多 2 个（dark/light） | 每个 view 独立创建，和之前一样 |
| per-view 状态 | `LastScope` 需要从 wrapper 移出去，否则会被覆盖 | 天然安全，每个 wrapper 有独立的 `LastScope` |
| 改动量 | 小（改一个方法 + 移 `LastScope`） | 稍大（4 个文件，加缓存逻辑 + 主题切换响应） |
| 架构影响 | 改变了 wrapper 的生命周期管理方式 | 只改了数据加载层，不改变调用方行为 |

维护者的方案本质上是在 **数据层** 做去重，而不是在 **控制层** 做单例。这样更符合关注点分离的原则——wrapper 负责管理编辑器的状态（theme、lastScope 等），grammar 数据的共享由底层工具类负责。

## 额外修复

维护者在同一个 commit 里还顺手修了一个小问题。`SetGrammarByFileName` 方法原来是这样写的：

```csharp
// 修复前
var scope = reg.GetScope(filePath);
if (reg.LastScope != scope)
{
    reg.LastScope = scope;
    installation.SetGrammar(reg.GetScope(filePath)); // 又调用了一次 GetScope！
    GC.Collect();
}
```

`GetScope` 被调了两次——第一次拿到 `scope`，第二次又在 `SetGrammar` 参数里调了一遍。修复后直接用第一次拿到的 `scope`：

```csharp
// 修复后
var scope = reg.GetScope(filePath);
if (reg.LastScope != scope)
{
    reg.LastScope = scope;
    installation.SetGrammar(scope);
    GC.Collect();
}
```

另外，三个 view 文件（`AIAssistant`、`CommandLogContentPresenter`、`RevisionFileContentViewer`）都加上了对 `ActualThemeVariant` 变化的响应：

```csharp
else if (change.Property.Name == nameof(ActualThemeVariant) && change.NewValue != null)
    Models.TextMateHelper.SetThemeByApp(_textMate);
```

这是配合 `LoadTheme` 缓存改动，确保主题切换时能正确复用已缓存的 theme 对象。

## 小结

这类内存问题的典型模式是：**看起来有 cache，但实际上是 multiple independent caches**。每次 `new` 一个带内部缓存的对象，表面上缓存正常工作了，但实际上同一份数据被反复加载、分别持有。排查时直接看内存分布——350 MB 的 grammar scope 定义在匿名段里重复出现 100 多次，一眼就能看出问题所在。
