---
title: Spring Security 5 中重复 antMatchers 覆盖授权规则的排查
layout: post
typora-root-url: ..
hide_post_info: false
date: 2026-08-19 17:00:00
categories:
- 开发
- Java
- Spring
- 安全
tags:
- Spring Security
- Spring Boot
- Java
- 权限控制
- antMatchers
permalink:
---

最近排查一个 Homolo Boot 5.2.2 项目的文件接口权限问题，现象非常反直觉：在业务项目的 `authorizeRequestBeforeDefault` 中加了两条看起来更严格的规则后，`tk.File` 的大部分接口反而不登录就能访问；把这两条规则注释掉，框架默认权限反而恢复正常。

这篇文章记录完整的排查过程，并借此说明 Spring Security 5 中一个容易被忽略的规则覆盖细节。

## 问题表现

业务项目的安全配置大致如下：

```java
@Override
protected void authorizeRequestBeforeDefault(
        ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry registry) {
    registry
            .antMatchers("/service/rest/tk.File/collection/list")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**")
            .authenticated();
}
```

Homolo Boot 基类随后注册默认规则：

```java
protected void authorizeRequestDefault(
        ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry registry) {
    registry
            .antMatchers("/service/rest/tk.File/**/cropImage")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**/jcropIframe")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**/info")
            .authenticated()
            .antMatchers("/service/rest/tk.File/**/listByIds")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**/meta")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**/upload")
            .authenticated()
            .antMatchers("/service/rest/tk.File/**/uploadImage")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**")
            .permitAll();
}
```

配置方法的调用顺序是：

```java
authorizeRequestBeforeDefault(registry);
authorizeRequestDefault(registry);
authorizeRequestAfterDefault(registry);
registry.anyRequest().denyAll();
```

按直觉，业务配置在前，应该优先于框架默认配置；业务规则是 `authenticated()`，看起来也应该比默认的 `permitAll()` 更严格。但实际行为却是：

| 请求 | 增加两条业务规则后 | 注释两条业务规则后 |
| --- | --- | --- |
| `tk.File/x/cropImage` | 匿名可访问 | 按默认规则限制 |
| `tk.File/x/meta` | 匿名可访问 | 按默认规则限制 |
| `tk.File/x/uploadImage` | 匿名可访问 | 按默认规则限制 |
| `tk.File/x/listByIds` | 匿名可访问 | 按默认规则限制 |
| `tk.File/x/info` | 匿名可访问 | 按默认规则限制 |
| `tk.File/collection/list` | 要求登录/相应权限 | 按默认规则处理 |
| `tk.File/x/list` | 需结合实际部署单独核对 | 需结合实际部署单独核对 |

> 注：「匿名可访问」使用不带 `Cookie`、`Authorization` 和 `justice-cloud-proxy-token` 的 `curl` 验证，并不是代理 token 自动登录造成的结果。

## 排除了三种常见误判

### 不是线上 jar 错误

线上版本的行为与带这两条配置的代码版本一致，问题不是线上部署了旧 jar，也不存在代码与线上行为不一致。

### 不是 `justice-cloud-proxy-token`

archives 项目确实注册了 `JusticeCloudProxyTokenFilter`，它可以通过 `justice-cloud-proxy-token` 请求头自动登录用户。但去掉所有请求头后，匿名 `curl` 仍然可以复现 `cropImage`、`meta`、`uploadImage`、`listByIds` 等接口的放行，因此代理自动登录不是本问题的原因。

### 不是 `authenticated()` 把匿名用户误判为已认证

如果 `authenticated()` 的语义整体失效，那么所有命中该表达式的接口应该一致放行或一致拒绝。实际结果与动作路径有关：`collection/list` 仍然被拦，而具体动作接口被放行。因此需要继续分析规则本身，而不是只分析当前 `Authentication` 对象。

## 根因：相同 matcher 被后注册的规则覆盖

### 业务与默认规则里出现了相同的 matcher

`antMatchers` 创建的是 `AntPathRequestMatcher`：

```java
// ExpressionUrlAuthorizationConfigurer
public C antMatchers(String... antPatterns) {
    return chainRequestMatchers(RequestMatchers.antMatchers(antPatterns));
}
```

`AntPathRequestMatcher` 的相等判断基于 pattern、HTTP method 和大小写配置：

```java
@Override
public boolean equals(Object obj) {
    if (!(obj instanceof AntPathRequestMatcher)) {
        return false;
    }
    AntPathRequestMatcher other = (AntPathRequestMatcher) obj;
    return this.pattern.equals(other.pattern)
            && this.httpMethod == other.httpMethod
            && this.caseSensitive == other.caseSensitive;
}
```

业务规则和基类默认规则中都出现了完全相同的 matcher：

```text
/service/rest/tk.File/**
```

因此它们不是两个互相独立的 key，而是 `equals()` 为 `true` 的同一个逻辑 key。

### 最终规则表是有序的 LinkedHashMap

构建安全元数据时，Spring Security 使用有序的 `LinkedHashMap`：

```java
// AbstractInterceptUrlConfigurer#createRequestMap
final LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>> createRequestMap() {
    LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>> requestMap = new LinkedHashMap<>();
    for (UrlMapping mapping : getUrlMappings()) {
        RequestMatcher matcher = mapping.getRequestMatcher();
        Collection<ConfigAttribute> configAttrs = mapping.getConfigAttrs();
        requestMap.put(matcher, configAttrs);
    }
    return requestMap;
}
```

Java `LinkedHashMap.put()` 遇到一个已经存在、并且 `equals()` 相等的 key 时有两个重要行为：

1. 不会新增第二个 entry；
2. 会替换原 entry 的 value，但**保留原 entry 的插入位置**。

于是整个注册过程实际得到的是这样一张表（`/**` 的 value 被后注册的 `permitAll()` 替换，但位置仍停留在业务注册时的位置）：

```text
/service/rest/tk.File/collection/list      → hasRole(ADMIN)     ← 业务注册，保留
/service/rest/tk.File/**                  → permitAll()        ← 业务注册，value 被基类覆盖
/service/rest/tk.File/**/cropImage        → hasRole(ADMIN)
/service/rest/tk.File/**/jcropIframe      → hasRole(ADMIN)
/service/rest/tk.File/**/info             → authenticated()
/service/rest/tk.File/**/listByIds        → hasRole(ADMIN)
/service/rest/tk.File/**/meta             → hasRole(ADMIN)
/service/rest/tk.File/**/upload           → authenticated()
/service/rest/tk.File/**/uploadImage      → hasRole(ADMIN)
```

也就是说，业务配置中的 `authenticated()` 并没有覆盖框架默认的 `permitAll()`；相反，**重复的 matcher 让框架后来注册的 `permitAll()` 替换了业务规则的授权 value，同时保留了宽泛 matcher 原来的优先位置**。

### 匹配时按表顺序取第一条命中

`DefaultFilterInvocationSecurityMetadataSource` 会按照表顺序取第一条匹配规则：

```java
// DefaultFilterInvocationSecurityMetadataSource#getAttributes
for (Map.Entry<RequestMatcher, Collection<ConfigAttribute>> entry
        : this.requestMap.entrySet()) {
    if (entry.getKey().matches(request)) {
        return entry.getValue();
    }
}
return null;
```

因此对 `tk.File/x/cropImage` 来说，它第一个就命中了 `/service/rest/tk.File/**` 的 `permitAll()`，根本走不到后面的 `cropImage` 管理员规则，于是被匿名放行。`meta`、`listByIds`、`uploadImage`、`info` 等接口同理。

### 为什么 `collection/list` 仍会被拦截

业务配置中还有一条不同的 matcher：`/service/rest/tk.File/collection/list`。它与基类的 `/service/rest/tk.File/**` 并不相等，不会被后面的 `permitAll()` 替换，因此在规则表中保留了：

```text
/service/rest/tk.File/collection/list → hasRole(ADMIN)
```

它位于 `/**` 之前，所以访问 `collection/list` 时，会命中这条管理员权限规则，而不是命中重复的 `/**` entry。

> 注意：`tk.File/x/list` 与 `collection/list` 的业务动作不同。`x/list` 会被 `RestServer` 按 `tk.File.list` 分发；如果 `FileController` 没有这个 action，它可能返回 action not found，而不是进入 `collection/list` 的管理员规则。线上若观察到 `x/list` 被拦截，应把它作为独立现象，继续核对实际请求路径、容器转发和部署版本，不能直接归因于 `collection/list` 的精确 matcher。

### 为什么 `tk.File` 的接口会共享同一组 matcher

Homolo Boot 的 `tk.File` 并不是每个方法都单独使用 Spring MVC 的 `@RequestMapping`，`FileController` 使用框架自己的注解：

```java
@RestService(name = "tk.File")
public class FileController {
    @ActionMethod
    public Object meta() { ... }

    @ActionMethod
    public Object info(RequestParameters params) { ... }

    @ActionMethod
    public void download(@ResourceVariable String id) { ... }
}
```

真正暴露 `/service/rest/**` 的是统一的 `RestServer`：

```java
@RestController
@RequestMapping("/service/rest")
public class RestServer {
    @GetMapping("/{module}/{resource}/{action}")
    public Object getHandleResourceAction(...) { ... }
}
```

`RestServer` 再通过 `RestServiceRegistry` 找到 `tk.File` 服务和 action。这个架构解释了为什么所有文件操作都共享 `/service/rest/tk.File/...` 这一组 URL matcher——它只是背景，并非本次问题的根因；根因仍然是重复的 `AntPathRequestMatcher` key 在 `LinkedHashMap` 中发生 value 覆盖。

## 正确修复方式

最简单、最安全的修复是删除业务中与框架默认规则重复的宽泛 matcher；如果业务确实需要额外限制 `collection/list`，可以保留那条更具体的规则：

```java
// 业务特有的精确规则，可以按实际需求保留
.antMatchers("/service/rest/tk.File/collection/list")
.hasRole(Role.ADMIN_ROLE_ID)

// 删除：与 Homolo Boot 默认规则重复，不能再次声明
// .antMatchers("/service/rest/tk.File/**").authenticated();
```

如果业务确实需要覆盖默认权限，不能只把具体 action 规则移动到 `authorizeRequestAfterDefault`——因为前面已经存在的 `/service/rest/tk.File/**` entry 仍会先匹配，后置的具体规则到不了。这个场景有两种可靠做法：

1. 删除业务重复声明的 `/service/rest/tk.File/**`，直接使用 Homolo Boot 的默认规则；
2. 修改框架的规则扩展方式，使业务能够在默认规则生成后重建完整的 `tk.File` 规则表，并保证具体 action 规则排在宽泛兜底规则之前。

如果只是恢复 Homolo Boot 已有的默认权限，第一种方式最稳妥。**不要在同一个 registry 中复制一份默认规则，也不要依赖 `before`/`after` hook 的方法名来推断最终顺序，必须检查最终生成的 matcher 列表。**

## 排查类似问题的验证清单

排查类似问题时，不能只看 Java 配置的书写顺序，应该同时检查：

1. `antMatchers` 实际创建的 matcher 类型；
2. matcher 的 `equals()` 和 `hashCode()`；
3. 规则最终写入的集合类型；
4. 重复 key 写入时是追加、覆盖，还是抛异常；
5. 最终 `FilterInvocationSecurityMetadataSource` 中的 matcher 顺序和授权属性。

可以先从源码确认：

```bash
grep -n "antMatchers\|createRequestMap" \
  spring-security-config-*/org/springframework/security/config/annotation/web/

javap -c -p WebSecurityConfig.class
```

实际请求也应使用完全匿名的方式验证，避免把代理 token、JWT、Cookie 或浏览器已有会话误认为权限来源：

```bash
curl -sS -D - -o /dev/null \
  http://localhost:8182/backend/service/rest/tk.File/x/cropImage
```

同时记录：

- HTTP status；
- `Location`；
- `Set-Cookie`；
- 响应体是否来自 `RestServer`/`FileController`；
- 当前进程启动时间和实际加载的 class 时间。

## 结论

本次问题的根因既不是 Homolo Boot 的 `tk.File` 默认权限没有定义，也不是匿名用户被错误地识别成了已认证用户，更不是代理 token 自动登录。

根因是两条等价的规则先后进入同一个 `LinkedHashMap` key：

```text
业务 before 规则：/service/rest/tk.File/** → authenticated()
框架 default 规则：/service/rest/tk.File/** → permitAll()
```

两个 `AntPathRequestMatcher` 相等，后注册的 `permitAll()` 替换了前面的授权 value，但保留了宽泛 matcher 的优先位置，导致它在具体的 `cropImage`、`meta`、`listByIds`、`uploadImage` 等默认规则之前匹配，最终把这些接口匿名放开。

因此，Spring Security URL 权限配置中最危险的不只是「规则写反了」，还包括：

> 不要在同一个授权 registry 中重复注册完全相同的 matcher，尤其不要以为后面的规则会追加成第二条规则。对于基于 map 的规则集合，重复 matcher 可能是一次 value 覆盖。
